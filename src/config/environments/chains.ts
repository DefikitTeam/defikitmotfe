import {
    artelaTestnet,
    baseSepolia,
    berachain,
    Chain,
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

export const CHAIN_CONFIG = {
    production: {
        defaultChain: berachain,
        supportedChains: [berachain]
    },
    staging: {
        defaultChain: baseSepolia,
        supportedChains: [baseSepolia]
    },
    development: {
        defaultChain: baseSepolia,
        supportedChains: [
            baseSepolia,
            baseSepolia,
            polygonAmoy,
            artelaTestnet,
            unichainSepoliaTestnet
        ]
    }
};
