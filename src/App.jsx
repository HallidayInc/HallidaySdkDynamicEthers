import { useEffect } from 'react';
import { useDynamicContext, useIsLoggedIn } from '@dynamic-labs/sdk-react-core'
import { isEthereumWallet } from '@dynamic-labs/ethereum'
import { openHallidayPayments, initializeClient } from '@halliday-sdk/payments'
import { connectSigner } from '@halliday-sdk/payments/ethers'
import { getSigner } from '@dynamic-labs/ethers-v6'
import { wrapSignerWithDynamicOverrides } from './dynamic-ethers-wrappers'
import './App.css'

const HALLIDAY_PUBLIC_API_KEY = import.meta.env.VITE_HALLIDAY_API_KEY

function App() {
  const { sdkHasLoaded, primaryWallet, setShowAuthFlow, handleLogOut } = useDynamicContext();
  const isLoggedIn = useIsLoggedIn();

  useEffect(() => {
    initializeClient({
      apiKey: HALLIDAY_PUBLIC_API_KEY,
      onReady: () => { console.log('Preloaded and ready'); },
      onError: (error) => { console.error(error); },
    });
  }, []);

  const launchHalliday = async () => {
    if (!primaryWallet || !isEthereumWallet(primaryWallet)) return;

    const address = primaryWallet.address;
    const connectedSigner = connectSigner(async () => {
      // Remember to add Base in the Dynamic dashboard beforehand (see README)
      return wrapSignerWithDynamicOverrides(
        await getSigner(primaryWallet),
        primaryWallet
      );
    });

    openHallidayPayments({
      apiKey: HALLIDAY_PUBLIC_API_KEY,
      outputs: ['base:0x', 'base:0x833589fcd6edb6e08f4c7c32d4f71b54bda02913'],
      windowType: 'MODAL',
      owner: { address, ...connectedSigner },
      funder: { address, ...connectedSigner }
    }).catch(e => console.error('Halliday error:', e.issues));
  };

  if (!sdkHasLoaded) {
    return <p>Loading...</p>
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
      <p>Wallet: {primaryWallet?.address}</p>
      <button onClick={launchHalliday}>Open Halliday</button>
    </div>
  );
}

export default App