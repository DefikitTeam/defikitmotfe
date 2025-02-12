/* eslint-disable */
import {
    NEXT_PUBLIC_DOMAIN_BARTIO_STG,
    NEXT_PUBLIC_DOMAIN_BERACHAIN_MAINNET_PROD,
    NEXT_PUBLIC_DOMAIN_MULTIPLE_STG,
    NEXT_PUBLIC_PROJECT_ID
} from '@/src/common/web3/constants/env';
import useCurrentHostNameInformation from '@/src/hooks/useCurrentHostName';
import '@hot-wallet/sdk/adapter/evm';
import { Chain, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { berachain } from 'viem/chains';

import {
    artelaTestnet,
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

// if (typeof window !== "undefined") {
//     localStorage.removeItem("wagmi.store"); // Xóa thông tin ví cũ
// }

export const config = getDefaultConfig({
    appName: 'Rocket Launch',
    projectId: NEXT_PUBLIC_PROJECT_ID ?? '',
    appIcon: 'https://testnet.rocketlaunch.fun/rocket_launch.jpg',
    // @ts-ignore
    chains: [...data],
    autoConnect: false
    // wallets: [
    //     hotWallet,
    // ],
    // ssr: true
});
