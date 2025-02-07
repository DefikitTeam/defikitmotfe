/* eslint-disable */
import servicePool from '@/src/services/external-services/backend-server/pool';
import servicePriceNative from '@/src/services/external-services/backend-server/price-native';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { EActionStatus, FetchError } from '../type';
import { updateAnalystDataWorker, updateMetaDataWorker } from './common';
import {
    IDetailPoolBackgroundResponseData,
    IDetailPoolResponseData,
    IDetailPoolState,
    IGetAllTransactionsParams,
    IGetDetailHolderDistributionParams,
    IGetDetailPoolBackgroundParams,
    IGetDetailPoolParams,
    IHolderDistribution,
    Transaction
} from './type';

const initialState: IDetailPoolState = {
    status: EActionStatus.Idle,
    pool: undefined,
    pageTransaction: 1,
    limitHolderDistribution: 10,
    totalTransaction: 0,

    limitTopReward: 10,
    pageTopReward: 1,
    totalTopReward: 0,

    totalHolderDistribution: 0,
    pageHolderDistribution: 1,
    limitTransaction: 10,

    error: undefined,

    metaDataInfo: {
        image: '',
        description: '',
        website: '',
        telegram: '',
        twitter: '',
        discord: ''
    },
    analystData: {
        apy: '',
        raisedETH: '',
        raisedUSD: '',
        startPrice: '', // by token in USD
        endPrice: '', // by token in USD
        currentPrice: '', // by token in USD
        liquidityPrice: '', // by token in USD
        startBondPerETH: '', // 1 batch by ETH
        endBondPerETH: '', // 1 batch by ETH
        listingBondPerETH: '', // 1 batch by ETH
        tokenPerBond: '' // 1 batch by token
    },
    transactions: [],
    priceNative: 0,
    linkDiscussionTelegram: '',
    holderDistribution: []
};

export const getDetailPoolBackground = createAsyncThunk<
    IDetailPoolBackgroundResponseData,
    IGetDetailPoolBackgroundParams,
    {
        rejectValue: FetchError;
    }
>('pool/getDetailPoolBackground', async (params, { rejectWithValue }) => {
    try {
        const { chainId, poolAddress, userAddress } = params;
        const poolDetail = await servicePool.getDetailPoolInfo(params);
        const poolDetailData = await poolDetail.json();
        const priceNative = await servicePriceNative.getPriceNative();
        const [transactionListResponse, analystDataExtraInfor, discussionLink] =
            await Promise.all([
                servicePool.getTransaction(
                    Number(params.page),
                    Number(params.limit),
                    poolDetailData.data.pool.id,
                    params.chainId
                ),
                updateAnalystDataWorker(
                    poolDetailData.data.pool,
                    Number(priceNative.price)
                ),
                servicePool.getDiscussionLink(chainId.toString(), poolAddress)
            ]);
        const transactionList = await transactionListResponse.json();

        return {
            pool: poolDetailData.data.pool,
            transactions: transactionList.data.transactions,
            analystData: analystDataExtraInfor,
            priceNative: priceNative.price,
            linkDiscussionTelegram: discussionLink.discussionId
        } as unknown as IDetailPoolBackgroundResponseData;
    } catch (error) {
        const err = error as AxiosError;
        const responseData: any = err.response?.data;
        return rejectWithValue({
            errorMessage: responseData?.message,
            errorCode: responseData?.code
        });
    }
});

export const getPoolDetail = createAsyncThunk<
    IDetailPoolResponseData,
    IGetDetailPoolParams,
    {
        rejectValue: FetchError;
    }
>('pool/getPoolDetail', async (params, { rejectWithValue }) => {
    try {
        const { chainId, poolAddress, userAddress } = params;
        const poolDetail = await servicePool.getDetailPoolInfo(params);
        const poolDetailData = await poolDetail.json();
        const priceNative = await servicePriceNative.getPriceNative();

        const [
            metaDataExtraInfor,
            transactionListResponse,
            analystDataExtraInfor,
            discussionLink
        ] = await Promise.all([
            updateMetaDataWorker(
                poolDetailData.data.pool.id,
                poolDetailData.data.pool.metadata
            ),
            servicePool.getTransaction(
                Number(params.page),
                Number(params.limit),
                poolDetailData.data.pool.id,
                params.chainId
            ),
            updateAnalystDataWorker(
                poolDetailData.data.pool,
                Number(priceNative.price)
            ),
            servicePool.getDiscussionLink(chainId.toString(), poolAddress)
        ]);
        const transactionList = await transactionListResponse.json();
        console.log('-------------analystDataExtraInfor-------', analystDataExtraInfor)
        return {
            pool: poolDetailData.data.pool,
            metaDataInfo: metaDataExtraInfor,
            transactions: transactionList.data.transactions,
            analystData: analystDataExtraInfor,
            priceNative: priceNative.price,
            linkDiscussionTelegram: discussionLink.discussionId
        } as unknown as IDetailPoolResponseData;
    } catch (error) {
        const err = error as AxiosError;
        const responseData: any = err.response?.data;
        return rejectWithValue({
            errorMessage: responseData?.message,
            errorCode: responseData?.code
        });
    }
});

export const getTransactions = createAsyncThunk<
    Transaction[],
    IGetAllTransactionsParams,
    {
        rejectValue: FetchError;
    }
>('pool/getTransactions', async (params, { rejectWithValue }) => {
    try {
        const { poolAddress, chainId, page, limit } = params;
        const transactions = await servicePool.getTransaction(
            page,
            limit,
            poolAddress,
            chainId
        );
        const transactionsData = await transactions.json();
        return transactionsData.data.transactions;
    } catch (error) {
        const err = error as AxiosError;
        const responseData: any = err.response?.data;
        return rejectWithValue({
            errorMessage: responseData?.message,
            errorCode: responseData?.code
        });
    }
});

export const getHolderDistribution = createAsyncThunk<
    IHolderDistribution[],
    IGetDetailHolderDistributionParams,
    {
        rejectValue: FetchError;
    }
>('pool/getHolderDistribution', async (params, { rejectWithValue }) => {
    try {
        const holderDistribution =
            await servicePool.getHolderDistribution(params);
        const holderDistributionData = await holderDistribution.json();
        return holderDistributionData.data.holders;
    } catch (error) {
        const err = error as AxiosError;
        const responseData: any = err.response?.data;
        return rejectWithValue({
            errorMessage: responseData?.message,
            errorCode: responseData?.code
        });
    }
});

export const poolDetailSlice = createSlice({
    name: 'poolDetailSlice',
    initialState,
    reducers: {
        setPageTransaction: (
            state,
            action: PayloadAction<{ isPageTransaction: number }>
        ) => {
            state.pageTransaction = action.payload.isPageTransaction;
        },
        setPageHolderDistribution: (
            state,
            action: PayloadAction<{ isPageHolderDistribution: number }>
        ) => {
            state.pageHolderDistribution =
                action.payload.isPageHolderDistribution;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getPoolDetail.pending, (state) => {
            state.status = EActionStatus.Pending;
        });
        builder.addCase(
            getPoolDetail.fulfilled,
            (state, action: PayloadAction<IDetailPoolResponseData>) => {
                state.status = EActionStatus.Succeeded;
                state.linkDiscussionTelegram =
                    action.payload.linkDiscussionTelegram;
                state.transactions = action.payload.transactions;
                state.pool = action.payload.pool;
                state.metaDataInfo = action.payload?.metaDataInfo?.metadata;
                state.analystData = action.payload.analystData.analystData;
                state.priceNative = action.payload.priceNative;
                state.totalTransaction = action.payload.totalTransaction;
                state.totalHolderDistribution = action.payload.totalHolder;
                state.totalTopReward = action.payload.totalReferrer;
            }
        );
        builder
            .addCase(getPoolDetail.rejected, (state, action) => {
                state.status = EActionStatus.Failed;
                state.error = action.payload;
            })
            .addCase(
                getDetailPoolBackground.fulfilled,
                (
                    state,
                    action: PayloadAction<IDetailPoolBackgroundResponseData>
                ) => {
                    state.status = EActionStatus.Succeeded;
                    state.linkDiscussionTelegram =
                        action.payload.linkDiscussionTelegram;
                    state.transactions = action.payload.transactions;
                    state.pool = action.payload.pool;
                    state.analystData = action.payload.analystData.analystData;
                    state.priceNative = action.payload.priceNative;
                    state.totalTransaction = action.payload.transactions.length;
                }
            );
        builder
            .addCase(getDetailPoolBackground.rejected, (state, action) => {
                state.status = EActionStatus.Failed;
                state.error = action.payload;
            })
            .addCase(getHolderDistribution.fulfilled, (state, action) => {
                state.holderDistribution = action.payload;
            })
            .addCase(getHolderDistribution.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(getTransactions.fulfilled, (state, action) => {
                state.transactions = action.payload;
            })
            .addCase(getTransactions.rejected, (state, action) => {
                state.error = action.payload;
            });
    }
});

export const { setPageHolderDistribution, setPageTransaction } =
    poolDetailSlice.actions;
export default poolDetailSlice.reducer;
