import { DexName } from '../common/constant/constance';

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
  reserve_min?: number;
  addresses: ContractAddresses;
  subgraph: SubgraphConfig;
  currency: string;
  rpcUrl: string;
  explorer: string;
  isTestnet: boolean;
  contractAbis: any;
  dex: {
    name: DexName;
    linkSwap: string;
  };
  blockInterval: number;
  platformFee: number;
  hardCapInitial: number;
  minHardcap: {
    min: number;
    error: string;
  };
  onFaucet?: boolean;
  trustPointAbis?: any;
  trustPointAddress?: string;
  distributionAbis?: any;
  distributionAddress?: string;
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
