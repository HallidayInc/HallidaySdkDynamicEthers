import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Buffer } from 'buffer'
window.Buffer = Buffer
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core'
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum'
import './index.css'
import App from './App.jsx'

const DYNAMIC_ENVIRONMENT_ID = import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID
const HALLIDAY_API_KEY = import.meta.env.VITE_HALLIDAY_API_KEY

if (
  !DYNAMIC_ENVIRONMENT_ID ||
  !HALLIDAY_API_KEY ||
  DYNAMIC_ENVIRONMENT_ID === '_your_dynamic_environment_id_here_' ||
  HALLIDAY_API_KEY === '_your_api_key_here_'
) {
  alert('Error: Missing API keys. See .env file.')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DynamicContextProvider
      settings={{
        environmentId: DYNAMIC_ENVIRONMENT_ID,
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
      <App />
    </DynamicContextProvider>
  </StrictMode>,
)
