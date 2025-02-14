/* eslint-disable */
import { ContractStruct } from '@/src/common/wagmi/launch-pad-interface';
import { useConfig } from '@/src/hooks/useConfig';
import { Abi } from 'viem';

export const getContract = (chainId: number): ContractStruct => {
    let address: string = '';

    const { chainConfig, environment, getContractAbi } = useConfig();

    let abi: Abi = getContractAbi(chainId);
    address = chainConfig?.addresses.rocket as string;

    return {
        address: address as `0x${string}`,
        abi: abi,
        chainId: chainId
    };
};
