import { useDynamicContext, useIsLoggedIn } from '@dynamic-labs/sdk-react-core'
import { isEthereumWallet } from '@dynamic-labs/ethereum'
import {
  openHallidayPayments,
  openWithdraw,
  openActivity,
  initializeClient,
} from '@halliday-sdk/payments'
import { connectSigner } from '@halliday-sdk/payments/ethers'
import { getSigner } from '@dynamic-labs/ethers-v6'

const HALLIDAY_PUBLIC_API_KEY = import.meta.env.VITE_HALLIDAY_API_KEY
const hallidayOutputs = [
  'base:0x',
  'base:0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
]

initializeClient({
  apiKey: HALLIDAY_PUBLIC_API_KEY,
  outputs: hallidayOutputs,
  onReady: () => { console.log('Preloaded and ready') },
  onError: (error) => { console.error(error) },
})

function App() {
  const { sdkHasLoaded, primaryWallet, setShowAuthFlow, handleLogOut } = useDynamicContext()
  const isLoggedIn = useIsLoggedIn()

  const enabled = isLoggedIn && !!primaryWallet && isEthereumWallet(primaryWallet)

  const userWallet = enabled
    ? connectSigner(async () => {
        await primaryWallet.connector.switchNetwork({ networkChainId: 8453 })
        return await getSigner(primaryWallet)
      })
    : null

  if (!sdkHasLoaded) return <div>Loading...</div>

  return (
    <div className="halliday-container">
      <h1>Halliday SDK Dynamic Ethers Example</h1>
      <button onClick={isLoggedIn ? handleLogOut : () => setShowAuthFlow(true)}>
        {isLoggedIn ? 'Log out' : 'Connect'}
      </button>
      <button disabled={!enabled} onClick={() => openHallidayPayments({ userWallet })}>
        Deposit with Halliday
      </button>
      <button
        disabled={!enabled}
        onClick={() => openWithdraw({ withdrawInputs: hallidayOutputs, withdrawFunder: userWallet })}
      >
        Withdraw
      </button>
      <button disabled={!enabled} onClick={openActivity}>Activity</button>
    </div>
  )
}

export default App
