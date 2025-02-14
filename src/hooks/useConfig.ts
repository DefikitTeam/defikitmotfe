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
            isChainSupported: (chainId: number) =>
                config.isChainSupported(chainId),

            // Contract related getters
            getContractAddress: (
                chainId: number,
                contractKey: keyof ChainConfig['addresses']
            ) => config.getContractAddress(chainId, contractKey),
            getContractAbi: (chainId: number) => config.getContractAbi(chainId),

            // Network related getters
            getRpcUrl: (chainId: number) => config.getRpcUrl(chainId),
            getExplorer: (chainId: number) => config.getExplorer(chainId),
            getSubgraphUri: (chainId: number) => config.getSubgraphUri(chainId),

            // API and environment getters
            apiConfig: config.getApiConfig(),
            environment: config.getEnvironment()
        }),
        [chain]
    ); // Re-compute when chain changes
};
