import axios from 'axios';
import { useEffect, useState } from 'react';
import { parseEther } from 'viem';
import { useAccount } from 'wagmi';

const cryptoCoins = ['Mochi', 'TYBG', 'Brett', 'Miggles', 'Toshi', 'Keycat', 'Mobi'];
const durationOptions = ["every day", "every week"];

export default function OrderForm({grantPermissions, permissionsContext}: {grantPermissions: (allowance: bigint, period: number) => void, permissionsContext: any}) {
  const [selectedCoin, setSelectedCoin] = useState('');
  const [order, setOrder] = useState('Buy me based cat coins.');
  const [budget, setBudget] = useState('0.01');
  const [duration, setDuration] = useState('every day');
  const account = useAccount();

  const click = async () => {
    axios.post("/api/invest", {
      prompt: order,
      amount: budget,
    }).then((response) => {
      console.log(response.data);
    });
  };

  function optionToPeriod(option: string): number {
      switch (option) {
          case 'every day':
              return 86400; // 24 hours in seconds
          case 'every week':
              return 604800; // 7 days in seconds
          case 'every 4 weeks':
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

      <button
        disabled={!account.isConnected}
        onClick={() =>
          grantPermissions(parseEther(budget), optionToPeriod(duration))
        }
        className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Memescribe
      </button>

      {permissionsContext && (
        <button
          className="w-full bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={click}
        >
          Buy me coins
        </button>
      )}
    </div>
  );
}
