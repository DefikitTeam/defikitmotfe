import { ChainId, DexName } from '@/src/common/constant/constance';
import {
    NEXT_PUBLIC_API_ENDPOINT,
    NEXT_PUBLIC_BERACHAIN_BEPOLIA_CONTRACT_ADDRESS,
    NEXT_PUBLIC_BERACHAIN_BEPOLIA_CONTRACT_ADDRESS_TRUST_POINT
} from '@/src/common/web3/constants/env';
import { ROCKET_EVM_ABI } from '../abi/rocket-evm-abi';

import { EnvironmentConfig } from '../type';
import { ROCKET_EVM_ABI_MIN_NFT } from '../abi/rocket-evm-abi-min-nft';

export const developmentConfig: EnvironmentConfig = {
    environment: 'staging',

    defaultChain: ChainId.BERACHAIN_BEPOLIA,

    supportedChains: [ChainId.BERACHAIN_BEPOLIA],
    chains: {
        [ChainId.BERACHAIN_BEPOLIA]: {
            chainId: ChainId.BERACHAIN_BEPOLIA,
            name: 'Berachain Bepolia',
            addresses: {
                rocket: NEXT_PUBLIC_BERACHAIN_BEPOLIA_CONTRACT_ADDRESS as string
            },
            subgraph: {
                uri: `${NEXT_PUBLIC_API_ENDPOINT}/subgraph/berachain-bepolia`
            },
            currency: 'BERA',
            explorer: 'https://bepolia.beratrail.io/',
            rpcUrl: 'https://bepolia.rpc.berachain.com/',
            isTestnet: true,
            contractAbis: ROCKET_EVM_ABI,
            trustPointAbis: ROCKET_EVM_ABI_MIN_NFT,
            trustPointAddress:
                NEXT_PUBLIC_BERACHAIN_BEPOLIA_CONTRACT_ADDRESS_TRUST_POINT as string,
            dex: {
                name: DexName.KODIAK,
                linkSwap:
                    'https://app.kodiak.finance/#/swap?chain=berachain_bepolia&inputCurrency=Bera&outputCurrency='
            },
            blockInterval: 2,

            platformFee: 0.01,
            hardCapInitial: 2,
            minHardcap: { min: 0.05, error: 'Min value is 0.05' },
            onFaucet: false
        }
    },
    api: {
        baseUrl: NEXT_PUBLIC_API_ENDPOINT as string,
        endpoints: {
            subgraph: {
                [ChainId.BERACHAIN_BEPOLIA]: `${NEXT_PUBLIC_API_ENDPOINT}/subgraph/berachain-bepolia`
            }
        }
    }
};
