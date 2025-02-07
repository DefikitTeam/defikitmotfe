import { IPoolList } from '../stores/pool/type';
import { ITokenList } from '../stores/token/type';

export interface IPoolDetail {
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
    reserveETH: string;
    reserveToken: string;
}

export interface ApiResponse<T = {}> {
    data: T;
}

export interface IUploadResponse {
    uploadUrls: string[];
}

export interface IResponseProfileData {
    user: {
        id: string;
        createdTokens: ITokenList[];
        createdPools: IPool[];
        investedPools: IPool[];
        totalInvestedETH: string;
    };
}

export interface IPool
    extends Omit<IPoolList, 'tgeTimestamp' | 'buyTransactions'> {}
