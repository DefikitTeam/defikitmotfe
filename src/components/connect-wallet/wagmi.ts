/* eslint-disable */
import {
    NEXT_PUBLIC_DOMAIN_BARTIO_STG,
    NEXT_PUBLIC_DOMAIN_BERACHAIN_MAINNET_PROD,
    NEXT_PUBLIC_DOMAIN_MULTIPLE_STG,
    NEXT_PUBLIC_PROJECT_ID
} from '@/src/common/web3/constants/env';
import useCurrentHostNameInformation from '@/src/hooks/useCurrentHostName';
// import { HOT } from '@hot-wallet/sdk';
import '@hot-wallet/sdk/adapter/evm';
import { Chain, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { berachain } from 'viem/chains';

import {
    artelaTestnet,
    base,
    baseSepolia,
    berachainTestnetbArtio,
    iota,
    polygonAmoy
} from 'viem/chains';

const iotaWithIcon: Chain = {
    ...iota,
    iconUrl: 'https://cryptologos.cc/logos/iota-miota-logo.png',
    iconBackground: '#ffffff'
};

const unichainSepoliaTestnet: Chain = {
    id: 1301,
    name: 'Unichain Sepolia Testnet',
    nativeCurrency: {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18
    },
    rpcUrls: {
        default: { http: ['https://sepolia.unichain.org'] },
        public: { http: ['https://sepolia.unichain.org'] }
    },
    blockExplorers: {
        default: { name: 'Uniscan', url: 'https://sepolia.uniscan.xyz' }
    },
    testnet: true
};

const chainsByHostname: Record<string, Chain[]> = {
    //[base, iotaWithIcon]
    [`${NEXT_PUBLIC_DOMAIN_BERACHAIN_MAINNET_PROD}`]: [berachain],
    [`${NEXT_PUBLIC_DOMAIN_BARTIO_STG}`]: [berachainTestnetbArtio],
    [`${NEXT_PUBLIC_DOMAIN_MULTIPLE_STG}`]: [
        berachainTestnetbArtio,
        baseSepolia,
        polygonAmoy,
        artelaTestnet,
        unichainSepoliaTestnet
    ]
};

export const getChainsForHostname = (hostname: string): Chain[] => {
    return chainsByHostname[hostname] || [];
};

const currentHostname = useCurrentHostNameInformation();
const data: Chain[] = getChainsForHostname(currentHostname.url);

export const chainRpcProviders: Record<number, any> = {
    8453: {
        request: (request: any) =>
            fetch('https://mainnet.base.org', {
                method: 'POST',
                body: JSON.stringify(request)
            })
    },
    84532: {
        request: (request: any) =>
            fetch('https://sepolia.base.org', {
                method: 'POST',
                body: JSON.stringify(request)
            })
    },
    80084: {
        request: (request: any) =>
            fetch('https://bartio.rpc.berachain.com', {
                method: 'POST',
                body: JSON.stringify(request)
            })
    },
    80002: {
        request: (request: any) =>
            fetch('https://rpc-amoy.polygon.technology/', {
                method: 'POST',
                body: JSON.stringify(request)
            })
    },
    11822: {
        request: (request: any) =>
            fetch('https://betanet-rpc1.artela.network', {
                method: 'POST',
                body: JSON.stringify(request)
            })
    },
    1301: {
        request: (request: any) =>
            fetch('https://sepolia.unichain.org', {
                method: 'POST',
                body: JSON.stringify(request)
            })
    },
    8822: {
        request: (request: any) =>
            fetch('https://json-rpc.evm.iotaledger.net', {
                method: 'POST',
                body: JSON.stringify(request)
            })
    }
};

// Tạo custom wallet cho HOT Wallet
// const hotWallet = (): Wallet => ({
//   id: 'hot-wallet',
//   name: 'HOT Wallet',
//   iconUrl: 'đường_dẫn_tới_icon_hot_wallet',
//   iconBackground: '#ffffff',
//   downloadUrls: {
//     android: 'https://play.google.com/store/apps/details?id=com.hot.wallet',
//     ios: 'https://apps.apple.com/app/hot-wallet/id...',
//   },
//   createConnector: (config) => {
//     const connector = {
//       id: 'hot-wallet',
//       name: 'HOT Wallet',
//       type: 'injected',
//       connect: async () => {
//         const provider = await HOT.setupEthProvider(async (request, chainId) => {
//           const chain = chains.find(c => c.chainId === chainId);
//           if (!chain) {
//             throw new Error(`Chain ${chainId} không được hỗ trợ`);
//           }
//           const response = await fetch(chain.rpcUrl, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//               jsonrpc: '2.0',
//               id: 1,
//               method: request.method,
//               params: request.params
//             })
//           });
//           const data = await response.json();
//           return data.result;
//         });

//         return {
//           provider,
//           chain: { id: config.chains[0].id, unsupported: false }
//         };
//       }
//     } as unknown as Connector;

//     return {
//       connector
//     };
//   }
// });

export const config = getDefaultConfig({
    appName: 'Rocket Launch',
    projectId: NEXT_PUBLIC_PROJECT_ID ?? '',
    appIcon: 'https://testnet.rocketlaunch.fun/rocket_launch.jpg',
    // @ts-ignore
    chains: [...data]
    // wallets: [
    //     hotWallet,
    // ],
    // ssr: true
    // add hot wallet provider configuration
    // walletConnectParameters: {
    //     providerOptions: {
    //         custom: {
    //             setupProvider: async () => {
    //                 return HOT.setupEthProvider((request, chain, address) => {
    //                     // use rpc for connected chain and address
    //                     return chainRpcProviders[chain]?.request(request);
    //                 });
    //             }
    //         }
    //     }
    // }
});
