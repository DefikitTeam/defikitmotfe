/* eslint-disable */
import {
    NEXT_PUBLIC_DOMAIN_BARTIO_STG,
    NEXT_PUBLIC_DOMAIN_BASE_PROD,
    NEXT_PUBLIC_DOMAIN_MULTIPLE_STG,
    NEXT_PUBLIC_PROJECT_ID
} from '@/src/common/web3/constants/env';
import useCurrentHostNameInformation from '@/src/hooks/useCurrentHostName';
import { getDefaultConfig, Chain } from '@rainbow-me/rainbowkit';
import {
    artelaTestnet,
    base,
    baseSepolia,
    berachainTestnetbArtio,
    polygonAmoy
} from 'viem/chains';

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
    [`${NEXT_PUBLIC_DOMAIN_BASE_PROD}`]: [base],
    [`${NEXT_PUBLIC_DOMAIN_BARTIO_STG}`]: [berachainTestnetbArtio],
    [`${NEXT_PUBLIC_DOMAIN_MULTIPLE_STG}`]: [
        berachainTestnetbArtio,
        baseSepolia,
        polygonAmoy,
        artelaTestnet,
        unichainSepoliaTestnet
    ]
};

const getChainsForHostname = (hostname: string): Chain[] => {
    return chainsByHostname[hostname] || [];
};

const currentHostname = useCurrentHostNameInformation();
const data: Chain[] = getChainsForHostname(currentHostname.url);

export const config = getDefaultConfig({
    appName: 'Rocket Launch',
    projectId: NEXT_PUBLIC_PROJECT_ID ?? '',
    appIcon: 'https://testnet.rocketlaunch.fun/rocket_launch.jpg',
    // @ts-ignore
    chains: [...data]
    // ssr: true
});
