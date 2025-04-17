/* eslint-disable */
import {
    ChainId,
    KeyValueObj,
    PoolStatus,
    PoolStatusSortFilter,
    PoolStatusSortOrderBy
} from '@/src/common/constant/constance';
import { IPoolDetail } from '@/src/services/response.type';
import { EActionStatus, FetchError } from '../type';

export interface ITransaction {
    id: string;
    pool: string;
    sender: string;
    blockNumber: string;
    timestamp: string;
    batch: string;
    eth: string;
    isBuy: boolean;
}

export interface IResponseCreateAiAgent {
    id: string;
    message: string;
    name: string;
}

export interface IAnalystData {
    apy: string;
    raisedETH: string;
    raisedUSD: string;
    startPrice: string; // by token in USD
    endPrice: string; // by token in USD
    currentPrice: string; // by token in USD
    liquidityPrice: string; // by token in USD
    startBondPerETH: string; // 1 batch by ETH
    endBondPerETH: string; // 1 batch by ETH
    listingBondPerETH: string; // 1 batch by ETH
    tokenPerBond: string; // 1 batch by token
}

export interface Transaction {
    id: string;
    hash: string;
    type: string;
    pool: string;
    sender: string;
    blockNumber: string;
    timestamp: string;
    batch: string;
    eth: string;
    isBuy: boolean;
}

export interface UserPoolInfo {
    id: string;
    pool: string;
    user: string;
    batch: string;
    ethBought: string;
    batchClaim: string;
}

export interface InvestPool {
    pendingClaimAmount: string;
    pendingRewardFarming: string;
    balance: string;
}
export interface IMetaData {
    image: string;
    
    tokenImageUrl?: string | null;
    description: any;
    website: string | null;
    telegram: string | null;
    twitter: string | null;
    discord: string | null;
}

export interface IFormData {
    error: boolean;
    helperText: string;
    value: string;
}
export interface IResponseMetadata {
    data: {
        image: IFormData;
        imageAiAgent: IFormData;
        description: IFormData;
        website: IFormData;
        telegram: IFormData;
        twitter: IFormData;
        discord: IFormData;
    };
}
interface IResponseMetadataBody {
    data: {
        body: string;
    };
}
export interface IGetAllQuery {
    page: number;
    limit: number;
}
export interface IGetDetailPoolParams extends IGetAllQuery {
    poolAddress: string;
    userAddress?: string;
    chainId: number;
}
export interface IGetDetailHolderDistributionParams
    extends Omit<IGetDetailPoolParams, 'userAddress'> { }

export interface IGetDetailDiscussionParams {
    chainId: string;
    address: string;
}
export interface IGetDetailDiscussionResponse {
    status: string;
    discussionId: string;
}

export interface IGetDetailPoolBackgroundParams extends IGetAllQuery {
    poolAddress: string;
    userAddress?: string;
    chainId: number;
}

export interface IGetAllTransactionsParams extends IGetAllQuery {
    poolAddress: string;
    chainId: number;
}

export interface ISocialScoreInfo {
    post: number;
    react: number;
    comment: number;
    share: number;
    view: number;
}
export interface IDetailPoolState {
    status: EActionStatus;
    pageTransaction: number;
    limitTransaction: number;
    totalTransaction: number;
    pool: IPoolDetail | undefined;
    error: FetchError | undefined;
    metaDataInfo: IMetaData;
    socialScoreInfo: ISocialScoreInfo;
    openModalSocialScore: boolean;
    transactions: Transaction[];
    // latestTimeUpdate: number;
    priceNative: number;
    dataDetailPoolFromServer: IDataDetailPoolFromServer;
    // linkDiscussionTelegram: string;
    analystData: IAnalystData;
    holderDistribution: IHolderDistribution[];

    pageHolderDistribution: number;
    limitHolderDistribution: number;
    totalHolderDistribution: number;

    pageTopReward: number;
    limitTopReward: number;
    totalTopReward: number;
}
export interface IHolderDistribution {
    pool: string;
    user: string;
    batch: string;
    isPool: boolean;
    isCreator: boolean;
}

export interface IDataDetailPoolFromServer {
    id: string | null;
    address: string | null;
    name: string | null;
    symbol: string | null;
    decimals: string | null;
    totalSupply: string | null;
    startTime: string | null;
    discussionId: string | null;

    aiAgentId: string | null;
    aiAgentName: string | null;
}
export interface IDetailPoolResponseData {
    pool: IPoolDetail | undefined;
    metaDataInfo: { id: string; metadata: IMetaData };
    socialScoreInfo: ISocialScoreInfo;
    latestTimeUpdate: number;
    priceNative: number;
    analystData: { id: string; analystData: IAnalystData };
    transactions: Transaction[];
    dataDetailPoolFromServer: IDataDetailPoolFromServer;
    totalTransaction: number;
    totalHolder: number;
    totalReferrer: number;
}

export interface IDetailPoolBackgroundResponseData {
    priceNative: number;
    analystData: { id: string; analystData: IAnalystData };
    transactions: Transaction[];
    pool: IPoolDetail | undefined;
    detailPoolData: IPoolDetail | undefined;
    dataDetailPoolFromServer: IDataDetailPoolFromServer;
    socialScoreInfo: ISocialScoreInfo;
}

export interface IPoolState extends FetchError {
    status: EActionStatus;
    statusGetPoolListBackground: EActionStatus;
    poolList: IPoolList[];
    focusPools: string[];
    filter: PoolStatus;
    orderBy: PoolStatusSortOrderBy;
    orderByDirection: PoolStatusSortFilter;
    metadata: { [key: string]: { id: string; metadata?: IMetaData } };
    analystData: { [key: string]: { id: string; analystData?: IAnalystData } };
    priceNative: number;
}

export interface IPoolListResponse {
    poolList: IPoolList[];
    focusPools: string[];
    priceNative: number;
    // metadata: { [key: string]: { id: string; metadata?: IMetaData } };
    analystData: { [key: string]: { id: string; analystData?: IAnalystData } };
}

export interface IPoolListBackgroundResponse {
    poolList: IPoolList[];
    focusPools: string[];
}

export interface IPoolListByAddressResponse {
    poolList: IPoolList[];
}

export interface IUpdateCalculatePoolParams {
    pools: IPoolList[];
    priceNative: number;
    metaDataFromStore: { [key: string]: { id: string; metadata?: IMetaData } };
}

export interface IUpdateCalculatePoolResponse {
    metadata: { [key: string]: { id: string; metadata?: IMetaData } };
    analystData: { [key: string]: { id: string; analystData?: IAnalystData } };
}

export interface IPoolList {
    id: string;
    owner: string;
    name: string;
    symbol: string;
    decimals: string;
    metadata: string;
    startTime: string;
    endTime: string;
    minDurationSell: string;
    totalSupplyToken: string;
    tokenForAirdrop: string;
    tokenForFarm: string;
    tokenForSale: string;
    tokenForLiquidity: string;
    capInETH: string;
    totalBatch: string;
    tokenPerBatch: string;
    batchAvailable: string;
    raisedInETH: string;
    soldBatch: string;
    feeForLiquidity: string;
    latestTimestampBuy: number;
    latestBuyTransactionHash: string;
    totalTransaction: number;
    status: string;
    changePrice24h: string;
    tgeTimestamp: string | null;
    buyTransactions: ITractionHome[];
    reserveETH: string;
    reserveToken: string;
}

export interface ITractionHome {
    eth: string;
    blockNumber: string;
}

export interface IGetAllPoolQuery {
    statusPool: PoolStatus;
    orderByDirection: PoolStatusSortFilter;
    orderBy: PoolStatusSortOrderBy;
    query: string;
    owner?: string;
    chainId: number;
    metaDataFromStore: { [key: string]: { id: string; metadata?: IMetaData } };
}

export interface IGetAllPoolBackgroundQuery {
    statusPool: PoolStatus;
    orderByDirection: PoolStatusSortFilter;
    orderBy: PoolStatusSortOrderBy;
    query: string;
    chainId?: number;
    owner?: string;
}

export interface IGetMetadataPoolParams {
    id: string;
    // metadataLink: string;
    chainId?: string;
}
export interface IGetAllPoolQueryByAddress {
    poolAddress: string;
    chainId?: number;
}

export interface IResponsePriceNative {
    price: number;
}

export interface IPriceNativeRequest {
    chainId: string;
}
export interface IBuyPool {
    poolAddress: string;
    numberBatch: number;
    payableAmount: number;
    maxAmountETH: number;
}

export interface ISellPool extends IBuyPool { }

export interface IDepositLottery {
    poolAddress: string;
    referrer: string;
    depositAmount: number;
}

export interface IGetTransactionByPoolAndSenderParams {
    poolAddress: string;
    senderAddress: string;
    chainId: ChainId.BARTIO;
}

export interface IActivitiesState extends FetchError {
    status: EActionStatus;
    openModalActivities: boolean;
    transactionList: Transaction[];
}

export interface ISettingSlippageState extends FetchError {
    slippage: number;
    sellSlippage: number;
    status: EActionStatus;
    openModalSlippage: boolean;
    openModalSellSippage: boolean;
}

export interface IGetUserPoolParams {
    poolAddress: string;
    userAddress: string;
    chainId: ChainId.BASE_SEPOLIA;
}

export interface IGetPoolInfoRewardParams {
    id: string;
    chainId: ChainId.BASE_SEPOLIA;
}

export interface IGetUserTopRewardByPoolParams {
    pool: string;
    chainId: ChainId.BASE_SEPOLIA;
}

export interface IVestingState extends FetchError {
    status: EActionStatus;
    openModalVesting: boolean;
}

// export interface IMessageExample {
//     user: {
//         user: string;
//         content: {
//             text: string;
//         };
//     };
//     agent: {
//         user: string;
//         content: {
//             text: string;
//         };
//     };
// }
export interface IMessageContent {
    text: string;
}

export interface IMessage {
    user: string;
    content: IMessageContent;
}

export type MessagePair = [IMessage, IMessage]; // Tuple của 2 message

export interface IStyleAiAgentCommunity {
    chat?: string[];
    post?: string[];
    all?: string[];
}

export interface ICreateAiAgent {
    name?: string;
    clients?: string[];
    plugins?: string[];
    modelProvider?: string;
    settings?: any;
    system?: string;
    bio?: string;
    lore?: string[];
    messageExamples?: MessagePair[];

    postExamples?: string[];
    adjectives?: string[];
    people?: string[];
    topics?: string[];
    style?: IStyleAiAgentCommunity;
}
export interface ICreatePoolLaunch {
    token?: string;
    name: string;
    symbol: string;
    decimal: string;
    totalSupply: string;
    bondBuyFirst?: string;
    aiAgent?: ICreateAiAgent;
    description: string;
    websiteLink: string;
    telegramLink: string;
    twitterLink: string;
    discordLink: string;
    fixedCapETH: string;
    tokenForAirdrop: string;
    tokenForFarm: string;
    tokenToMint: string;
    tokenForAddLP: string;
    totalBatch: number;
    maxRepeatPurdchase: number;
    startTime: number;
    endTime: number;
    maxDurationSell: number;
    minDurationSell: number;
    metadata: string;
}

export interface IPassDataState {
    listKeyValueBonding: KeyValueObj[];
    listKeyValueFarming: KeyValueObj[];
    valueForAddLP: KeyValueObj;
    valueForAirdrop: KeyValueObj;
    valueForFarming: KeyValueObj;
    valueForBonding: KeyValueObj;
}

export interface IReferralPool {
    refId: string; // RefId's code of referrer user
    // isLoggedIn: boolean
    // walletAddress: string;
}

export interface IRefCode {
    refCode: string;
}
export interface IRewardPoolState {
    statusGetPoolInfoReward: EActionStatus;
    statusGetUserTopRewardByPool: EActionStatus;
    pool: IPoolInfoReward;
    errorCodeGetPoolInfoReward: string;
    errorMessageGetPoolInfoReward: string;
    errorCodeGetUserTopRewardByPool: string;
    errorMessageGetUserTopRewardByPool: string;

    dataTopUserRewardByPool: IUserTopRewardByPool[];
}

export interface IUserTopRewardByPoolTransformed {
    address: string;
    bond: string;
    reward: string;
}
export interface IPoolInfoReward {
    id: string;
    tokenAddress: string;
    owner: string;
    name: string;
    tokenForAirdrop: string;
    totalReferrerBond: string;
    tokenRewardReferrerPerBond: string;
}

export interface IUserTopRewardByPool {
    id: string;
    pool: string;
    user: string;
    batch: string;
    ethBought: string;
    batchClaimed: string;
    referrerBond: string;
}
export interface IGetPoolInfoRewardResponse {
    id: string;
    tokenAddress: string;
    owner: string;
    name: string;
    tokenForAirdrop: string;
    totalReferrerBond: string;
    tokenRewardReferrerPerBond: string;
}

export interface IGetUserTopRewardByPoolResponse {
    userInPools: IUserTopRewardByPool[];
}

export interface ICreateLaunchPoolParams {
    name: string;
    symbol: string;
    decimals: string;
    totalSupply: string;
    address: string;
}
