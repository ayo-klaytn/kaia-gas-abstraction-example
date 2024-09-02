import injectedModule from '@web3-onboard/injected-wallets'
import walletConnectModule from '@web3-onboard/walletconnect'
import coinbaseModule from '@web3-onboard/coinbase'
import { init } from '@web3-onboard/react'
import type { WalletInit, EIP1193Provider } from '@web3-onboard/common'

// Example key • Replace with your infura key

const kaikasWallet: WalletInit = () => ({
  label: 'Kaia Wallet',
  injectedNamespace: 'klaytn', // This tells Web3 Onboard where to find the provider
  checkProviderIdentity: ({ provider }) => {
    return !!provider && !!provider.isKaikas; // Check if the provider is Kaia Wallet
  },
  getIcon: async () => (await import('./kaia-wallet')).default,
  getInterface: async () => {
    if (typeof window !== 'undefined') {
      const provider = (window as any).klaytn;
      if (provider && provider.isKaikas) {
        return {
          provider: provider as EIP1193Provider
        };
      }
    }
    throw new Error('Kaia Wallet is not available');
  },
  platforms: ['desktop'],
});


const injected = injectedModule({
  custom: [kaikasWallet()],
})

const walletLink = coinbaseModule()
const walletConnect = walletConnectModule({
  version: 2,
  projectId: 'a1245421389b6b8295e896a110913f46',
  dappUrl: 'https://onboard.blocknative.com/'
})

export default init({
  wallets: [
    injected,
    walletConnect,
    walletLink,
  ],
  chains: [
    {
      namespace: "evm",
      id: '0x3E9',
      token: 'KLAY',
      label: 'Kairos Testnet',
      rpcUrl: 'https://klaytn-baobab.g.allthatnode.com/full/evm'
    },
  ],
  appMetadata: {
    name: 'gas-abstract-kaia-dapp',
    icon: `<svg width="800" height="800" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="800" height="800" fill="#040404"/>
<g clip-path="url(#clip0_5292_1576)">
<path d="M388.814 281.186C388.814 263.444 403.291 248.989 421.061 248.989H478.761V170.653H449.911H421.061C359.93 170.653 310.36 220.148 310.36 281.186C310.36 297.114 313.756 312.254 319.828 325.92C272.35 345.958 240.824 388.534 233.483 442.413C224.907 501.568 248.645 565.38 300.343 596.208C346.482 625.22 418.625 623.302 457.596 583.054V609.772H537.902V313.383H421.095C403.325 313.383 388.814 298.93 388.814 281.186ZM459.379 391.754V466.15C459.379 507.254 426.001 540.547 384.87 540.547C343.738 540.547 310.36 507.219 310.36 466.15C310.36 425.081 343.738 391.754 384.87 391.754H459.379Z" fill="#BFF009"/>
</g>
<defs>
<clipPath id="clip0_5292_1576">
<rect width="307.2" height="446.4" fill="white" transform="translate(231.2 169.6)"/>
</clipPath>
</defs>
</svg>
`,
    logo: `<svg width="800" height="800" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="800" height="800" fill="#040404"/>
<g clip-path="url(#clip0_5292_1576)">
<path d="M388.814 281.186C388.814 263.444 403.291 248.989 421.061 248.989H478.761V170.653H449.911H421.061C359.93 170.653 310.36 220.148 310.36 281.186C310.36 297.114 313.756 312.254 319.828 325.92C272.35 345.958 240.824 388.534 233.483 442.413C224.907 501.568 248.645 565.38 300.343 596.208C346.482 625.22 418.625 623.302 457.596 583.054V609.772H537.902V313.383H421.095C403.325 313.383 388.814 298.93 388.814 281.186ZM459.379 391.754V466.15C459.379 507.254 426.001 540.547 384.87 540.547C343.738 540.547 310.36 507.219 310.36 466.15C310.36 425.081 343.738 391.754 384.87 391.754H459.379Z" fill="#BFF009"/>
</g>
<defs>
<clipPath id="clip0_5292_1576">
<rect width="307.2" height="446.4" fill="white" transform="translate(231.2 169.6)"/>
</clipPath>
</defs>
</svg>
`,
    description: 'Demo app for Kaia Gas Abstraction',
    gettingStartedGuide: 'https://docs.kaia.io/build/get-started/',
    explore: 'https://docs.kaia.io/learn/',
    recommendedInjectedWallets: [
      {
        name: 'Kaia Wallet',
        url: 'https://kaikas.io/'
      },
      { name: 'Coinbase', url: 'https://wallet.coinbase.com/' }
    ],
    agreement: {
      version: '1.0.0',
      termsUrl: 'https://www.blocknative.com/terms-conditions',
      privacyUrl: 'https://www.blocknative.com/privacy-policy'
    }
  }
})