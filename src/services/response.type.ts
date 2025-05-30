import { IPoolList } from '../stores/pool/type';
import { ITokenList } from '../stores/token/type';

export interface IGetAllDataResponse<T> {
  items: T[];
  meta: IMeta;
}
export interface IMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

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
  trustScore: number;
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

export interface IGenerateDataAiAgentResponse {
  nameAgent?: string;
  clientsAgent?: string[];
  plugins?: string[];
  modelProvider?: string;
  settings?: any;
  system?: string;
  bio?: string;
  lore?: string[];
  messageExamples?: string[];
  postExamples?: string[];
  adjectives?: string[];
  people?: string[];
  topics?: string[];
  style?: any;
}
export interface IPool
  extends Omit<IPoolList, 'tgeTimestamp' | 'buyTransactions'> { }

export interface IGetAllInviteListReferResponse {
  totalRecords: number;
  totalPage: number;
  currentPage: number;
  perPage: number;
  data: any[];
}

export interface IVerifyTwitterShareResponse {
  data: {
    success: boolean;
    verified: boolean;
    message: string;
    tweetId: string;
    tweetUrl: string;
  };
}
