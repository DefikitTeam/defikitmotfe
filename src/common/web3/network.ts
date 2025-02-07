import { Network } from './type';

export const SUPPORTED_NETWORKS = new Map<string, Network>();
SUPPORTED_NETWORKS.set('8453', {
    chainId: 8453,
    chainName: 'Base Mainnet',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    blockExplorerUrls: ['https://basescan.org'],
    rpcUrls: ['https://mainnet.base.org'],
    blockInterval: 2,
    isTestnet: true,
    isSupported: true
});
SUPPORTED_NETWORKS.set('84532', {
    chainId: 84532,
    chainName: 'Base Sepolia',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    blockExplorerUrls: ['https://sepolia-explorer.base.org'],
    rpcUrls: ['https://sepolia.base.org'],
    blockInterval: 2,
    isTestnet: true,
    isSupported: true
});
SUPPORTED_NETWORKS.set('80084'.toString(), {
    chainId: 80084,
    chainName: 'Bartio',
    nativeCurrency: {
        name: 'BERA',
        symbol: 'BERA',
        decimals: 18
    },
    blockExplorerUrls: ['https://bartio.beratrail.io'],
    rpcUrls: ['https://bartio.rpc.berachain.com'],
    blockInterval: 2,
    isTestnet: true,
    isSupported: true
});
