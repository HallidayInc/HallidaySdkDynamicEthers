# Halliday SDK Example with Dynamic Wallet and Ethers.js

Halliday Payments SDK integration example using a Dynamic embedded wallet. This project uses the Vite React template and the Dynamic Labs React SDK. To connect the Dynamic wallet to the app, Ethers.js 6 is used with the Dynamic SDK.

### Keys

Get a Dynamic environment ID: https://app.dynamic.xyz/

Get a Halliday API key: https://halliday.xyz/contact

### Setup

This example app implements swaps on Base chain. The Dynamic account must have Base enabled before attempting to run this example. This can be configured in the dashboard using the toggles here: https://app.dynamic.xyz/dashboard/chains-and-networks#evm.

### Run

Edit the `.env` file by inserting the Dynamic and Halliday keys.

```
VITE_DYNAMIC_ENVIRONMENT_ID=_your_dynamic_environment_id_here_
VITE_HALLIDAY_API_KEY=_your_api_key_here_
```

Run the app using the command line:

```
npm install
npm run dev
```
