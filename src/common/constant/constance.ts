/* eslint-disable */

import { Environment } from '@/src/config/type';
import {
    NEXT_PUBLIC_ENVIRONMENT,
    NEXT_PUBLIC_SUPPORTED_CHAINS
} from '../web3/constants/env';
import { SUPPORTED_NETWORKS } from '../web3/network';

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

export const getSupportedChains = (): number[] => {
    const supportedChainsStr = NEXT_PUBLIC_SUPPORTED_CHAINS;
    if (!supportedChainsStr) return [];
    return supportedChainsStr
        .split(',')
        .map((id) => parseInt(id.trim()))
        .filter((chainId) => !isNaN(chainId)); // Lọc bỏ giá trị NaN
};

export const getEnvironment = (): Environment => {
    const env = NEXT_PUBLIC_ENVIRONMENT as Environment;
    const validEnvironments: Environment[] = [
        'development',
        'staging',
        'production'
    ];

    return validEnvironments.includes(env) ? env : 'development';
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
    [ChainId.BERACHAIN_MAINNET]: 0.1,
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

export enum CodeReferStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE'
}

export enum CodeReferStatusID {
    ACTIVE = 1,
    INACTIVE = 2
}

export const CodeReferStatusColor: {
    [key in CodeReferStatus]: string;
} = {
    [CodeReferStatus.ACTIVE]: 'green',
    [CodeReferStatus.INACTIVE]: 'red'
};

export const statusBadgeColor = {
    ACTIVE: 'green',
    INACTIVE: 'red'
};

// Breakpoint
export const SCREEN_XXL = 1600 + 0.02;
export const SCREEN_XL = 1200 + 0.02;
export const SCREEN_L = 992 + 0.02;
export const SCREEN_MD = 768 + 0.02;
export const SCREEN_SM = 576 + 0.02;
export const SCREEN_XS = 375 + 0.02;

export const urlRegex =
    /^(https?:\/\/)?((?!\/\/)[\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/;
export const CONSTANT_EMPTY_STRING: string = '';
export const ADDRESS_NULL = '0x0000000000000000000000000000000000000000';

export const ACCEPT_AVATAR_TYPES = '.jpg,.jpeg,.png';
export const MAX_AVATAR_FILE_SIZE = 20;

export enum AccountFileType {
    AVATAR = '0'
}

export enum TOKEN_STATUS {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'NOT_ACTIVE',
    SUCCESS = 'Success',
    COMPLETED = 'COMPLETED',
    FAIL = 'FAIL'
}
