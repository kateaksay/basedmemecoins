pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BasedMemeCoinNFT is ERC721, Ownable {
    uint256 nextTokenId = 0;
    string private _baseTokenURI;

    struct MemeCoin {
        string name;
        string symbol;
        uint256 cost;
    }

    mapping(uint256 => MemeCoin) public memeCoins;

    constructor() ERC721("BasedMemeCoinNFT", "BMCNFT") Ownable(msg.sender) {}

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string memory newBaseURI) public onlyOwner {
        _baseTokenURI = newBaseURI;
    }

    function mintMemeCoin(string memory name, string memory symbol, uint256 cost) public returns (uint256) {        
        uint256 tokenId = nextTokenId++;
        _safeMint(msg.sender, tokenId);
        memeCoins[tokenId] = MemeCoin(name, symbol, cost);
        return tokenId;
    }

    function getMemeCoin(uint256 tokenId) public view returns (MemeCoin memory) {
        require(memeCoins[tokenId].cost > 0, "MemeCoin does not exist");
        return memeCoins[tokenId];
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner()).transfer(balance);
    }
}
