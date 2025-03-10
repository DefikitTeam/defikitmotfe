/* eslint-disable */


import {
    baseSepolia,
    Chain
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

const somniaTestnet: Chain = {
    id: 50312,
    name: 'Somnia Testnet',
    nativeCurrency: {
        name: 'Somnia',
        symbol: 'STT',
        decimals: 18
    },
    rpcUrls: {
        default: { http: ['https://dream-rpc.somnia.network/'] },
        public: { http: ['https://dream-rpc.somnia.network/'] }
    },
    blockExplorers: {
        default: {
            name: 'Somnia Explorer',
            url: 'https://shannon-explorer.somnia.network/'
        }
    },
    testnet: true
};

export const CHAIN_CONFIG = {
    // production: {
    //     defaultChain: berachain,
    //     supportedChains: [berachain]
    // },
    // staging: {
    defaultChain: baseSepolia,
    supportedChains: [baseSepolia, somniaTestnet]
    // },
    // development: {
    //     defaultChain: baseSepolia,
    //     supportedChains: [
    //         baseSepolia,
    //         polygonAmoy,
    //         artelaTestnet,
    //         unichainSepoliaTestnet
    //     ]
    // }
};
