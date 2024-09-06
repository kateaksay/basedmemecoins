import axios from 'axios';
import { useEffect, useState } from 'react';
import { decodeEventLog, encodeFunctionData, parseEther, TransactionReceipt } from 'viem';
import { useAccount, useWalletClient } from 'wagmi';
import { signWithCredential } from 'webauthn-p256';
import { contractAbi, contractAddress } from './MemescribeContract';
import { useSendCalls, useCallsStatus } from 'wagmi/experimental';
import NFT from './NFT';

const cryptoCoins = ['Mochi', 'TYBG', 'Brett', 'Miggles', 'Toshi', 'Keycat', 'Mobi'];
const durationOptions = ["every day", "every week"];

export default function OrderForm({
  grantPermissions,
  permissionsContext,
  credential,
}: {
  grantPermissions: (allowance: bigint, period: number) => void;
  permissionsContext: any;
  credential: any;
}) {
  const [selectedCoin, setSelectedCoin] = useState("");
  const [order, setOrder] = useState("Buy me based cat coins.");
  const [budget, setBudget] = useState("0.01");
  const [duration, setDuration] = useState("every day");
  const [callsId, setCallsId] = useState<string>();
  const [submitted, setSubmitted] = useState(false);
  const [tokenIds, setTokenIds] = useState<(string | null)[]>([]);

  const account = useAccount();
  const { data: walletClient } = useWalletClient({ chainId: 84532 });
  const { sendCallsAsync } = useSendCalls();
  const { data: callsStatus } = useCallsStatus({
    id: callsId as string,
    query: {
      enabled: !!callsId,
      refetchInterval: (data) =>
        data.state.data?.status === "PENDING" ? 500 : false,
    },
  });

    const [transactions, setTransactions] = useState<TransactionReceipt[]>([]);

    useEffect(() => {
      if (callsStatus?.receipts?.[0]) {
        const newReceipt = callsStatus.receipts[0] as TransactionReceipt;
        setTransactions([...transactions, newReceipt]);

        // Extract token ID from the transaction receipt
        extractTokenIds(newReceipt).then((newTokenIds) => {
          setTokenIds((prev) => [...prev, newTokenIds ? newTokenIds.join(',') : null]);
        });
      }
    }, [callsStatus?.receipts]);

    const extractTokenIds = async (
      receipt: TransactionReceipt
    ): Promise<string[] | null> => {
      let ids = [];
      for (const log of receipt.logs) {
        if (log.address === contractAddress) {
          try {
            const event = decodeEventLog({
              abi: contractAbi,
              data: log.data,
              topics: log.topics,
            });

            if (event.eventName === "MemeCoinBought" && event.args) {
              ids.push((event.args as any).tokenId.toString());
            }
          
        } catch (error) {
          console.error("Error decoding log:", error);
        }
      }
    }
    return ids;
  };

  const onInvest = async () => {
    setSubmitted(true);
    axios
      .post("/api/invest", {
        prompt: order,
        amount: budget,
      })
      .then(async (response) => {
        const coins = response.data.coins;
        const coinCalls = coins.map((coin: any) => ({
          to: contractAddress,
          value: parseEther(coin.amount),
          data: encodeFunctionData({
            abi: contractAbi,
            functionName: "buyCoin",
            args: [coin.name, coin.symbol],
          }),
        }));

        if (
          account.address &&
          permissionsContext &&
          credential &&
          walletClient
        ) {
          setCallsId(undefined);
          try {
            const callsId = await sendCallsAsync({
              calls: coinCalls,
              capabilities: {
                permissions: {
                  context: permissionsContext,
                },
                paymasterService: {
                  url: import.meta.env.VITE_PAYMASTER_URL, // Your paymaster service URL
                },
              },
              signatureOverride: signWithCredential(credential),
            });
            setCallsId(callsId);
          } catch (e: unknown) {
            console.error(e);
          }
          setSubmitted(false);
        }
      });
  };

  function optionToPeriod(option: string): number {
    switch (option) {
      case "every day":
        return 86400; // 24 hours in seconds
      case "every week":
        return 604800; // 7 days in seconds
      case "every 4 weeks":
        return 2419200; // 4 weeks in seconds
      default:
        return 86400; // Default to daily if unknown option
    }
  }

  useEffect(() => {
    if (selectedCoin) {
      setOrder(order + `\nBuy me ${selectedCoin}.`);
    }
  }, [selectedCoin]);

  return (
    <div
      className="max-w-md mx-auto mt-96 p-6 bg-green-200 text-black rounded-lg shadow-lg"
      style={{ backgroundColor: "rgba(235, 241, 63, 0.87)" }}
    >
      <div className="flex justify-between space-x-4 mb-4">
        <div className="grow"></div>
        <div className="flex flex-col justify-center w-1/3">
          <select
            value={selectedCoin}
            onChange={(e) => setSelectedCoin(e.target.value)}
            className="w-full px-3 py-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-orange-100 font-bold"
          >
            <option value="">Add a coin</option>
            {cryptoCoins.map((coin) => (
              <option key={coin} value={coin}>
                {coin}
              </option>
            ))}
          </select>
        </div>
      </div>

      <textarea
        value={order}
        onChange={(e) => setOrder(e.target.value)}
        rows={4}
        placeholder="Tell me what you want to buy"
        className="flex-grow px-3 py-2 w-full border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-orange-100 font-bold"
      />

      <div className="flex space-x-4 mb-6">
        <div className="flex-1 relative">
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="Budget"
            step="0.01"
            min="0"
            className="w-full px-3 py-2 pr-12 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-orange-100 font-bold"
          />
          <span className="absolute right-8 top-2 text-gray-500 font-bold">
            ETH
          </span>
        </div>

        <select
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="flex-1 px-3 py-2 border-2 border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-orange-100 font-bold"
        >
          {durationOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {!permissionsContext && (
        <button
          disabled={!account.isConnected}
          onClick={() =>
            grantPermissions(parseEther(budget), optionToPeriod(duration))
          }
          className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Memescribe
        </button>
      )}

      {permissionsContext && (
        <div>
          {submitted ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 bg-purple-500 rounded-full animate-bounce"></div>
              <div className="w-4 h-4 bg-purple-500 rounded-full animate-bounce delay-100"></div>
              <div className="w-4 h-4 bg-purple-500 rounded-full animate-bounce delay-200"></div>
              <p className="text-purple-500 font-bold">Buying based coins...</p>
            </div>
          ) : (
            <button
              className="w-full bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={onInvest}
              disabled={submitted}
            >
              Buy me coins
            </button>
          )}
          <div className="flex flex-row flex-wrap gap-2 mt-4">
            {transactions.map((transaction, index) => (
              tokenIds[index] ? tokenIds[index].split(',').map((id) => (
                <NFT
                  key={id}
                  tokenId={id}
                  transactionHash={transaction.transactionHash}
                />
              )) : null
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
