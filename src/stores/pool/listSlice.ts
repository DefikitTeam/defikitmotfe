/* eslint-disable */
import {
    ChainId,
    PoolStatus,
    PoolStatusSortFilter,
    PoolStatusSortOrderBy
} from '@/src/common/constant/constance';
import servicePool from '@/src/services/external-services/backend-server/pool';
import servicePriceNative from '@/src/services/external-services/backend-server/price-native';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import BigNumber from 'bignumber.js';
import { EActionStatus, FetchError } from '../type';
import { reCalculatePool } from './common';
import {
    IAnalystData,
    IGetAllPoolBackgroundQuery,
    IGetAllPoolQuery,
    IGetAllPoolQueryByAddress,
    IMetaData,
    IPoolListBackgroundResponse,
    IPoolListByAddressResponse,
    IPoolListResponse,
    IPoolState,
    IResponsePriceNative,
    IUpdateCalculatePoolParams,
    IUpdateCalculatePoolResponse
} from './type';

const initialState: IPoolState = {
    status: EActionStatus.Idle,
    poolList: [],
    errorCode: '',
    errorMessage: '',
    filter: PoolStatus.ACTIVE,
    // orderBy: PoolStatusSortOrderBy.LATEST_TIMESTAMP_BUY,
    // orderByDirection: PoolStatusSortFilter.DESC,
    metadata: {},
    analystData: {},
    priceNative: 0
};

export const getAllPoolByType = createAsyncThunk<
    IPoolListResponse,
    IGetAllPoolQuery,
    {
        rejectValue: FetchError;
    }
>('pool/getAllPoolByType', async (params, { rejectWithValue }) => {
    try {
        const data = await servicePool.getAllPoolByType(params);
        const listPool = await data.json();
        const priceNative = await servicePriceNative.getPriceNative();
        const extraData = await reCalculatePool(
            listPool.data.pools,
            priceNative.price,
            params.metaDataFromStore
        );
        return {
            priceNative: priceNative.price,
            poolList: listPool.data.pools,
            analystData: extraData.analystDataExtraInfo,
            metadata: extraData.metaDataExtraInfo
        };
    } catch (error) {
        const err = error as AxiosError;
        const responseData: any = err.response?.data;
        return rejectWithValue({
            errorMessage: responseData?.message,
            errorCode: responseData?.code
        });
    }
});

export const getAllPoolBackgroundByType = createAsyncThunk<
    IPoolListBackgroundResponse,
    IGetAllPoolBackgroundQuery,
    {
        rejectValue: FetchError;
    }
>('pool/getAllPoolBackgroundByType', async (params, { rejectWithValue }) => {
    try {
        const data = await servicePool.getAllPoolByType(params);
        const listPool = await data.json();
        return {
            poolList: listPool.data.pools
        };
    } catch (error) {
        const err = error as AxiosError;
        const responseData: any = err.response?.data;
        return rejectWithValue({
            errorMessage: responseData?.message,
            errorCode: responseData?.code
        });
    }
});

export const updateCalculatePool = createAsyncThunk<
    IUpdateCalculatePoolResponse,
    IUpdateCalculatePoolParams,
    {
        rejectValue: FetchError;
    }
>('pool/updateCalculatePool', async (params, { rejectWithValue }) => {
    try {
        const extraData = await reCalculatePool(
            params.pools,
            params.priceNative,
            params.metaDataFromStore
        );
        return {
            analystData: extraData.analystDataExtraInfo,
            metadata: extraData.metaDataExtraInfo
        };
    } catch (error) {
        const err = error as AxiosError;
        const responseData: any = err.response?.data;
        return rejectWithValue({
            errorMessage: responseData?.message,
            errorCode: responseData?.code
        });
    }
});

interface ISetFilterResponse {
    filter: PoolStatus;
}
export const setFilter = createAsyncThunk<
    ISetFilterResponse,
    PoolStatus,
    {
        rejectValue: FetchError;
    }
>('pool/setFilter', async (params, { rejectWithValue }) => {
    try {
        return {
            filter: params
        };
    } catch (error) {
        const err = error as AxiosError;
        const responseData: any = err.response?.data;
        return rejectWithValue({
            errorMessage: responseData?.message,
            errorCode: responseData?.code
        });
    }
});

interface ISetOrderByDirectionFilterResponse {
    filterOrderByDirection: PoolStatusSortFilter;
}

export const setOrderByDirectionFilter = createAsyncThunk<
    ISetOrderByDirectionFilterResponse,
    PoolStatusSortFilter,
    {
        rejectValue: FetchError;
    }
>('pool/setOrderByDirectionFilter', async (params, { rejectWithValue }) => {
    try {
        return {
            filterOrderByDirection: params
        };
    } catch (error) {
        const err = error as AxiosError;
        const responseData: any = err.response?.data;
        return rejectWithValue({
            errorMessage: responseData?.message,
            errorCode: responseData?.code
        });
    }
});

interface ISetOrderByResponse {
    filterOrderBy: PoolStatusSortOrderBy;
}

export const setOrderByFilter = createAsyncThunk<
    ISetOrderByResponse,
    PoolStatusSortOrderBy,
    {
        rejectValue: FetchError;
    }
>('pool/setOrderByFilter', async (params, { rejectWithValue }) => {
    try {
        return {
            filterOrderBy: params
        };
    } catch (error) {
        const err = error as AxiosError;
        const responseData: any = err.response?.data;
        return rejectWithValue({
            errorMessage: responseData?.message,
            errorCode: responseData?.code
        });
    }
});

export const fetchPriceNative = createAsyncThunk<
    IResponsePriceNative,
    void,
    {
        rejectValue: FetchError;
    }
>('pool/fetchPriceNative', async (_, { rejectWithValue }) => {
    try {
        const response = await servicePriceNative.getPriceNative();

        return {
            price: new BigNumber(response.price).toNumber()
        };
    } catch (error) {
        const err = error as AxiosError;
        const responseData: any = err.response?.data;
        return rejectWithValue({
            errorMessage: responseData?.message,
            errorCode: responseData?.code
        });
    }
});

export const poolListSlice = createSlice({
    name: 'poolListSlice',
    initialState,
    reducers: {
        updateMetaData: (
            state: IPoolState,
            action: PayloadAction<{ id: string; metadata: IMetaData }>
        ) => {
            state.metadata.id.metadata = action.payload.metadata;
        },
        updateAnalystData: (
            state: IPoolState,
            action: PayloadAction<{ id: string; analystData: IAnalystData }>
        ) => {
            state.analystData.id.analystData = action.payload.analystData;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPriceNative.pending, (state) => {
                state.status = EActionStatus.Pending;
            })
            .addCase(setFilter.fulfilled, (state, action) => {
                state.status = EActionStatus.Succeeded;
                state.filter = action.payload.filter;
            })
            .addCase(fetchPriceNative.fulfilled, (state, action) => {
                state.status = EActionStatus.Succeeded;
                state.priceNative = action.payload.price;
            })
            .addCase(fetchPriceNative.rejected, (state, action) => {
                state.status = EActionStatus.Failed;
                state.errorCode = action.payload?.errorCode || '';
                state.errorMessage = action.payload?.errorMessage || '';
            })
            .addCase(getAllPoolByType.pending, (state) => {
                state.status = EActionStatus.Pending;
            })
            .addCase(getAllPoolByType.fulfilled, (state, action) => {
                state.status = EActionStatus.Succeeded;
                state.priceNative = action.payload.priceNative;
                state.poolList = action.payload.poolList;
                state.analystData = action.payload.analystData;
                state.metadata = action.payload.metadata;
            })
            .addCase(getAllPoolBackgroundByType.fulfilled, (state, action) => {
                state.poolList = action.payload.poolList;
                state.status = EActionStatus.Succeeded;
            })
            .addCase(updateCalculatePool.fulfilled, (state, action) => {
                state.analystData = action.payload.analystData;
                state.metadata = action.payload.metadata;
            })
            .addCase(getAllPoolByType.rejected, (state, action) => {
                state.status = EActionStatus.Failed;
                state.errorCode = action.payload?.errorCode || '';
                state.errorMessage = action.payload?.errorMessage || '';
            });
        // .addCase(setOrderByDirectionFilter.fulfilled, (state, action) => {
        //     state.status = EActionStatus.Succeeded;
        //     state.orderByDirection = action.payload.filterOrderByDirection;
        // })
        // .addCase(setOrderByFilter.fulfilled, (state, action) => {
        //     state.status = EActionStatus.Succeeded;
        //     console.log('action.payload.filterOrderBy------',action.payload.filterOrderBy )
        //     state.orderBy = action.payload.filterOrderBy;
        // });
    }
});

export default poolListSlice.reducer;
