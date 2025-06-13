import { developmentConfig } from '../environments/development';
import { NEXT_PUBLIC_ENVIRONMENT } from '@/src/common/web3/constants/env';
import { productionConfig } from '../environments/production';
import { ChainConfig, EnvironmentConfig } from '../type';
import {
  baseSepolia,
  base,
  berachain,
  berachainBepolia,
  Chain,
  iota
} from 'viem/chains';

const CHAIN_MAP = {
  [berachain.id]: berachain,
  [base.id]: base,
  [baseSepolia.id]: baseSepolia,
  [berachainBepolia.id]: berachainBepolia,
  [iota.id]: iota
};

export class ConfigService {
  private static instance: ConfigService;
  private currentConfig: EnvironmentConfig;
  private chains: Record<number, Chain>;

  private constructor() {
    this.currentConfig = this.loadConfig();
    this.chains = CHAIN_MAP;
  }

  static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  private loadConfig(): EnvironmentConfig {
    if (NEXT_PUBLIC_ENVIRONMENT === 'production') {
      return productionConfig;
    }
    return developmentConfig;
  }

  getChainConfig(chainId: number): ChainConfig | undefined {
    return this.currentConfig.chains[chainId];
  }
  getApiConfig() {
    return this.currentConfig.api;
  }

  getSupportedChains(): number[] {
    return this.currentConfig.supportedChains;
  }

  getReserveMin(chainId: number): number {
    return this.getChainConfig(chainId)?.reserve_min || 0;
  }

  getDefaultChain(): number {
    return this.currentConfig.defaultChain;
  }

  isChainSupported(chainId: number): boolean {
    return this.currentConfig.supportedChains.includes(chainId);
  }

  getContractAddress(
    chainId: number,
    contractKey: keyof ChainConfig['addresses']
  ): string | undefined {
    return this.getChainConfig(chainId)?.addresses[contractKey];
  }

  getTrustPointAddress(chainId: number): string | undefined {
    return this.getChainConfig(chainId)?.trustPointAddress;
  }

  getTrustPointAbi(chainId: number): any {
    return this.getChainConfig(chainId)?.trustPointAbis;
  }

  getDistributionAddress(chainId: number): string | undefined {
    return this.getChainConfig(chainId)?.distributionAddress;
  }

  getDistributionAbi(chainId: number): any {
    return this.getChainConfig(chainId)?.distributionAbis;
  }

  getSubgraphUri(chainId: number): string | undefined {
    return this.getChainConfig(chainId)?.subgraph.uri;
  }

  getContractAbi(chainId: number): any {
    return this.getChainConfig(chainId)?.contractAbis;
  }

  getRpcUrl(chainId: number): string | undefined {
    return this.getChainConfig(chainId)?.rpcUrl;
  }

  getExplorer(chainId: number): string | undefined {
    return this.getChainConfig(chainId)?.explorer;
  }

  getPlatformFee(chainId: number): number {
    return this.getChainConfig(chainId)?.platformFee || 0;
  }

  getBlockInterval(chainId: number): number {
    return this.getChainConfig(chainId)?.blockInterval || 2;
  }

  getHardCapInitial(chainId: number): number {
    return this.getChainConfig(chainId)?.hardCapInitial || 0;
  }

  getMinHardcap(chainId: number): { min: number; error: string } | undefined {
    return this.getChainConfig(chainId)?.minHardcap;
  }

  getDexInfo(chainId: number): { name: any; linkSwap: string } | undefined {
    return this.getChainConfig(chainId)?.dex;
  }

  getSupportedChainsNew(): Chain[] {
    return this.currentConfig.supportedChains.map((chainId) => {
      return this.chains[chainId];
    });
  }

  getDefaultChainNew(): Chain {
    return this.chains[this.currentConfig.defaultChain];
  }
}
