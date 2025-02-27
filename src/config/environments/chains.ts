import {
    artelaTestnet,
    baseSepolia,
    berachain,
    berachainTestnetbArtio,
    Chain,
    monadTestnet,
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
        defaultChain: monadTestnet,
        // berachainTestnetbArtio,
        supportedChains: [
            // berachainTestnetbArtio, baseSepolia
            monadTestnet
        ]
    },
    development: {
        defaultChain: berachainTestnetbArtio,
        supportedChains: [
            berachainTestnetbArtio,
            baseSepolia,
            polygonAmoy,
            artelaTestnet,
            unichainSepoliaTestnet
        ]
    }
};
