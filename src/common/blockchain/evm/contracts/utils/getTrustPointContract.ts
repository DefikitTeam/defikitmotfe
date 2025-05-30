/* eslint-disable */
import { ContractInfo } from '@/src/common/wagmi/launch-pad-interface';
import { useConfig } from '@/src/hooks/useConfig';
import { Abi } from 'viem';

export const getTrustPointContract = (chainId: number): ContractInfo => {
  let address: string = '';

  const { chainConfig, getTrustPointAbi } = useConfig();

  let abi: Abi = getTrustPointAbi(chainId);
  address = chainConfig?.trustPointAddress as string;

  return {
    address: address as `0x${string}`,
    abi: abi,
    chainId: chainId
  };
};
