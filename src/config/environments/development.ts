import {
    NEXT_PUBLIC_API_ENDPOINT,
    NEXT_PUBLIC_ARTELA_CONTRACT_ADDRESS,
    NEXT_PUBLIC_BARTIO_ROCKET_CONTRACT_ADDRESS,
    NEXT_PUBLIC_BASE_SEPOLIA_CONTRACT_ADDRESS,
    NEXT_PUBLIC_MONAD_CONTRACT_ADDRESS,
    NEXT_PUBLIC_POLYGON_AMOY_CONTRACT_ADDRESS,
    NEXT_PUBLIC_UNICHAIN_SEPOLIA_CONTRACT_ADDRESS
} from '@/src/common/web3/constants/env';
import { EnvironmentConfig } from '../type';
import { ChainId } from '@/src/common/constant/constance';
import { ROCKET_EVM_ABI } from '../abi/rocket-evm-abi';

export const developmentConfig: EnvironmentConfig = {
    environment: 'staging',
    defaultChain: ChainId.MONAD,
    supportedChains: [
        ChainId.BARTIO,
        ChainId.ARTELA,
        ChainId.BASE_SEPOLIA,
        ChainId.POLYGON_AMOY,
        ChainId.UNICHAIN_SEPOLIA,
        ChainId.MONAD
    ],
    chains: {
        [ChainId.BARTIO]: {
            chainId: ChainId.BARTIO,
            name: 'Berachain Bartio',
            addresses: {
                rocket: NEXT_PUBLIC_BARTIO_ROCKET_CONTRACT_ADDRESS as string
            },
            subgraph: {
                uri: `${NEXT_PUBLIC_API_ENDPOINT}/subgraph/bartio`
            },
            currency: 'BERA',
            explorer: 'https://bartio.beratrail.io',
            rpcUrl: 'https://bartio.rpc.berachain.com',
            isTestnet: true,
            contractAbis: ROCKET_EVM_ABI
        },

        [ChainId.ARTELA]: {
            chainId: ChainId.ARTELA,
            name: 'Artela Testnet',
            addresses: {
                rocket: NEXT_PUBLIC_ARTELA_CONTRACT_ADDRESS as string
            },
            subgraph: {
                uri: `${NEXT_PUBLIC_API_ENDPOINT}/subgraph/artela`
            },
            currency: 'ART',
            explorer: 'https://betanet-scan.artela.network/',
            rpcUrl: 'https://betanet-rpc1.artela.network',
            isTestnet: true,
            contractAbis: ROCKET_EVM_ABI
        },
        [ChainId.BASE_SEPOLIA]: {
            chainId: ChainId.BASE_SEPOLIA,
            name: 'Base Sepolia',
            addresses: {
                rocket: NEXT_PUBLIC_BASE_SEPOLIA_CONTRACT_ADDRESS as string
            },
            currency: 'ETH',
            subgraph: {
                uri: `${NEXT_PUBLIC_API_ENDPOINT}/subgraph/base-sepolia`
            },
            explorer: 'https://basesepolia.beratrail.io',
            rpcUrl: 'https://basesepolia.rpc.berachain.com',
            isTestnet: true,
            contractAbis: ROCKET_EVM_ABI
        },
        [ChainId.POLYGON_AMOY]: {
            chainId: ChainId.POLYGON_AMOY,
            name: 'Polygon Amoy',
            currency: 'MATIC',
            addresses: {
                rocket: NEXT_PUBLIC_POLYGON_AMOY_CONTRACT_ADDRESS as string
            },
            subgraph: {
                uri: `${NEXT_PUBLIC_API_ENDPOINT}/subgraph/polygon-amoy`
            },
            explorer: 'https://www.oklink.com/amoy',
            rpcUrl: 'https://rpc-amoy.polygon.technology/',
            isTestnet: true,
            contractAbis: ROCKET_EVM_ABI
        },
        [ChainId.UNICHAIN_SEPOLIA]: {
            chainId: ChainId.UNICHAIN_SEPOLIA,
            name: 'Unichain Sepolia Testnet',
            currency: 'ETH',
            addresses: {
                rocket: NEXT_PUBLIC_UNICHAIN_SEPOLIA_CONTRACT_ADDRESS as string
            },
            subgraph: {
                uri: `${NEXT_PUBLIC_API_ENDPOINT}/subgraph/unichain-sepolia`
            },
            explorer: 'https://sepolia.uniscan.xyz',
            rpcUrl: 'https://sepolia.unichain.org',
            isTestnet: true,
            contractAbis: ROCKET_EVM_ABI
        },
        [ChainId.MONAD]: {
            chainId: ChainId.MONAD,
            name: 'Monad Testnet',
            currency: 'MON',
            addresses: {
                rocket: NEXT_PUBLIC_MONAD_CONTRACT_ADDRESS as string
            },
            subgraph: {
                uri: `${NEXT_PUBLIC_API_ENDPOINT}/subgraph/monad_testnet`
            },
            explorer: 'https://testnet.monadexplorer.com',
            rpcUrl: 'https://testnet-rpc.monad.xyz',
            isTestnet: true,
            contractAbis: ROCKET_EVM_ABI
        }
    },
    api: {
        baseUrl: NEXT_PUBLIC_API_ENDPOINT as string,
        endpoints: {
            subgraph: {
                [ChainId.BARTIO]: `${NEXT_PUBLIC_API_ENDPOINT}/subgraph/bartio`,
                [ChainId.ARTELA]: `${NEXT_PUBLIC_API_ENDPOINT}/subgraph/artela`,
                [ChainId.BASE_SEPOLIA]: `${NEXT_PUBLIC_API_ENDPOINT}/subgraph/base-sepolia`,
                [ChainId.POLYGON_AMOY]: `${NEXT_PUBLIC_API_ENDPOINT}/subgraph/polygon-amoy`,
                [ChainId.UNICHAIN_SEPOLIA]: `${NEXT_PUBLIC_API_ENDPOINT}/subgraph/unichain-sepolia`,
                [ChainId.MONAD]: `${NEXT_PUBLIC_API_ENDPOINT}/subgraph/monad_testnet`
            }
        }
    }
};
