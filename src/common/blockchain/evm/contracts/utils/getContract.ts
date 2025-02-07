/* eslint-disable */
import {
    ChainId,
    ROCKET_EVM_ABI_BY_CHAIN
} from '@/src/common/constant/constance';
import { ContractStruct } from '@/src/common/wagmi/launch-pad-interface';
import {
    NEXT_PUBLIC_ARTELA_CONTRACT_ADDRESS,
    NEXT_PUBLIC_BARTIO_ROCKET_CONTRACT_ADDRESS,
    NEXT_PUBLIC_BARTIO_ROCKET_CONTRACT_ADDRESS_PROD,
    NEXT_PUBLIC_BASE_CONTRACT_ADDRESS,
    NEXT_PUBLIC_BASE_CONTRACT_ADDRESS_PROD,
    NEXT_PUBLIC_BASE_SEPOLIA_CONTRACT_ADDRESS,
    NEXT_PUBLIC_BASE_SEPOLIA_CONTRACT_ADDRESS_PROD,
    NEXT_PUBLIC_DOMAIN_BERACHAIN_MAINNET_PROD,
    NEXT_PUBLIC_IOTA_CONTRACT_ADDRESS,
    NEXT_PUBLIC_IOTA_CONTRACT_ADDRESS_PROD,
    NEXT_PUBLIC_POLYGON_AMOY_CONTRACT_ADDRESS,
    NEXT_PUBLIC_UNICHAIN_SEPOLIA_CONTRACT_ADDRESS
} from '@/src/common/web3/constants/env';
import useCurrentHostNameInformation from '@/src/hooks/useCurrentHostName';
import { Abi } from 'viem';

export const getContract = (chainId: number): ContractStruct => {
    let address: string = '';
    const currentHostName = useCurrentHostNameInformation();
    const isProd =
        currentHostName.url === NEXT_PUBLIC_DOMAIN_BERACHAIN_MAINNET_PROD;
    // let abi: Abi = isProd
    //     ? (ROCKET_EVM_ABI_PROD as Abi)
    //     : (ROCKET_EVM_ABI as Abi);
    let abi: Abi = ROCKET_EVM_ABI_BY_CHAIN[
        chainId as keyof typeof ROCKET_EVM_ABI_BY_CHAIN
    ] as Abi;

    switch (chainId) {
        case ChainId.BARTIO:
            address = isProd
                ? NEXT_PUBLIC_BARTIO_ROCKET_CONTRACT_ADDRESS_PROD ?? ''
                : NEXT_PUBLIC_BARTIO_ROCKET_CONTRACT_ADDRESS ?? '';
            break;
        case ChainId.BASE_SEPOLIA:
            address = isProd
                ? NEXT_PUBLIC_BASE_SEPOLIA_CONTRACT_ADDRESS_PROD ?? ''
                : NEXT_PUBLIC_BASE_SEPOLIA_CONTRACT_ADDRESS ?? '';
            break;
        case ChainId.POLYGON_AMOY:
            address = NEXT_PUBLIC_POLYGON_AMOY_CONTRACT_ADDRESS ?? '';
            break;
        case ChainId.ARTELA:
            address = NEXT_PUBLIC_ARTELA_CONTRACT_ADDRESS ?? '';
            break;
        case ChainId.UNICHAIN_SEPOLIA:
            address = NEXT_PUBLIC_UNICHAIN_SEPOLIA_CONTRACT_ADDRESS ?? '';
            break;
        case ChainId.BASE:
            address = isProd
                ? NEXT_PUBLIC_BASE_CONTRACT_ADDRESS_PROD ?? ''
                : NEXT_PUBLIC_BASE_CONTRACT_ADDRESS ?? '';
            break;
        case ChainId.IOTA:
            address = isProd
                ? NEXT_PUBLIC_IOTA_CONTRACT_ADDRESS_PROD ?? ''
                : NEXT_PUBLIC_IOTA_CONTRACT_ADDRESS ?? '';
            break;
        case ChainId.BERACHAIN_MAINNET:
            address = isProd
                ? NEXT_PUBLIC_BARTIO_ROCKET_CONTRACT_ADDRESS_PROD ?? ''
                : NEXT_PUBLIC_BARTIO_ROCKET_CONTRACT_ADDRESS ?? '';
        default:
            address = isProd
                ? NEXT_PUBLIC_BASE_CONTRACT_ADDRESS_PROD ?? ''
                : NEXT_PUBLIC_BASE_CONTRACT_ADDRESS ?? '';
            break;
    }

    return {
        address: address as `0x${string}`,
        abi: abi,
        chainId: chainId
    };
};
