export type ChainId = number;
export type Environment = 'development' | 'staging' | 'production';

export interface ContractAddresses {
    rocket: string;
}

export interface SubgraphConfig {
    uri: string;
}

export interface ChainConfig {
    chainId: ChainId;
    name: string;
    addresses: ContractAddresses;
    subgraph: SubgraphConfig;
    currency: string;
    rpcUrl: string;
    explorer: string;
    isTestnet: boolean;
    contractAbis: any;
}

export interface EnvironmentConfig {
    environment: Environment;
    defaultChain: ChainId;
    supportedChains: ChainId[];
    chains: Record<number, ChainConfig>;
    api: {
        baseUrl: string;
        endpoints: {
            subgraph: Record<string, string>;
        };
    };
}
