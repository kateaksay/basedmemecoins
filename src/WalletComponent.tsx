import React from "react";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownLink,
  WalletDropdownDisconnect,
  WalletDropdownBasename,
  WalletDropdownFundLink,
} from "@coinbase/onchainkit/wallet";
import {
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance,
} from "@coinbase/onchainkit/identity";

const WalletComponent: React.FC = () => {
  return (
    <Wallet>
      <ConnectWallet withWalletAggregator={true} text={"Wallet"} className="">
        <Avatar className="h-6 w-6" />
        <Name />
      </ConnectWallet>
      <WalletDropdown>
        <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick={true}>
          <Avatar />
          <Name />
          <Address />
          <EthBalance />
        </Identity>
        <WalletDropdownBasename />
        <WalletDropdownLink icon="wallet" href="https://wallet.coinbase.com">
          Go to Wallet Dashboard
        </WalletDropdownLink>
        <WalletDropdownFundLink />
        <WalletDropdownDisconnect />
      </WalletDropdown>
    </Wallet>
  );
};

export default WalletComponent;
