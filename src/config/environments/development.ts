import { ChainId, DexName } from '@/src/common/constant/constance';
import {
    NEXT_PUBLIC_API_ENDPOINT,
    NEXT_PUBLIC_SOMNIA_CONTRACT_ADDRESS,
    NEXT_PUBLIC_SOMNIA_CONTRACT_ADDRESS_TRUST_POINT
} from '@/src/common/web3/constants/env';
import { ROCKET_EVM_ABI } from '../abi/rocket-evm-abi';

import { EnvironmentConfig } from '../type';
import { ROCKET_EVM_ABI_MIN_NFT } from '../abi/rocket-evm-abi-min-nft';

export const developmentConfig: EnvironmentConfig = {
    environment: 'staging',
    defaultChain: ChainId.SOMNIA,
    supportedChains: [ChainId.SOMNIA],
    chains: {
        [ChainId.SOMNIA]: {
            chainId: ChainId.SOMNIA,
            name: 'Somnia',
            addresses: {
                rocket: NEXT_PUBLIC_SOMNIA_CONTRACT_ADDRESS as string
            },
            subgraph: {
                uri: `${NEXT_PUBLIC_API_ENDPOINT}/subgraph/somnia_testnet`
            },
            reserve_min: 0.001,
            currency: 'STT',
            explorer: 'https://somnia-testnet.socialscan.io/',
            rpcUrl: 'https://dream-rpc.somnia.network/',
            isTestnet: true,
            contractAbis: ROCKET_EVM_ABI,
            trustPointAbis: ROCKET_EVM_ABI_MIN_NFT,
            trustPointAddress:
                NEXT_PUBLIC_SOMNIA_CONTRACT_ADDRESS_TRUST_POINT as string,
            dex: {
                name: DexName.KODIAK,
                linkSwap:
                    'https://app.kodiak.finance/#/swap?chain=somnia&inputCurrency=STT&outputCurrency='
            },
            blockInterval: 2,
            platformFee: 0.01,
            hardCapInitial: 1,
            minHardcap: { min: 0.1, error: 'Min value is 0.1' },
            onFaucet: false
        }
    },
    api: {
        baseUrl: NEXT_PUBLIC_API_ENDPOINT as string,
        endpoints: {
            subgraph: {
                [ChainId.SOMNIA]: `${NEXT_PUBLIC_API_ENDPOINT}/subgraph/somnia_testnet`
            }
        }
    }
};

// check cicd