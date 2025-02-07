export type Network = {
    chainId: number;
    chainName: string;
    nativeCurrency: { name: string; decimals: number; symbol: string };
    chainIdHex?: string;
    rpcUrls: string[];
    blockExplorerUrls: string[];
    blockInterval: number;
    isTestnet: boolean;
    isSupported: boolean;
};
