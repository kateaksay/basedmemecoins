import { useState } from "react";
import { Hex, toFunctionSelector } from "viem";
import { useAccount, useConnect } from "wagmi";
import {
  useGrantPermissions,
} from "wagmi/experimental";
import {
  createCredential,
  P256Credential
} from "webauthn-p256";
import { contractAddress } from "./MemescribeContract.ts";

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

  const account = useAccount();
  const { connectors, connect } = useConnect();
  const { grantPermissionsAsync } = useGrantPermissions();
  


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

        <OrderForm 
        grantPermissions={grantPermissions} 
        permissionsContext={permissionsContext}
        credential={credential}  />

      </div>
    </div>
  );
}

export default App;
