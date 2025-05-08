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
    socialScoreInfo: {
        post: 0,
        react: 0,
        comment: 0,
        share: 0,
        view: 0
    },
    openModalSocialScore: false,
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
    dataDetailPoolFromServer: {
        id: '',
        address: '',
        name: '',
        symbol: '',
        decimals: '',
        totalSupply: '',
        startTime: '',
        discussionId: '',
        aiAgentId: '',
        aiAgentName: '',
        isTwitterVerified: false,
        verifiedTweetId: '',
        verifiedTweetUrl: ''
    },
    // linkDiscussionTelegram: '',
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
        const priceNative = await servicePriceNative.getPriceNative(
            chainId.toString()
        );
        const [
            transactionListResponse,
            analystDataExtraInfor,
            detailPoolData,
            socialScoreInfo
        ] = await Promise.all([
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
            servicePool.getDetailPoolDataFromServer(
                chainId.toString(),
                poolAddress
            ),
            servicePool.getSocialScoreInfo(chainId.toString(), poolAddress)
        ]);

        const transactionList = await transactionListResponse.json();

        return {
            pool: poolDetailData.data.pool,
            transactions: transactionList.data.transactions,
            analystData: analystDataExtraInfor,
            priceNative: priceNative.price,
            dataDetailPoolFromServer: detailPoolData.data,
            // linkDiscussionTelegram: detailPoolData.data.pool.discussionId,
            socialScoreInfo: socialScoreInfo.data
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
        const priceNative = await servicePriceNative.getPriceNative(
            chainId.toString()
        );

        const [
            metaDataExtraInfor,
            transactionListResponse,
            analystDataExtraInfor,
            detailPoolData,
            socialScoreInfo
        ] = await Promise.all([
            updateMetaDataWorker(
                poolDetailData.data.pool.id,
                // poolDetailData.data.pool.metadata
                chainId.toString()
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
            servicePool.getDetailPoolDataFromServer(
                chainId.toString(),
                poolAddress
            ),
            servicePool.getSocialScoreInfo(chainId.toString(), poolAddress)
        ]);

        const transactionList = await transactionListResponse.json();

        return {
            pool: poolDetailData.data.pool,
            metaDataInfo: metaDataExtraInfor,
            transactions: transactionList.data.transactions,
            analystData: analystDataExtraInfor,
            priceNative: priceNative.price,
            dataDetailPoolFromServer: detailPoolData.data,
            socialScoreInfo: socialScoreInfo.data
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
        },
        setOpenModalSocialScore: (
            state,
            action: PayloadAction<{ isOpenModalSocialScore: boolean }>
        ) => {
            state.openModalSocialScore = action.payload.isOpenModalSocialScore;
        },
        resetPoolDetail: () => {
            return initialState;
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
                state.dataDetailPoolFromServer =
                    action.payload.dataDetailPoolFromServer;

                state.transactions = action.payload.transactions;
                state.pool = action.payload.pool;
                state.metaDataInfo = action.payload?.metaDataInfo?.metadata;
                state.analystData = action.payload.analystData.analystData;
                state.priceNative = action.payload.priceNative;
                state.totalTransaction = action.payload.totalTransaction;
                state.totalHolderDistribution = action.payload.totalHolder;
                state.totalTopReward = action.payload.totalReferrer;
                state.socialScoreInfo = action.payload.socialScoreInfo;
                state.dataDetailPoolFromServer =
                    action.payload.dataDetailPoolFromServer;
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
                    state.dataDetailPoolFromServer =
                        action.payload.dataDetailPoolFromServer;
                    state.transactions = action.payload.transactions;
                    state.pool = action.payload.pool;
                    state.analystData = action.payload.analystData.analystData;
                    state.priceNative = action.payload.priceNative;
                    state.totalTransaction = action.payload.transactions.length;
                    state.socialScoreInfo = action.payload.socialScoreInfo;
                    state.dataDetailPoolFromServer =
                        action.payload.dataDetailPoolFromServer;
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

export const {
    setPageHolderDistribution,
    setPageTransaction,
    setOpenModalSocialScore,
    resetPoolDetail
} = poolDetailSlice.actions;
export default poolDetailSlice.reducer;
