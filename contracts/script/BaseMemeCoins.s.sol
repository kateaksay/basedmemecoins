// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {BasedMemeCoins} from "../src/BasedMemeCoins.sol";
import {BasedMemeCoinNFT} from "../src/BasedMemeCoinNFT.sol";

contract BasedMemeCoinsScript is Script {
    BasedMemeCoins public basedMemeCoins;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        basedMemeCoins = new BasedMemeCoins(address(0x0));

        vm.stopBroadcast();
    }
}
