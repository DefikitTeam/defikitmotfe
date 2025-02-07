import { EActionStatus, FetchError } from '../type';

export interface ISettingTokenState extends FetchError {
    status: EActionStatus;
    openModalCreateToken: boolean;
    tokenList: ITokenList[];
    filter: IGetTokensByOwnerParams;
    choicedToken: ITokenList;
}

export interface ITokenList {
    id: string;
    owner: string;
    name: string;
    symbol: string;
    decimals: string;
    totalSupply: string;
    status: string;
}

export interface IGetTokensByOwnerParams {
    ownerAddress: string;
    status: string;
    chainId: number;
}

export interface ICreateToken {
    name: string;
    symbol: string;
    decimal: string;
    totalSupply: string;
}

export interface Token {
    id: string;
    owner: string;
    name: string;
    symbol: string;
    decimals: string;
    totalSupply: string;
    totalSupplyToken: string;
    tokenForAirdrop: string;
    tokenForFarm: string;
    tokenForSale: string;
    tokenForLiquidity: string;
    capInETH: string;
    totalBatch: string;
    batchAvailable: string;
    raisedInETH: string;
    soldBatch: string;
    status: string;
    feeForLiqiuidity: string;
    metadata: string;
}
