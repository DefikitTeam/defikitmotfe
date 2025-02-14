import { ChainId } from '@/src/common/constant/constance';
import {
    NEXT_PUBLIC_API_ENDPOINT_PROD,
    NEXT_PUBLIC_BASE_CONTRACT_ADDRESS_PROD,
    NEXT_PUBLIC_BERACHAIN_MAINNET_CONTRACT_ADDRESS_PROD,
    NEXT_PUBLIC_IOTA_CONTRACT_ADDRESS_PROD
} from '@/src/common/web3/constants/env';
import { ROCKET_EVM_ABI } from '../abi/rocket-evm-abi';
import { ROCKET_EVM_ABI_PROD } from '../abi/rocket-evm-abi-prod';
import { EnvironmentConfig } from '../type';
import { ROCKET_EVM_ABI_IOTA_PROD } from '../abi/rocket-evm-abi-iota-prod';

export const productionConfig: EnvironmentConfig = {
    environment: 'production',
    defaultChain: ChainId.BERACHAIN_MAINNET,
    supportedChains: [ChainId.BASE, ChainId.IOTA, ChainId.BERACHAIN_MAINNET],
    chains: {
        [ChainId.BASE]: {
            chainId: ChainId.BASE,
            name: 'Base',
            addresses: {
                rocket: NEXT_PUBLIC_BASE_CONTRACT_ADDRESS_PROD as string
            },
            subgraph: {
                uri: `${NEXT_PUBLIC_API_ENDPOINT_PROD}/subgraph/base`
            },
            currency: 'ETH',

            explorer: 'https://basescan.org',
            rpcUrl: 'https://mainnet.base.org',
            isTestnet: false,
            contractAbis: ROCKET_EVM_ABI_PROD
        },
        [ChainId.IOTA]: {
            chainId: ChainId.IOTA,
            currency: 'IOTA',

            name: 'IOTA Mainnet',
            addresses: {
                rocket: NEXT_PUBLIC_IOTA_CONTRACT_ADDRESS_PROD as string
            },
            subgraph: {
                uri: `${NEXT_PUBLIC_API_ENDPOINT_PROD}/subgraph/iota`
            },
            explorer: 'https://explorer.evm.iota.org/',
            rpcUrl: 'https://json-rpc.evm.iotaledger.net',
            isTestnet: false,
            contractAbis: ROCKET_EVM_ABI_IOTA_PROD
        },
        [ChainId.BERACHAIN_MAINNET]: {
            chainId: ChainId.BERACHAIN_MAINNET,
            name: 'Berachain',
            currency: 'BERA',

            addresses: {
                rocket: NEXT_PUBLIC_BERACHAIN_MAINNET_CONTRACT_ADDRESS_PROD as string
            },
            subgraph: {
                uri: `${NEXT_PUBLIC_API_ENDPOINT_PROD}/subgraph/berachain`
            },
            explorer: 'https://berascan.com/',
            rpcUrl: 'https://rpc.berachain.com/',
            isTestnet: false,
            contractAbis: ROCKET_EVM_ABI
        }
    },
    api: {
        baseUrl: NEXT_PUBLIC_API_ENDPOINT_PROD as string,
        endpoints: {
            subgraph: {
                [ChainId.BASE]: `${NEXT_PUBLIC_API_ENDPOINT_PROD}/subgraph/base`,
                [ChainId.IOTA]: `${NEXT_PUBLIC_API_ENDPOINT_PROD}/subgraph/iota`,
                [ChainId.BERACHAIN_MAINNET]: `${NEXT_PUBLIC_API_ENDPOINT_PROD}/subgraph/berachain`
            }
        }
    }
};
