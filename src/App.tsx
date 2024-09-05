import { useEffect, useState } from "react";
import { encodeFunctionData, Hex, parseEther, toFunctionSelector, TransactionReceipt } from "viem";
import { useAccount, useConnect, useWalletClient } from "wagmi";
import {
  useCallsStatus,
  useGrantPermissions,
  useSendCalls,
} from "wagmi/experimental";
import {
  createCredential,
  P256Credential,
  signWithCredential,
} from "webauthn-p256";
import { contractAbi, contractAddress } from "./MemescribeContract.ts";

import npmImage from "./assets/basedmemelogo.jpg";

import "@coinbase/onchainkit/styles.css";

import WalletComponent from "./WalletComponent.tsx";
import OrderForm from "./OrderForm.tsx";

export function App() {
  const [permissionsContext, setPermissionsContext] = useState<
    Hex | undefined
  >();
  const [credential, setCredential] = useState<
    undefined | P256Credential<"cryptokey">
  >();
  const [callsId, setCallsId] = useState<string>();
  const [submitted, setSubmitted] = useState(false);

  const account = useAccount();
  const { connectors, connect } = useConnect();
  const { grantPermissionsAsync } = useGrantPermissions();
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
      setTransactions([...transactions, callsStatus.receipts[0] as TransactionReceipt]);
    }
  }, [callsStatus?.receipts]);

  const login = async () => {
    connect({ connector: connectors[0] });
  };

  const grantPermissions = async (allowance: bigint, period: number) => {
    if (account.address) {
      const newCredential = await createCredential({ type: "cryptoKey" });
      const response = await grantPermissionsAsync({
        permissions: [
          {
            address: account.address,
            chainId: 84532,
            expiry: 17218875770,
            signer: {
              type: "key",
              data: {
                type: "secp256r1",
                publicKey: newCredential.publicKey,
              },
            },
            permissions: [
              {
                type: "native-token-recurring-allowance",
                data: {
                  allowance: allowance,
                  start: Math.floor(Date.now() / 1000),
                  period: period,
                },
              },
              {
                type: "allowed-contract-selector",
                data: {
                  contract: contractAddress,
                  selector: toFunctionSelector(
                    "permissionedCall(bytes calldata call)"
                  ),
                },
              },
            ],
          },
        ],
      });
      const context = response[0].context as Hex;
      setPermissionsContext(context);
      setCredential(newCredential);
    }
  };

  const click = async () => {
    if (account.address && permissionsContext && credential && walletClient) {
      setSubmitted(true);
      setCallsId(undefined);
      try {
        const callsId = await sendCallsAsync({
          calls: [
            {
              to: contractAddress,
              value: parseEther("0.0001"),
              data: encodeFunctionData({
                abi: contractAbi,
                functionName: "buyCoin",
                args: ["Mochi", "MOCHI", parseEther("0.0001")],
              }),
            },
          ],
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
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${npmImage})` }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end">
          {account.address && <WalletComponent />}
          {!account.address && (
            <button
              onClick={login}
              type="button"
              className="bg-purple-500 text-white text-xl text-bold text-black px-4 py-2 rounded"
            >
              Log in
            </button>
          )}
        </div>

        <OrderForm grantPermissions={grantPermissions} />

        <div className="flex flex-col items-center gap-2 mt-4 bg-white bg-opacity-80 rounded-lg p-4">
          {account.address && permissionsContext && (
            <button
              type="button"
              onClick={click}
              className="bg-purple-500 text-white text-xl text-bold text-black px-4 py-2 rounded"
              disabled={
                submitted ||
                (!!callsId && !(callsStatus?.status === "CONFIRMED"))
              }
            >
              Buy Me Meme Coins
            </button>
          )}

          {transactions.map((transaction) => (
            <a
              href={`https://base-sepolia.blockscout.com/tx/${transaction.transactionHash}`}
              target="_blank"
              className="mt-4 hover:underline"
            >
              Transaction {transaction.transactionHash.slice(0, 10)}... {transaction.status}.
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
