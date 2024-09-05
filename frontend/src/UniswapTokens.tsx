import { useState, useEffect } from 'react';
import axios from 'axios';

interface Token {
  id: string;
  name: string;
  symbol: string;
  volumeUSD: string;
}

export default function TopCoins() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopTokens = async () => {
      try {
        const response = await axios.post(
          'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
          {
            query: `
              {
                tokens(first: 100, orderBy: volumeUSD, orderDirection: desc) {
                  id
                  name
                  symbol
                  volumeUSD
                }
              }
            `
          }
        );
        setTokens(response.data.data.tokens);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch top tokens');
        setLoading(false);
        console.error(err);
      }
    };

    fetchTopTokens();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Top 100 Tokens on Uniswap</h1>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Symbol</th>
            <th>Volume (USD)</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token, index) => (
            <tr key={token.id}>
              <td>{index + 1}</td>
              <td>{token.name}</td>
              <td>{token.symbol}</td>
              <td>${parseFloat(token.volumeUSD).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
