'use client';
import { useMemo } from 'react';
import { useAccount } from 'wagmi';
import { ConfigService } from '../config/services/config-service';
import { ChainConfig } from '../config/type';

export const useConfig = () => {
  const { chain } = useAccount();
  const config = ConfigService.getInstance();

  return useMemo(
    () => ({
      // Chain related getters
      chainConfig: chain
        ? config.getChainConfig(chain.id)
        : config.getChainConfig(config.getDefaultChain()),
      supportedChains: config.getSupportedChains(),
      defaultChain: config.getDefaultChain(),
      isChainSupported: (chainId: number) => config.isChainSupported(chainId),

      // Contract related getters
      getContractAddress: (
        chainId: number,
        contractKey: keyof ChainConfig['addresses']
      ) => config.getContractAddress(chainId, contractKey),
      getContractAbi: (chainId: number) => config.getContractAbi(chainId),
      getTrustPointAbi: (chainId: number) => config.getTrustPointAbi(chainId),
      getTrustPointAddress: (chainId: number) =>
        config.getTrustPointAddress(chainId),
      getDistributionAddress: (chainId: number) =>
        config.getDistributionAddress(chainId),
      getDistributionAbi: (chainId: number) => config.getDistributionAbi(chainId),
      // Network related getters
      getRpcUrl: (chainId: number) => config.getRpcUrl(chainId),
      getExplorer: (chainId: number) => config.getExplorer(chainId),
      getSubgraphUri: (chainId: number) => config.getSubgraphUri(chainId),

      // Chain specific configuration getters
      getPlatformFee: (chainId: number) => config.getPlatformFee(chainId),
      getBlockInterval: (chainId: number) => config.getBlockInterval(chainId),
      getHardCapInitial: (chainId: number) => config.getHardCapInitial(chainId),
      getMinHardcap: (chainId: number) => config.getMinHardcap(chainId),
      getDexInfo: (chainId: number) => config.getDexInfo(chainId),

      // API and environment getters
      apiConfig: config.getApiConfig(),
      // environment: config.getEnvironment(),
      supportedChainsNew: config.getSupportedChainsNew(),
      defaultChainNew: config.getDefaultChainNew(),
      getReserveMin: (chainId: number) => config.getReserveMin(chainId)
    }),
    [chain]
  ); // Re-compute when chain changes
};
