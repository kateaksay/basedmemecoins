export const contractAddress = "0xdeeb95322a1fcb1adfc732d0136b36581dbf0e07";
export const contractAbi = [
  {
    type: "constructor",
    inputs: [
      { name: "_basedMemeCoinNFT", type: "address", internalType: "address" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "basedMemeCoinNFT",
    inputs: [],
    outputs: [
      { name: "", type: "address", internalType: "contract BasedMemeCoinNFT" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "buyCoin",
    inputs: [
      { name: "coinName", type: "string", internalType: "string" },
      { name: "coinSymbol", type: "string", internalType: "string" },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "onERC721Received",
    inputs: [
      { name: "operator", type: "address", internalType: "address" },
      { name: "from", type: "address", internalType: "address" },
      { name: "tokenId", type: "uint256", internalType: "uint256" },
      { name: "data", type: "bytes", internalType: "bytes" },
    ],
    outputs: [{ name: "", type: "bytes4", internalType: "bytes4" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "permissionedCall",
    inputs: [{ name: "call", type: "bytes", internalType: "bytes" }],
    outputs: [{ name: "res", type: "bytes", internalType: "bytes" }],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "sellCoin",
    inputs: [{ name: "tokenId", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "supportsPermissionedCallSelector",
    inputs: [{ name: "selector", type: "bytes4", internalType: "bytes4" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "pure",
  },
  {
    type: "event",
    name: "MemeCoinBought",
    inputs: [
      {
        name: "tokenId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "buyer",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "cost",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "MemeCoinSold",
    inputs: [
      {
        name: "tokenId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "seller",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "salePrice",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "AddressEmptyCode",
    inputs: [{ name: "target", type: "address", internalType: "address" }],
  },
  { type: "error", name: "FailedCall", inputs: [] },
  {
    type: "error",
    name: "NotPermissionCallable",
    inputs: [{ name: "selector", type: "bytes4", internalType: "bytes4" }],
  },
  { type: "error", name: "NotTokenOwner", inputs: [] },
  { type: "error", name: "TransferFailed", inputs: [] },
];