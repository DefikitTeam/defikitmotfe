/* eslint-disable */

import {
    getConfigs,
    NEXT_PUBLIC_DOMAIN_BARTIO_STG,
    NEXT_PUBLIC_DOMAIN_BERACHAIN_MAINNET_PROD,
    NEXT_PUBLIC_DOMAIN_MULTIPLE_STG
} from '../web3/constants/env';
import { SUPPORTED_NETWORKS } from '../web3/network';
import useCurrentHostNameInformation from '../../hooks/useCurrentHostName';

export enum ChainId {
    BARTIO = 80084,
    BASE = 8453,
    BASE_SEPOLIA = 84532,
    POLYGON_AMOY = 80002,
    ARTELA = 11822,
    UNICHAIN_SEPOLIA = 1301,
    IOTA = 8822,
    BERACHAIN_MAINNET = 80094
}
export const listChainIdSupported = [
    ChainId.BASE,
    ChainId.BASE_SEPOLIA,
    ChainId.BARTIO,
    ChainId.POLYGON_AMOY,
    ChainId.ARTELA,
    ChainId.UNICHAIN_SEPOLIA,
    ChainId.IOTA,
    ChainId.BERACHAIN_MAINNET
];

export enum DexName {
    UNISWAP = 'Uniswap',
    KODIAK = 'Kodiak',
    WAGMI = 'Wagmi'
    // QUICK_SWAP = 'QuickSwap',
    // ARTELA_DEX = 'ArtelaDex',
    // UNI_DEX = 'UniDex'
}

export const DEX_BY_CHAIN = {
    [ChainId.BASE]: DexName.UNISWAP,
    [ChainId.BASE_SEPOLIA]: DexName.UNISWAP,
    [ChainId.ARTELA]: DexName.UNISWAP,
    [ChainId.BARTIO]: DexName.KODIAK,
    [ChainId.IOTA]: DexName.WAGMI,
    [ChainId.POLYGON_AMOY]: DexName.UNISWAP,
    [ChainId.UNICHAIN_SEPOLIA]: DexName.UNISWAP,
    [ChainId.BERACHAIN_MAINNET]: DexName.KODIAK
};

export const TIME_IN_YEAR = 31536000; // unit second
export enum PoolStatus {
    MY_POOl = 'MY_POOL',
    ACTIVE = 'ACTIVE',
    UP_COMING = 'UP_COMING',
    FULL = 'FULL',
    FINISHED = 'FINISHED',
    COMPLETED = 'COMPLETED',
    All_POOL = 'All_POOL',
    FAIL = 'FAIL',
    TRADING_VOLUME = 'VOLUME',
    MARKET_CAP = 'MARKET_CAP',
    PRICE_24H = 'PRICE_24H'
}

export enum PoolStatusSortFilter {
    ASC = 'asc',
    DESC = 'desc'
}

export enum PoolStatusSortOrderBy {
    START_TIME = 'startTime',
    CREATE_TIMESTAMP = 'createdTimestamp',
    LATEST_TIMESTAMP = 'latestTimestamp',
    FULL_TIMESTAMP = 'fullTimestamp',
    COMPLETED_TIMESTAMP = 'completedTimestamp',
    FAILED_TIMESTAMP = 'failTimestamp',
    LATEST_TIMESTAMP_BUY = 'latestTimestampBuy',
    TOTAL_VOLUME = 'totalVolume',
    RAISED_IN_ETH = 'raisedInETH',
    CHANGE_PRICE_24H = 'changePrice24h'
}
export interface DropdownObject {
    value: string | number;
    text: string;
}

export enum POOL_STATE {
    UP_COMING = 'Upcoming',
    LAUNCHING = 'Launching',
    FILLED = 'Filled',
    FAIL = 'Fail',
    CANCEL = 'Canceled'
}

export const poolStates: DropdownObject[] = [
    { text: PoolStatus.MY_POOl, value: PoolStatus.MY_POOl },
    { text: PoolStatus.UP_COMING, value: PoolStatus.UP_COMING },
    { text: PoolStatus.ACTIVE, value: PoolStatus.ACTIVE },
    // { text: PoolStatus.FULL, value: PoolStatus.FULL },
    // { text: PoolStatus.FINISHED, value: PoolStatus.FINISHED },
    { text: PoolStatus.COMPLETED, value: PoolStatus.COMPLETED },
    { text: PoolStatus.All_POOL, value: PoolStatus.All_POOL }
    // { text: PoolStatus.FAIL, value: PoolStatus.FAIL },
    // { text: PoolStatus.TRADING_VOLUME, value: PoolStatus.TRADING_VOLUME },
    // { text: PoolStatus.MARKET_CAP, value: PoolStatus.MARKET_CAP },
    // { text: PoolStatus.PRICE_24H, value: PoolStatus.PRICE_24H }
];

export const chainsList: DropdownObject[] = new Array();
SUPPORTED_NETWORKS.forEach((network, key) => {
    chainsList.push({ value: network.chainId, text: network.chainName });
});

export type KeyValueObj = {
    key: string;
    value: string;
};

export const chains = [
    {
        chainId: 84532,
        name: 'Base Sepolia',
        currency: 'ETH',
        explorerUrl: 'https://sepolia-explorer.base.org',
        rpcUrl: 'https://sepolia.base.org',
        onFaucet: true
    },
    {
        chainId: 80084,
        name: 'Berachain Bartio',
        currency: 'BERA',
        explorerUrl: 'https://bartio.beratrail.io',
        rpcUrl: 'https://bartio.rpc.berachain.com',
        onFaucet: true
    },
    {
        chainId: 80002,
        name: 'Polygon Amoy',
        currency: 'MATIC',
        explorerUrl: 'https://www.oklink.com/amoy',
        rpcUrl: 'https://rpc-amoy.polygon.technology/',
        onFaucet: true
    },
    {
        chainId: 11822,
        name: 'Artela Testnet',
        currency: 'ART',
        explorerUrl: 'https://betanet-scan.artela.network/',
        rpcUrl: 'https://betanet-rpc1.artela.network',
        onFaucet: false
    },
    {
        chainId: 1301,
        name: 'Unichain Sepolia Testnet',
        currency: 'ETH',
        explorerUrl: 'https://sepolia.uniscan.xyz',
        rpcUrl: 'https://sepolia.unichain.org',
        onFaucet: false
    },
    {
        chainId: 8453,
        name: 'Base Mainnet',
        currency: 'ETH',
        explorerUrl: 'https://basescan.org',
        rpcUrl: 'https://mainnet.base.org',
        onFaucet: false
    },
    {
        chainId: 8822,
        name: 'IOTA Mainnet',
        currency: 'IOTA',
        explorerUrl: 'https://explorer.evm.iota.org/',
        rpcUrl: 'https://json-rpc.evm.iotaledger.net',
        onFaucet: false
    },
    {
        chainId: 80094,
        name: 'Berachain Mainnet',
        currency: 'BERA',
        explorerUrl: 'https://berascan.com/',
        rpcUrl: 'https://rpc.berachain.com/',
        onFaucet: false
    }
];

export const hostNames = [
    {
        name: 'Bartio staging',
        url: NEXT_PUBLIC_DOMAIN_BARTIO_STG ?? ''
    },
    {
        name: 'Multiple chain staging',
        url: NEXT_PUBLIC_DOMAIN_MULTIPLE_STG ?? ''
    },
    {
        name: 'Berachain mainnet prod',
        url: NEXT_PUBLIC_DOMAIN_BERACHAIN_MAINNET_PROD ?? ''
    }
];

const hostNameInfo = useCurrentHostNameInformation();
const configs = getConfigs(hostNameInfo.url);

export const ENDPOINT_GRAPHQL_WITH_CHAIN = {
    [ChainId.BASE]: configs.subgraph.base.uri,
    [ChainId.BASE_SEPOLIA]: configs.subgraph.baseSepolia.uri,
    [ChainId.ARTELA]: configs.subgraph.artela.uri,
    [ChainId.BARTIO]: configs.subgraph.bartio.uri,
    [ChainId.BERACHAIN_MAINNET]: configs.subgraph.berachain.uri,
    [ChainId.POLYGON_AMOY]: configs.subgraph.polygonAmoy.uri,
    [ChainId.UNICHAIN_SEPOLIA]: configs.subgraph.unichainSepolia.uri,
    [ChainId.IOTA]: configs.subgraph.iota.uri
};

export const BLOCK_INTERVAL = {
    [ChainId.BASE]: 2,
    [ChainId.POLYGON_AMOY]: 2,
    [ChainId.ARTELA]: 2,
    [ChainId.BASE_SEPOLIA]: 2,
    [ChainId.UNICHAIN_SEPOLIA]: 2
};

export const PLATFORM_FEE = {
    [ChainId.BASE]: 0.005,
    [ChainId.POLYGON_AMOY]: 0.005,
    [ChainId.ARTELA]: 0.005,
    [ChainId.BASE_SEPOLIA]: 0.005,
    [ChainId.BARTIO]: 0.0001,
    [ChainId.BERACHAIN_MAINNET]: 10,
    [ChainId.UNICHAIN_SEPOLIA]: 0.005,
    [ChainId.IOTA]: 0.05
};

export const HARD_CAP_INITIAL_BY_CHAIN = {
    [ChainId.BASE]: 2,
    [ChainId.POLYGON_AMOY]: 2,
    [ChainId.ARTELA]: 2,
    [ChainId.BASE_SEPOLIA]: 2,
    [ChainId.BARTIO]: 2,
    [ChainId.BERACHAIN_MAINNET]: 1000,
    [ChainId.UNICHAIN_SEPOLIA]: 2,
    [ChainId.IOTA]: 10000
};

export enum NOTIFICATION_STATUS {
    UNREAD = 'UNREAD',
    READ = 'READ'
}

export const ROCKET_EVM_ABI = [
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'pool',
                type: 'address'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'tokenForAirdrop',
                type: 'uint256'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'tokenForFarm',
                type: 'uint256'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'tokenForSale',
                type: 'uint256'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'tokenForLiquidity',
                type: 'uint256'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'capInETH',
                type: 'uint256'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'totalBatch',
                type: 'uint256'
            },
            {
                indexed: false,
                internalType: 'string',
                name: 'metadata',
                type: 'string'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'startTime',
                type: 'uint256'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'endTime',
                type: 'uint256'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'minDurationSell',
                type: 'uint256'
            }
        ],
        name: 'ActivePool',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'pool',
                type: 'address'
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'buyer',
                type: 'address'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'paidETH',
                type: 'uint256'
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'referrer',
                type: 'address'
            }
        ],
        name: 'Bought',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'pool',
                type: 'address'
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'user',
                type: 'address'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256'
            }
        ],
        name: 'Claimed',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'pool',
                type: 'address'
            }
        ],
        name: 'CompletedPool',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'token',
                type: 'address'
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'owner',
                type: 'address'
            },
            {
                indexed: false,
                internalType: 'string',
                name: 'name',
                type: 'string'
            },
            {
                indexed: false,
                internalType: 'string',
                name: 'symbol',
                type: 'string'
            },
            {
                indexed: false,
                internalType: 'uint8',
                name: 'decimals',
                type: 'uint8'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'totalSupply',
                type: 'uint256'
            }
        ],
        name: 'CreateToken',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'pool',
                type: 'address'
            }
        ],
        name: 'FailPool',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'pool',
                type: 'address'
            }
        ],
        name: 'Finalized',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'pool',
                type: 'address'
            }
        ],
        name: 'FullPool',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint8',
                name: 'version',
                type: 'uint8'
            }
        ],
        name: 'Initialized',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'pool',
                type: 'address'
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'buyer',
                type: 'address'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'receivedETH',
                type: 'uint256'
            }
        ],
        name: 'Refund',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'bytes32',
                name: 'role',
                type: 'bytes32'
            },
            {
                indexed: true,
                internalType: 'bytes32',
                name: 'previousAdminRole',
                type: 'bytes32'
            },
            {
                indexed: true,
                internalType: 'bytes32',
                name: 'newAdminRole',
                type: 'bytes32'
            }
        ],
        name: 'RoleAdminChanged',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'bytes32',
                name: 'role',
                type: 'bytes32'
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'account',
                type: 'address'
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'sender',
                type: 'address'
            }
        ],
        name: 'RoleGranted',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'bytes32',
                name: 'role',
                type: 'bytes32'
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'account',
                type: 'address'
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'sender',
                type: 'address'
            }
        ],
        name: 'RoleRevoked',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'pool',
                type: 'address'
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'seller',
                type: 'address'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'receivedETH',
                type: 'uint256'
            }
        ],
        name: 'Sold',
        type: 'event'
    },
    {
        stateMutability: 'payable',
        type: 'fallback'
    },
    {
        inputs: [],
        name: 'ADMIN_ROLE',
        outputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'BASE_DENOMINATOR',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'BLOCK_INTERVAL',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'DEAD_ADDR',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'DEFAULT_ADMIN_ROLE',
        outputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'MINIMUM_CAP',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: 'address',
                        name: 'token',
                        type: 'address'
                    },
                    {
                        internalType: 'uint256',
                        name: 'fixedCapETH',
                        type: 'uint256'
                    },
                    {
                        internalType: 'uint256',
                        name: 'tokenForAirdrop',
                        type: 'uint256'
                    },
                    {
                        internalType: 'uint256',
                        name: 'tokenForFarm',
                        type: 'uint256'
                    },
                    {
                        internalType: 'uint256',
                        name: 'tokenForSale',
                        type: 'uint256'
                    },
                    {
                        internalType: 'uint256',
                        name: 'tokenForAddLP',
                        type: 'uint256'
                    },
                    {
                        internalType: 'uint256',
                        name: 'tokenPerPurchase',
                        type: 'uint256'
                    },
                    {
                        internalType: 'uint256',
                        name: 'maxRepeatPurchase',
                        type: 'uint256'
                    },
                    {
                        internalType: 'uint256',
                        name: 'startTime',
                        type: 'uint256'
                    },
                    {
                        internalType: 'uint256',
                        name: 'minDurationSell',
                        type: 'uint256'
                    },
                    {
                        internalType: 'uint256',
                        name: 'maxDurationSell',
                        type: 'uint256'
                    },
                    {
                        internalType: 'string',
                        name: 'metadata',
                        type: 'string'
                    }
                ],
                internalType: 'struct RocketBera.ActivePoolParams',
                name: 'params',
                type: 'tuple'
            }
        ],
        name: 'activePool',
        outputs: [],
        stateMutability: 'payable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            },
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        name: 'boughtCheck',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'poolAddress',
                type: 'address'
            },
            {
                internalType: 'uint256',
                name: 'numberBatch',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'maxAmountETH',
                type: 'uint256'
            },
            {
                internalType: 'address',
                name: 'referrer',
                type: 'address'
            }
        ],
        name: 'buy',
        outputs: [],
        stateMutability: 'payable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            },
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        name: 'buyerArr',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'pool',
                type: 'address'
            }
        ],
        name: 'caculateUnlockedPercent',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'pool',
                type: 'address'
            }
        ],
        name: 'claimToken',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        name: 'completedTransfer',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        name: 'counterSoldUsers',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'string',
                name: 'name',
                type: 'string'
            },
            {
                internalType: 'string',
                name: 'symbol',
                type: 'string'
            },
            {
                internalType: 'uint8',
                name: 'decimals',
                type: 'uint8'
            },
            {
                internalType: 'uint256',
                name: 'totalSupply',
                type: 'uint256'
            }
        ],
        name: 'createRocketToken',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'poolAddress',
                type: 'address'
            },
            {
                internalType: 'uint256',
                name: 'batchNumber',
                type: 'uint256'
            }
        ],
        name: 'estimateBuy',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'poolAddress',
                type: 'address'
            },
            {
                internalType: 'uint256',
                name: 'batchNumber',
                type: 'uint256'
            }
        ],
        name: 'estimateSell',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        name: 'farms',
        outputs: [
            {
                internalType: 'uint256',
                name: 'rewardPerBlock',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'lastRewardBlock',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'accTokenPerShare',
                type: 'uint256'
            },
            {
                internalType: 'bool',
                name: 'isDisable',
                type: 'bool'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'poolAddress',
                type: 'address'
            }
        ],
        name: 'finalize',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'amountOut',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'reserveIn',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'reserveOut',
                type: 'uint256'
            }
        ],
        name: 'getAmountIn',
        outputs: [
            {
                internalType: 'uint256',
                name: 'amountIn',
                type: 'uint256'
            }
        ],
        stateMutability: 'pure',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'amountIn',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'reserveIn',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'reserveOut',
                type: 'uint256'
            }
        ],
        name: 'getAmountOut',
        outputs: [
            {
                internalType: 'uint256',
                name: 'amountOut',
                type: 'uint256'
            }
        ],
        stateMutability: 'pure',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'poolAddress',
                type: 'address'
            }
        ],
        name: 'getMaxBatchCurrent',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'role',
                type: 'bytes32'
            }
        ],
        name: 'getRoleAdmin',
        outputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'role',
                type: 'bytes32'
            },
            {
                internalType: 'address',
                name: 'account',
                type: 'address'
            }
        ],
        name: 'grantRole',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'role',
                type: 'bytes32'
            },
            {
                internalType: 'address',
                name: 'account',
                type: 'address'
            }
        ],
        name: 'hasRole',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_platformAddress',
                type: 'address'
            },
            {
                internalType: 'uint256',
                name: '_platformFee',
                type: 'uint256'
            },
            {
                internalType: 'address',
                name: '_feeAddress',
                type: 'address'
            },
            {
                internalType: 'uint256',
                name: '_fee',
                type: 'uint256'
            },
            {
                internalType: 'address',
                name: '_airdropAddress',
                type: 'address'
            },
            {
                internalType: 'address',
                name: '_routerV2',
                type: 'address'
            },
            {
                internalType: 'uint256',
                name: '_blockInterval',
                type: 'uint256'
            }
        ],
        name: 'initialize',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: 'string',
                        name: 'name',
                        type: 'string'
                    },
                    {
                        internalType: 'string',
                        name: 'symbol',
                        type: 'string'
                    },
                    {
                        internalType: 'uint8',
                        name: 'decimals',
                        type: 'uint8'
                    },
                    {
                        internalType: 'uint256',
                        name: 'totalSupply',
                        type: 'uint256'
                    },
                    {
                        internalType: 'uint256',
                        name: 'fixedCapETH',
                        type: 'uint256'
                    },
                    {
                        internalType: 'uint256',
                        name: 'tokenForAirdrop',
                        type: 'uint256'
                    },
                    {
                        internalType: 'uint256',
                        name: 'tokenForFarm',
                        type: 'uint256'
                    },
                    {
                        internalType: 'uint256',
                        name: 'tokenForSale',
                        type: 'uint256'
                    },
                    {
                        internalType: 'uint256',
                        name: 'tokenForAddLP',
                        type: 'uint256'
                    },
                    {
                        internalType: 'uint256',
                        name: 'tokenPerPurchase',
                        type: 'uint256'
                    },
                    {
                        internalType: 'uint256',
                        name: 'maxRepeatPurchase',
                        type: 'uint256'
                    },
                    {
                        internalType: 'uint256',
                        name: 'startTime',
                        type: 'uint256'
                    },
                    {
                        internalType: 'uint256',
                        name: 'minDurationSell',
                        type: 'uint256'
                    },
                    {
                        internalType: 'uint256',
                        name: 'maxDurationSell',
                        type: 'uint256'
                    },
                    {
                        internalType: 'string',
                        name: 'metadata',
                        type: 'string'
                    },
                    {
                        internalType: 'uint256',
                        name: 'numberBatch',
                        type: 'uint256'
                    },
                    {
                        internalType: 'uint256',
                        name: 'maxAmountETH',
                        type: 'uint256'
                    },
                    {
                        internalType: 'address',
                        name: 'referrer',
                        type: 'address'
                    }
                ],
                internalType: 'struct RocketBera.LaunchPoolParams',
                name: 'params',
                type: 'tuple'
            }
        ],
        name: 'launchPool',
        outputs: [],
        stateMutability: 'payable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        name: 'ownerToken',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'poolAddress',
                type: 'address'
            },
            {
                internalType: 'address',
                name: 'userAddress',
                type: 'address'
            }
        ],
        name: 'pendingClaimAmount',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'poolAddress',
                type: 'address'
            },
            {
                internalType: 'address',
                name: 'userAddress',
                type: 'address'
            }
        ],
        name: 'pendingReferrerReward',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'poolAddress',
                type: 'address'
            },
            {
                internalType: 'address',
                name: 'userAddress',
                type: 'address'
            }
        ],
        name: 'pendingRewardFarming',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        name: 'poolInfos',
        outputs: [
            {
                internalType: 'uint256',
                name: 'fixedCapETH',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'totalSupplyToken',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'tokenForAirdrop',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'tokenForFarm',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'tokenForSale',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'tokenForAddLP',
                type: 'uint256'
            },
            {
                internalType: 'string',
                name: 'metadata',
                type: 'string'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        name: 'pools',
        outputs: [
            {
                internalType: 'uint256',
                name: 'tokenPerPurchase',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'maxRepeatPurchase',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'totalBatch',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'startTime',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'endTime',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'minDurationSell',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'maxDurationSell',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'raisedInETH',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'soldBatch',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'reserveETH',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'reserveBatch',
                type: 'uint256'
            },
            {
                internalType: 'enum RocketBera.StatusPool',
                name: 'status',
                type: 'uint8'
            },
            {
                internalType: 'uint256',
                name: 'totalReferrerBond',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'totalBatchAvailable',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'tokenAddress',
                type: 'address'
            }
        ],
        name: 'refundETHToUsers',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'role',
                type: 'bytes32'
            },
            {
                internalType: 'address',
                name: 'account',
                type: 'address'
            }
        ],
        name: 'renounceRole',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'role',
                type: 'bytes32'
            },
            {
                internalType: 'address',
                name: 'account',
                type: 'address'
            }
        ],
        name: 'revokeRole',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [],
        name: 'rocketTokenFactory',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'poolAddress',
                type: 'address'
            },
            {
                internalType: 'uint256',
                name: 'batchNumber',
                type: 'uint256'
            }
        ],
        name: 'sell',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_rocketTokenFactory',
                type: 'address'
            }
        ],
        name: 'setRocketTokenFactory',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'bytes4',
                name: 'interfaceId',
                type: 'bytes4'
            }
        ],
        name: 'supportsInterface',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'tokenAddress',
                type: 'address'
            }
        ],
        name: 'transferTokenUsers',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            },
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        name: 'users',
        outputs: [
            {
                internalType: 'uint256',
                name: 'balance',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'balanceSold',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'ethBought',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'rewardFarm',
                type: 'uint256'
            },
            {
                internalType: 'bool',
                name: 'isClaimed',
                type: 'bool'
            },
            {
                internalType: 'uint256',
                name: 'rewardDebt',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'tokenClaimed',
                type: 'uint256'
            },
            {
                internalType: 'bool',
                name: 'isClaimedFarm',
                type: 'bool'
            },
            {
                internalType: 'uint256',
                name: 'referrerReward',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'referrerBond',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        name: 'vesting',
        outputs: [
            {
                internalType: 'uint256',
                name: 'startTime',
                type: 'uint256'
            },
            {
                internalType: 'bool',
                name: 'isExist',
                type: 'bool'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        stateMutability: 'payable',
        type: 'receive'
    }
];

export const ROCKET_EVM_ABI_PROD = [
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'pool',
                type: 'address'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'tokenForAirdrop',
                type: 'uint256'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'tokenForFarm',
                type: 'uint256'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'tokenForSale',
                type: 'uint256'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'tokenForLiquidity',
                type: 'uint256'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'capInETH',
                type: 'uint256'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'totalBatch',
                type: 'uint256'
            },
            {
                indexed: false,
                internalType: 'string',
                name: 'metadata',
                type: 'string'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'startTime',
                type: 'uint256'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'endTime',
                type: 'uint256'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'minDurationSell',
                type: 'uint256'
            }
        ],
        name: 'ActivePool',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'pool',
                type: 'address'
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'buyer',
                type: 'address'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'paidETH',
                type: 'uint256'
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'referrer',
                type: 'address'
            }
        ],
        name: 'Bought',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'pool',
                type: 'address'
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'user',
                type: 'address'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256'
            }
        ],
        name: 'Claimed',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'pool',
                type: 'address'
            }
        ],
        name: 'CompletedPool',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'token',
                type: 'address'
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'owner',
                type: 'address'
            },
            {
                indexed: false,
                internalType: 'string',
                name: 'name',
                type: 'string'
            },
            {
                indexed: false,
                internalType: 'string',
                name: 'symbol',
                type: 'string'
            },
            {
                indexed: false,
                internalType: 'uint8',
                name: 'decimals',
                type: 'uint8'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'totalSupply',
                type: 'uint256'
            }
        ],
        name: 'CreateToken',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'pool',
                type: 'address'
            }
        ],
        name: 'FailPool',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'pool',
                type: 'address'
            }
        ],
        name: 'Finalized',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'pool',
                type: 'address'
            }
        ],
        name: 'FullPool',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint8',
                name: 'version',
                type: 'uint8'
            }
        ],
        name: 'Initialized',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'pool',
                type: 'address'
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'buyer',
                type: 'address'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'receivedETH',
                type: 'uint256'
            }
        ],
        name: 'Refund',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'bytes32',
                name: 'role',
                type: 'bytes32'
            },
            {
                indexed: true,
                internalType: 'bytes32',
                name: 'previousAdminRole',
                type: 'bytes32'
            },
            {
                indexed: true,
                internalType: 'bytes32',
                name: 'newAdminRole',
                type: 'bytes32'
            }
        ],
        name: 'RoleAdminChanged',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'bytes32',
                name: 'role',
                type: 'bytes32'
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'account',
                type: 'address'
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'sender',
                type: 'address'
            }
        ],
        name: 'RoleGranted',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'bytes32',
                name: 'role',
                type: 'bytes32'
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'account',
                type: 'address'
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'sender',
                type: 'address'
            }
        ],
        name: 'RoleRevoked',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'pool',
                type: 'address'
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'seller',
                type: 'address'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'receivedETH',
                type: 'uint256'
            }
        ],
        name: 'Sold',
        type: 'event'
    },
    {
        stateMutability: 'payable',
        type: 'fallback'
    },
    {
        inputs: [],
        name: 'ADMIN_ROLE',
        outputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'BASE_DENOMINATOR',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'BLOCK_INTERVAL',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'DEAD_ADDR',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'DEFAULT_ADMIN_ROLE',
        outputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'MINIMUM_CAP',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: 'address',
                        name: 'token',
                        type: 'address'
                    },
                    {
                        internalType: 'uint256',
                        name: 'fixedCapETH',
                        type: 'uint256'
                    },
                    {
                        internalType: 'uint256',
                        name: 'tokenForAirdrop',
                        type: 'uint256'
                    },
                    {
                        internalType: 'uint256',
                        name: 'tokenForFarm',
                        type: 'uint256'
                    },
                    {
                        internalType: 'uint256',
                        name: 'tokenForSale',
                        type: 'uint256'
                    },
                    {
                        internalType: 'uint256',
                        name: 'tokenForAddLP',
                        type: 'uint256'
                    },
                    {
                        internalType: 'uint256',
                        name: 'tokenPerPurchase',
                        type: 'uint256'
                    },
                    {
                        internalType: 'uint256',
                        name: 'maxRepeatPurchase',
                        type: 'uint256'
                    },
                    {
                        internalType: 'uint256',
                        name: 'startTime',
                        type: 'uint256'
                    },
                    {
                        internalType: 'uint256',
                        name: 'minDurationSell',
                        type: 'uint256'
                    },
                    {
                        internalType: 'uint256',
                        name: 'maxDurationSell',
                        type: 'uint256'
                    },
                    {
                        internalType: 'string',
                        name: 'metadata',
                        type: 'string'
                    }
                ],
                internalType: 'struct RocketBase.ActivePoolParams',
                name: 'params',
                type: 'tuple'
            }
        ],
        name: 'activePool',
        outputs: [],
        stateMutability: 'payable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            },
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        name: 'boughtCheck',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'poolAddress',
                type: 'address'
            },
            {
                internalType: 'uint256',
                name: 'numberBatch',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'maxAmountETH',
                type: 'uint256'
            },
            {
                internalType: 'address',
                name: 'referrer',
                type: 'address'
            }
        ],
        name: 'buy',
        outputs: [],
        stateMutability: 'payable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            },
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        name: 'buyerArr',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'pool',
                type: 'address'
            }
        ],
        name: 'caculateUnlockedPercent',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'pool',
                type: 'address'
            }
        ],
        name: 'claimToken',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        name: 'completedTransfer',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        name: 'counterSoldUsers',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'string',
                name: 'name',
                type: 'string'
            },
            {
                internalType: 'string',
                name: 'symbol',
                type: 'string'
            },
            {
                internalType: 'uint8',
                name: 'decimals',
                type: 'uint8'
            },
            {
                internalType: 'uint256',
                name: 'totalSupply',
                type: 'uint256'
            }
        ],
        name: 'createRocketToken',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'poolAddress',
                type: 'address'
            },
            {
                internalType: 'uint256',
                name: 'batchNumber',
                type: 'uint256'
            }
        ],
        name: 'estimateBuy',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'poolAddress',
                type: 'address'
            },
            {
                internalType: 'uint256',
                name: 'batchNumber',
                type: 'uint256'
            }
        ],
        name: 'estimateSell',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        name: 'farms',
        outputs: [
            {
                internalType: 'uint256',
                name: 'rewardPerBlock',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'lastRewardBlock',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'accTokenPerShare',
                type: 'uint256'
            },
            {
                internalType: 'bool',
                name: 'isDisable',
                type: 'bool'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'poolAddress',
                type: 'address'
            }
        ],
        name: 'finalize',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'amountIn',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'reserveIn',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'reserveOut',
                type: 'uint256'
            }
        ],
        name: 'getAmountOut',
        outputs: [
            {
                internalType: 'uint256',
                name: 'amountOut',
                type: 'uint256'
            }
        ],
        stateMutability: 'pure',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'poolAddress',
                type: 'address'
            }
        ],
        name: 'getMaxBatchCurrent',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'role',
                type: 'bytes32'
            }
        ],
        name: 'getRoleAdmin',
        outputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'role',
                type: 'bytes32'
            },
            {
                internalType: 'address',
                name: 'account',
                type: 'address'
            }
        ],
        name: 'grantRole',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'role',
                type: 'bytes32'
            },
            {
                internalType: 'address',
                name: 'account',
                type: 'address'
            }
        ],
        name: 'hasRole',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_platformAddress',
                type: 'address'
            },
            {
                internalType: 'uint256',
                name: '_platformFee',
                type: 'uint256'
            },
            {
                internalType: 'address',
                name: '_feeAddress',
                type: 'address'
            },
            {
                internalType: 'uint256',
                name: '_fee',
                type: 'uint256'
            },
            {
                internalType: 'address',
                name: '_routerV2',
                type: 'address'
            },
            {
                internalType: 'uint256',
                name: '_blockInterval',
                type: 'uint256'
            }
        ],
        name: 'initialize',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        name: 'ownerToken',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'poolAddress',
                type: 'address'
            },
            {
                internalType: 'address',
                name: 'userAddress',
                type: 'address'
            }
        ],
        name: 'pendingClaimAmount',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'poolAddress',
                type: 'address'
            },
            {
                internalType: 'address',
                name: 'userAddress',
                type: 'address'
            }
        ],
        name: 'pendingReferrerReward',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'poolAddress',
                type: 'address'
            },
            {
                internalType: 'address',
                name: 'userAddress',
                type: 'address'
            }
        ],
        name: 'pendingRewardFarming',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        name: 'poolInfos',
        outputs: [
            {
                internalType: 'uint256',
                name: 'fixedCapETH',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'totalSupplyToken',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'tokenForAirdrop',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'tokenForFarm',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'tokenForSale',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'tokenForAddLP',
                type: 'uint256'
            },
            {
                internalType: 'string',
                name: 'metadata',
                type: 'string'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        name: 'pools',
        outputs: [
            {
                internalType: 'uint256',
                name: 'tokenPerPurchase',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'maxRepeatPurchase',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'totalBatch',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'startTime',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'endTime',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'minDurationSell',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'maxDurationSell',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'raisedInETH',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'soldBatch',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'reserveETH',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'reserveBatch',
                type: 'uint256'
            },
            {
                internalType: 'enum RocketBase.StatusPool',
                name: 'status',
                type: 'uint8'
            },
            {
                internalType: 'uint256',
                name: 'totalReferrerBond',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'tokenAddress',
                type: 'address'
            }
        ],
        name: 'refundETHToUsers',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'role',
                type: 'bytes32'
            },
            {
                internalType: 'address',
                name: 'account',
                type: 'address'
            }
        ],
        name: 'renounceRole',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'role',
                type: 'bytes32'
            },
            {
                internalType: 'address',
                name: 'account',
                type: 'address'
            }
        ],
        name: 'revokeRole',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'poolAddress',
                type: 'address'
            },
            {
                internalType: 'uint256',
                name: 'batchNumber',
                type: 'uint256'
            }
        ],
        name: 'sell',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_minimumCap',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: '_duration',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: '_percentReleaseAtTGE',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: '_percentRelease',
                type: 'uint256'
            }
        ],
        name: 'setupConfig',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_platformAddress',
                type: 'address'
            },
            {
                internalType: 'uint256',
                name: '_platformFee',
                type: 'uint256'
            },
            {
                internalType: 'address',
                name: '_feeAddress',
                type: 'address'
            },
            {
                internalType: 'uint256',
                name: '_fee',
                type: 'uint256'
            }
        ],
        name: 'setupPlatform',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'bytes4',
                name: 'interfaceId',
                type: 'bytes4'
            }
        ],
        name: 'supportsInterface',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'tokenAddress',
                type: 'address'
            }
        ],
        name: 'transferTokenUsers',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            },
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        name: 'users',
        outputs: [
            {
                internalType: 'uint256',
                name: 'balance',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'balanceSold',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'ethBought',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'rewardFarm',
                type: 'uint256'
            },
            {
                internalType: 'bool',
                name: 'isClaimed',
                type: 'bool'
            },
            {
                internalType: 'uint256',
                name: 'rewardDebt',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'tokenClaimed',
                type: 'uint256'
            },
            {
                internalType: 'bool',
                name: 'isClaimedFarm',
                type: 'bool'
            },
            {
                internalType: 'uint256',
                name: 'referrerReward',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'referrerBond',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        name: 'vesting',
        outputs: [
            {
                internalType: 'uint256',
                name: 'startTime',
                type: 'uint256'
            },
            {
                internalType: 'bool',
                name: 'isExist',
                type: 'bool'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        stateMutability: 'payable',
        type: 'receive'
    }
];

export const ROCKET_EVM_ABI_IOTA_PROD = [
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'pool',
                type: 'address'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'tokenForAirdrop',
                type: 'uint256'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'tokenForFarm',
                type: 'uint256'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'tokenForSale',
                type: 'uint256'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'tokenForLiquidity',
                type: 'uint256'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'capInETH',
                type: 'uint256'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'totalBatch',
                type: 'uint256'
            },
            {
                indexed: false,
                internalType: 'string',
                name: 'metadata',
                type: 'string'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'startTime',
                type: 'uint256'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'endTime',
                type: 'uint256'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'minDurationSell',
                type: 'uint256'
            }
        ],
        name: 'ActivePool',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'pool',
                type: 'address'
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'buyer',
                type: 'address'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'paidETH',
                type: 'uint256'
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'referrer',
                type: 'address'
            }
        ],
        name: 'Bought',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'pool',
                type: 'address'
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'user',
                type: 'address'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256'
            }
        ],
        name: 'Claimed',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'pool',
                type: 'address'
            }
        ],
        name: 'CompletedPool',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'token',
                type: 'address'
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'owner',
                type: 'address'
            },
            {
                indexed: false,
                internalType: 'string',
                name: 'name',
                type: 'string'
            },
            {
                indexed: false,
                internalType: 'string',
                name: 'symbol',
                type: 'string'
            },
            {
                indexed: false,
                internalType: 'uint8',
                name: 'decimals',
                type: 'uint8'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'totalSupply',
                type: 'uint256'
            }
        ],
        name: 'CreateToken',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'pool',
                type: 'address'
            }
        ],
        name: 'FailPool',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'pool',
                type: 'address'
            }
        ],
        name: 'Finalized',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'pool',
                type: 'address'
            }
        ],
        name: 'FullPool',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint8',
                name: 'version',
                type: 'uint8'
            }
        ],
        name: 'Initialized',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'pool',
                type: 'address'
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'buyer',
                type: 'address'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'receivedETH',
                type: 'uint256'
            }
        ],
        name: 'Refund',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'bytes32',
                name: 'role',
                type: 'bytes32'
            },
            {
                indexed: true,
                internalType: 'bytes32',
                name: 'previousAdminRole',
                type: 'bytes32'
            },
            {
                indexed: true,
                internalType: 'bytes32',
                name: 'newAdminRole',
                type: 'bytes32'
            }
        ],
        name: 'RoleAdminChanged',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'bytes32',
                name: 'role',
                type: 'bytes32'
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'account',
                type: 'address'
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'sender',
                type: 'address'
            }
        ],
        name: 'RoleGranted',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'bytes32',
                name: 'role',
                type: 'bytes32'
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'account',
                type: 'address'
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'sender',
                type: 'address'
            }
        ],
        name: 'RoleRevoked',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'pool',
                type: 'address'
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'seller',
                type: 'address'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'receivedETH',
                type: 'uint256'
            }
        ],
        name: 'Sold',
        type: 'event'
    },
    {
        stateMutability: 'payable',
        type: 'fallback'
    },
    {
        inputs: [],
        name: 'ADMIN_ROLE',
        outputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'BASE_DENOMINATOR',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'BLOCK_INTERVAL',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'DEAD_ADDR',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'DEFAULT_ADMIN_ROLE',
        outputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'MINIMUM_CAP',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'WETH',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: 'address',
                        name: 'token',
                        type: 'address'
                    },
                    {
                        internalType: 'uint256',
                        name: 'fixedCapETH',
                        type: 'uint256'
                    },
                    {
                        internalType: 'uint256',
                        name: 'tokenForAirdrop',
                        type: 'uint256'
                    },
                    {
                        internalType: 'uint256',
                        name: 'tokenForFarm',
                        type: 'uint256'
                    },
                    {
                        internalType: 'uint256',
                        name: 'tokenForSale',
                        type: 'uint256'
                    },
                    {
                        internalType: 'uint256',
                        name: 'tokenForAddLP',
                        type: 'uint256'
                    },
                    {
                        internalType: 'uint256',
                        name: 'tokenPerPurchase',
                        type: 'uint256'
                    },
                    {
                        internalType: 'uint256',
                        name: 'maxRepeatPurchase',
                        type: 'uint256'
                    },
                    {
                        internalType: 'uint256',
                        name: 'startTime',
                        type: 'uint256'
                    },
                    {
                        internalType: 'uint256',
                        name: 'minDurationSell',
                        type: 'uint256'
                    },
                    {
                        internalType: 'uint256',
                        name: 'maxDurationSell',
                        type: 'uint256'
                    },
                    {
                        internalType: 'string',
                        name: 'metadata',
                        type: 'string'
                    }
                ],
                internalType: 'struct RocketIOTA.ActivePoolParams',
                name: 'params',
                type: 'tuple'
            }
        ],
        name: 'activePool',
        outputs: [],
        stateMutability: 'payable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            },
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        name: 'boughtCheck',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'poolAddress',
                type: 'address'
            },
            {
                internalType: 'uint256',
                name: 'numberBatch',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'maxAmountETH',
                type: 'uint256'
            },
            {
                internalType: 'address',
                name: 'referrer',
                type: 'address'
            }
        ],
        name: 'buy',
        outputs: [],
        stateMutability: 'payable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            },
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        name: 'buyerArr',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'pool',
                type: 'address'
            }
        ],
        name: 'caculateUnlockedPercent',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'pool',
                type: 'address'
            }
        ],
        name: 'claimToken',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        name: 'completedTransfer',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        name: 'counterSoldUsers',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'string',
                name: 'name',
                type: 'string'
            },
            {
                internalType: 'string',
                name: 'symbol',
                type: 'string'
            },
            {
                internalType: 'uint8',
                name: 'decimals',
                type: 'uint8'
            },
            {
                internalType: 'uint256',
                name: 'totalSupply',
                type: 'uint256'
            }
        ],
        name: 'createRocketToken',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'poolAddress',
                type: 'address'
            },
            {
                internalType: 'uint256',
                name: 'batchNumber',
                type: 'uint256'
            }
        ],
        name: 'estimateBuy',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'poolAddress',
                type: 'address'
            },
            {
                internalType: 'uint256',
                name: 'batchNumber',
                type: 'uint256'
            }
        ],
        name: 'estimateSell',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        name: 'farms',
        outputs: [
            {
                internalType: 'uint256',
                name: 'rewardPerBlock',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'lastRewardBlock',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'accTokenPerShare',
                type: 'uint256'
            },
            {
                internalType: 'bool',
                name: 'isDisable',
                type: 'bool'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'poolAddress',
                type: 'address'
            }
        ],
        name: 'finalize',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'amountOut',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'reserveIn',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'reserveOut',
                type: 'uint256'
            }
        ],
        name: 'getAmountIn',
        outputs: [
            {
                internalType: 'uint256',
                name: 'amountIn',
                type: 'uint256'
            }
        ],
        stateMutability: 'pure',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'amountIn',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'reserveIn',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'reserveOut',
                type: 'uint256'
            }
        ],
        name: 'getAmountOut',
        outputs: [
            {
                internalType: 'uint256',
                name: 'amountOut',
                type: 'uint256'
            }
        ],
        stateMutability: 'pure',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'poolAddress',
                type: 'address'
            }
        ],
        name: 'getMaxBatchCurrent',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'role',
                type: 'bytes32'
            }
        ],
        name: 'getRoleAdmin',
        outputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'role',
                type: 'bytes32'
            },
            {
                internalType: 'address',
                name: 'account',
                type: 'address'
            }
        ],
        name: 'grantRole',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'role',
                type: 'bytes32'
            },
            {
                internalType: 'address',
                name: 'account',
                type: 'address'
            }
        ],
        name: 'hasRole',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_platformAddress',
                type: 'address'
            },
            {
                internalType: 'uint256',
                name: '_platformFee',
                type: 'uint256'
            },
            {
                internalType: 'address',
                name: '_feeAddress',
                type: 'address'
            },
            {
                internalType: 'uint256',
                name: '_fee',
                type: 'uint256'
            },
            {
                internalType: 'address',
                name: '_router',
                type: 'address'
            },
            {
                internalType: 'uint256',
                name: '_blockInterval',
                type: 'uint256'
            },
            {
                internalType: 'address',
                name: '_WETH',
                type: 'address'
            }
        ],
        name: 'initialize',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: 'string',
                        name: 'name',
                        type: 'string'
                    },
                    {
                        internalType: 'string',
                        name: 'symbol',
                        type: 'string'
                    },
                    {
                        internalType: 'uint8',
                        name: 'decimals',
                        type: 'uint8'
                    },
                    {
                        internalType: 'uint256',
                        name: 'totalSupply',
                        type: 'uint256'
                    },
                    {
                        internalType: 'uint256',
                        name: 'fixedCapETH',
                        type: 'uint256'
                    },
                    {
                        internalType: 'uint256',
                        name: 'tokenForAirdrop',
                        type: 'uint256'
                    },
                    {
                        internalType: 'uint256',
                        name: 'tokenForFarm',
                        type: 'uint256'
                    },
                    {
                        internalType: 'uint256',
                        name: 'tokenForSale',
                        type: 'uint256'
                    },
                    {
                        internalType: 'uint256',
                        name: 'tokenForAddLP',
                        type: 'uint256'
                    },
                    {
                        internalType: 'uint256',
                        name: 'tokenPerPurchase',
                        type: 'uint256'
                    },
                    {
                        internalType: 'uint256',
                        name: 'maxRepeatPurchase',
                        type: 'uint256'
                    },
                    {
                        internalType: 'uint256',
                        name: 'startTime',
                        type: 'uint256'
                    },
                    {
                        internalType: 'uint256',
                        name: 'minDurationSell',
                        type: 'uint256'
                    },
                    {
                        internalType: 'uint256',
                        name: 'maxDurationSell',
                        type: 'uint256'
                    },
                    {
                        internalType: 'string',
                        name: 'metadata',
                        type: 'string'
                    },
                    {
                        internalType: 'uint256',
                        name: 'numberBatch',
                        type: 'uint256'
                    },
                    {
                        internalType: 'uint256',
                        name: 'maxAmountETH',
                        type: 'uint256'
                    },
                    {
                        internalType: 'address',
                        name: 'referrer',
                        type: 'address'
                    }
                ],
                internalType: 'struct RocketIOTA.LaunchPoolParams',
                name: 'params',
                type: 'tuple'
            }
        ],
        name: 'launchPool',
        outputs: [],
        stateMutability: 'payable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        name: 'ownerToken',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'poolAddress',
                type: 'address'
            },
            {
                internalType: 'address',
                name: 'userAddress',
                type: 'address'
            }
        ],
        name: 'pendingClaimAmount',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'poolAddress',
                type: 'address'
            },
            {
                internalType: 'address',
                name: 'userAddress',
                type: 'address'
            }
        ],
        name: 'pendingReferrerReward',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'poolAddress',
                type: 'address'
            },
            {
                internalType: 'address',
                name: 'userAddress',
                type: 'address'
            }
        ],
        name: 'pendingRewardFarming',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        name: 'poolInfos',
        outputs: [
            {
                internalType: 'uint256',
                name: 'fixedCapETH',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'totalSupplyToken',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'tokenForAirdrop',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'tokenForFarm',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'tokenForSale',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'tokenForAddLP',
                type: 'uint256'
            },
            {
                internalType: 'string',
                name: 'metadata',
                type: 'string'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        name: 'pools',
        outputs: [
            {
                internalType: 'uint256',
                name: 'tokenPerPurchase',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'maxRepeatPurchase',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'totalBatch',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'startTime',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'endTime',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'minDurationSell',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'maxDurationSell',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'raisedInETH',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'soldBatch',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'reserveETH',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'reserveBatch',
                type: 'uint256'
            },
            {
                internalType: 'enum RocketIOTA.StatusPool',
                name: 'status',
                type: 'uint8'
            },
            {
                internalType: 'uint256',
                name: 'totalReferrerBond',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'totalBatchAvailable',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'tokenAddress',
                type: 'address'
            }
        ],
        name: 'refundETHToUsers',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'role',
                type: 'bytes32'
            },
            {
                internalType: 'address',
                name: 'account',
                type: 'address'
            }
        ],
        name: 'renounceRole',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'role',
                type: 'bytes32'
            },
            {
                internalType: 'address',
                name: 'account',
                type: 'address'
            }
        ],
        name: 'revokeRole',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [],
        name: 'rocketTokenFactory',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'poolAddress',
                type: 'address'
            },
            {
                internalType: 'uint256',
                name: 'batchNumber',
                type: 'uint256'
            }
        ],
        name: 'sell',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_percentReleaseAtTGE',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: '_percentRelease',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: '_minimumCap',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: '_duration',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: '_blockInterval',
                type: 'uint256'
            }
        ],
        name: 'setConfig',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_platformFee',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: '_fee',
                type: 'uint256'
            }
        ],
        name: 'setFee',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_rocketTokenFactory',
                type: 'address'
            }
        ],
        name: 'setRocketTokenFactory',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'bytes4',
                name: 'interfaceId',
                type: 'bytes4'
            }
        ],
        name: 'supportsInterface',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'tokenAddress',
                type: 'address'
            }
        ],
        name: 'transferTokenUsers',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            },
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        name: 'users',
        outputs: [
            {
                internalType: 'uint256',
                name: 'balance',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'balanceSold',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'ethBought',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'rewardFarm',
                type: 'uint256'
            },
            {
                internalType: 'bool',
                name: 'isClaimed',
                type: 'bool'
            },
            {
                internalType: 'uint256',
                name: 'rewardDebt',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'tokenClaimed',
                type: 'uint256'
            },
            {
                internalType: 'bool',
                name: 'isClaimedFarm',
                type: 'bool'
            },
            {
                internalType: 'uint256',
                name: 'referrerReward',
                type: 'uint256'
            },
            {
                internalType: 'uint256',
                name: 'referrerBond',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        name: 'vesting',
        outputs: [
            {
                internalType: 'uint256',
                name: 'startTime',
                type: 'uint256'
            },
            {
                internalType: 'bool',
                name: 'isExist',
                type: 'bool'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        stateMutability: 'payable',
        type: 'receive'
    }
];

export const ROCKET_EVM_ABI_BY_CHAIN = {
    [ChainId.BASE]: ROCKET_EVM_ABI_PROD,
    [ChainId.POLYGON_AMOY]: ROCKET_EVM_ABI,
    [ChainId.ARTELA]: ROCKET_EVM_ABI,
    [ChainId.BASE_SEPOLIA]: ROCKET_EVM_ABI,
    [ChainId.BARTIO]: ROCKET_EVM_ABI,
    [ChainId.BERACHAIN_MAINNET]: ROCKET_EVM_ABI,
    [ChainId.UNICHAIN_SEPOLIA]: ROCKET_EVM_ABI,
    [ChainId.IOTA]: ROCKET_EVM_ABI_IOTA_PROD
};

export const markSlider = {
    25: '25',
    50: '50',
    75: '75',
    100: '100'
};

export const markCreatePoolSlider = {
    3000: '3000',
    5000: '5000',
    7000: '7000',
    9000: '9000'
};

export const socialMediaOptions: { value: string; label: string }[] = [
    { value: 'twitter', label: 'Twitter' }
    // { value: 'telegram', label: 'Telegram' }
];

export const epochTimeChecked = 1717135267;

export const REGEX_WEBSITE =
    /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+)(\.[a-zA-Z]{2,})(\/\S*)?$/;
export const REGEX_DISCORD =
    /^(https?:\/\/)?(www\.)?(discord\.gg\/[a-zA-Z0-9-]+|discord(app)?\.com\/(invite\/[a-zA-Z0-9-]+|channels\/(@me|\d+\/\d+)))$/;
export const REGEX_TWITTER =
    /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/(#!\/)?(\w+\/status(es)?\/\d+|\w+|lists\/\w+\/\w+)$/;
export const REGEX_TELEGRAM =
    /^(https?:\/\/)?(www\.)?(t\.me|telegram\.me)\/(\+?[a-zA-Z0-9_-]+|joinchat\/[a-zA-Z0-9_-]+|[a-zA-Z0-9_]+)$/;
export const REGEX_ISNUMBER = /^-?\d+(\.\d+)?$/;
export const REGEX_WALLET_ADDRESS = /^0x[\dA-Fa-f]{40}$/;
