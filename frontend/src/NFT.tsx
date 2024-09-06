import React, { useState, useEffect } from 'react';
import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import { basedMemeCoinNFT_ABI, contractAddressNFT } from './BasedMemeCoinNFT_abi';
import axios from 'axios';

interface NFTProps {
  tokenId: string;
  transactionHash: string;
}

const NFT: React.FC<NFTProps> = ({ tokenId, transactionHash }) => {
  const [nftData, setNftData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const client = createPublicClient({
    chain: baseSepolia,
    transport: http()
  });
  

  const getTokenMetadata = async (tokenId: string): Promise<any> => {
    try {
      const uri = await client.readContract({
        address: contractAddressNFT,
        abi: basedMemeCoinNFT_ABI,
        functionName: "tokenURI",
        args: [BigInt(tokenId)],
      });

      const response = await axios.get(uri as string);
      const metadata = response.data;
      return metadata;
    } catch (error) {
      console.error("Error fetching metadata:", error);
      throw error;
    }
  };


  useEffect(() => {
    const fetchNFTData = async () => {
      getTokenMetadata(tokenId).then((data) => {
        data.transactionHash = transactionHash;
        setNftData(data);
        setLoading(false);
      }).catch((error) => {
        setError("Error fetching NFT data: " + error);
        setLoading(false);
      });
    };

    fetchNFTData();
  }, [tokenId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!nftData) return <div>No NFT data found</div>;

  return (
    <a href={`https://sepolia.etherscan.io/tx/${nftData.transactionHash}`} target="_blank" rel="noopener noreferrer">
        <div className="w-32 bg-white rounded-lg shadow-lg p-1">
        <img
            className=""
            src="https://raw.seadn.io/files/cdc553b36fed52f31fea91729181ba07.svg"
            alt={nftData.name}
        />
        </div>
    </a>
  );
};

export default NFT;
