import { TypedDataEncoder } from 'ethers'

async function waitForNetworkSwitch(wallet, chainId, maxAttempts = 10) {
  for (let i = 0; i < maxAttempts; i++) {
    if (await wallet.getNetwork() === chainId) return true;
    await new Promise(r => setTimeout(r, 500));
  }
  throw new Error(`Network switch to ${chainId} timed out`);
}

async function signTypedDataViaDynamic(wallet, domain, types, value) {
  try {
    const client = await wallet.getWalletClient();
    return await client.signTypedData({
      account: wallet.address,
      domain,
      types,
      primaryType: Object.keys(types).find(k => k !== 'EIP712Domain'),
      message: value,
    });
  } catch {
    const provider = await wallet.connector.getEthereumProvider?.() || await wallet.getWalletClient();
    const payload = TypedDataEncoder.getPayload(domain, types, value);
    return await provider.request({
      method: 'eth_signTypedData_v4',
      params: [wallet.address, JSON.stringify(payload)],
    });
  }
}

export function wrapSignerWithDynamicOverrides(signer, wallet) {
  const wrappedProvider = new Proxy(signer.provider, {
    get(target, prop) {
      if (prop === 'send') {
        return async (method, params) => {
          if (method === 'wallet_switchEthereumChain' || method === 'wallet_addEthereumChain') {
            const chainId = parseInt(params?.[0]?.chainId, 16);
            await wallet.connector.switchNetwork({ networkChainId: chainId });
            await waitForNetworkSwitch(wallet, chainId);
            return null;
          }
          return target.send(method, params);
        };
      }
      const val = target[prop];
      return typeof val === 'function' ? val.bind(target) : val;
    }
  });

  return new Proxy(signer, {
    get(target, prop) {
      if (prop === 'provider') return wrappedProvider;
      if (prop === 'signTypedData') {
        return (domain, types, value) => signTypedDataViaDynamic(wallet, domain, types, value);
      }
      const val = target[prop];
      return typeof val === 'function' ? val.bind(target) : val;
    }
  });
}
