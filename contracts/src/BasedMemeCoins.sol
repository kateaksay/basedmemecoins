// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {PermissionCallable} from "smart-wallet-permissions/src/mixins/PermissionCallable.sol";
import {BasedMemeCoinNFT} from "./BasedMemeCoinNFT.sol";
import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract BasedMemeCoins is PermissionCallable, IERC721Receiver {
    BasedMemeCoinNFT public basedMemeCoinNFT;

    constructor(address _basedMemeCoinNFT) {
        basedMemeCoinNFT = BasedMemeCoinNFT(_basedMemeCoinNFT);
    }

    // define which function selectors are callable by permissioned userOps
    function supportsPermissionedCallSelector(bytes4 selector) public pure override returns (bool) {
        return selector == BasedMemeCoins.buyCoin.selector;
    }
    // callable by permissioned userOps
    function buyCoin(string memory coinName, string memory coinSymbol) payable external {
        // code to buy coin
        uint256 tokenId = basedMemeCoinNFT.mintMemeCoin(coinName, coinSymbol, msg.value);
        emit MemeCoinBought(tokenId, msg.sender, msg.value);
        basedMemeCoinNFT.transferFrom(address(this), msg.sender, tokenId);
    }

    error NotTokenOwner();
    error TransferFailed();

    function sellCoin(uint256 tokenId) public returns (bool) {
        if (basedMemeCoinNFT.ownerOf(tokenId) != msg.sender) revert NotTokenOwner();
        uint256 salePrice = basedMemeCoinNFT.getMemeCoin(tokenId).cost;
        
        basedMemeCoinNFT.transferFrom(msg.sender, address(this), tokenId);
        
        (bool success, ) = payable(msg.sender).call{value: salePrice}("");
        if (!success) revert TransferFailed();
        
        emit MemeCoinSold(tokenId, msg.sender, salePrice);
        
        return true;
    }

    event MemeCoinSold(uint256 indexed tokenId, address indexed seller, uint256 salePrice);
    event MemeCoinBought(uint256 indexed tokenId, address indexed buyer, uint256 cost);

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external override returns (bytes4) {
        // Add any custom logic here if needed
        return this.onERC721Received.selector;
    }
}