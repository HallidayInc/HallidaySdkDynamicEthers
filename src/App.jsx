import { useEffect } from 'react'
import { useDynamicContext, useIsLoggedIn } from '@dynamic-labs/sdk-react-core'
import { isEthereumWallet } from '@dynamic-labs/ethereum'
import { openHallidayPayments, initializeClient } from '@halliday-sdk/payments'
import { connectSigner } from '@halliday-sdk/payments/ethers'
import { getSigner } from '@dynamic-labs/ethers-v6'
import './App.css'

const HALLIDAY_PUBLIC_API_KEY = import.meta.env.VITE_HALLIDAY_API_KEY
const hallidayOutputs = [
  'base:0x',
  'base:0x833589fcd6edb6e08f4c7c32d4f71b54bda02913'
];

function App() {
  const { sdkHasLoaded, primaryWallet, setShowAuthFlow, handleLogOut } = useDynamicContext();
  const isLoggedIn = useIsLoggedIn();

  useEffect(() => {
    initializeClient({
      apiKey: HALLIDAY_PUBLIC_API_KEY,
      outputs: hallidayOutputs,
      onReady: () => { console.log('Preloaded and ready'); },
      onError: (error) => { console.error(error); },
    });
  }, []);

  const launchHalliday = async () => {
    if (!primaryWallet || !isEthereumWallet(primaryWallet)) return;

    const connectedSigner = connectSigner(async () => {
      // Switch to Base before getting the signer so it's on the right chain
      await primaryWallet.connector.switchNetwork({ networkChainId: 8453 });
      return await getSigner(primaryWallet);
    });

    openHallidayPayments({
      apiKey: HALLIDAY_PUBLIC_API_KEY,
      outputs: hallidayOutputs,
      funder: connectedSigner,
      userWallet: connectedSigner,
    });
  };

  if (!sdkHasLoaded) {
    return <div>Loading...</div>
  }

  if (!isLoggedIn) {
    return (
      <button onClick={() => setShowAuthFlow(true)}>
        Sign in
      </button>
    )
  }

  return (
    <div>
      <button onClick={handleLogOut}>Log out</button>
      <div>Wallet: {primaryWallet?.address}</div>
      <button onClick={launchHalliday}>Open Halliday</button>
    </div>
  );
}

export default App
