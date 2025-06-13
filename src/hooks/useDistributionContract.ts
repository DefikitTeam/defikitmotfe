import { ContractInfo } from '@/src/common/wagmi/launch-pad-interface';
import { useConfig } from '@/src/hooks/useConfig';

export function useDistributionContract(chainId: number): ContractInfo {
  const { chainConfig, getDistributionAbi } = useConfig();

  const address = chainConfig?.distributionAddress as string;
  const abi = getDistributionAbi(chainId);

  return {
    address: address as `0x${string}`,
    abi: abi,
    chainId: chainId
  };
} 