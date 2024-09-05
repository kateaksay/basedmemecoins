import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Buffer } from "buffer";
import ReactDOM from "react-dom/client";
import { WagmiProvider } from "wagmi";
import "./index.css";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { baseSepolia } from "viem/chains"
import App from "./App.tsx";
import { config } from "./wagmi.ts";

globalThis.Buffer = Buffer;

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <OnchainKitProvider
        apiKey={import.meta.env.PUBLIC_ONCHAINKIT_API_KEY}
        chain={baseSepolia}
      >
        <App />
      </OnchainKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);
