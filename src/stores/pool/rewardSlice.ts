import servicePool from '@/src/services/external-services/backend-server/pool';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { RootState } from '..';
import { EActionStatus, FetchError } from '../type';
import {
    IGetPoolInfoRewardParams,
    IGetPoolInfoRewardResponse,
    IGetUserTopRewardByPoolParams,
    IGetUserTopRewardByPoolResponse,
    IPoolInfoReward,
    IRewardPoolState
} from './type';

const initialState: IRewardPoolState = {
    statusGetPoolInfoReward: EActionStatus.Idle,
    statusGetUserTopRewardByPool: EActionStatus.Idle,
    errorCodeGetPoolInfoReward: '',
    errorMessageGetPoolInfoReward: '',

    errorCodeGetUserTopRewardByPool: '',
    errorMessageGetUserTopRewardByPool: '',
    pool: {
        id: '',
        tokenAddress: '',
        owner: '',
        name: '',
        tokenForAirdrop: '',
        totalReferrerBond: '',
        tokenRewardReferrerPerBond: ''
    },
    dataTopUserRewardByPool: []
};

export const getPoolInfoReward = createAsyncThunk<
    IGetPoolInfoRewardResponse,
    IGetPoolInfoRewardParams,
    {
        rejectValue: FetchError;
        state: RootState;
    }
>('pool/getPoolInfoReward', async (params, { rejectWithValue }) => {
    try {
        const data = await servicePool.getPoolInfoReward(params);
        const responseData = await data.json();
        return responseData.data.pool;
    } catch (error) {
        const err = error as AxiosError;
        const responseData: any = err.response?.data;
        return rejectWithValue({
            errorMessage: responseData?.message,
            errorCode: responseData?.code
        });
    }
});

export const getTopUserRewardByPool = createAsyncThunk<
    IGetUserTopRewardByPoolResponse,
    IGetUserTopRewardByPoolParams,
    {
        rejectValue: FetchError;
    }
>('pool/getTopUserRewardByPool', async (params, { rejectWithValue }) => {
    try {
        const data = await servicePool.getUserTopRewardByPool(params);
        const responseData = await data.json();
        return responseData.data;
    } catch (error) {
        const err = error as AxiosError;
        const responseData: any = err.response?.data;
        return rejectWithValue({
            errorMessage: responseData?.message,
            errorCode: responseData?.code
        });
    }
});

export const rewardSlice = createSlice({
    name: 'rewardSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getPoolInfoReward.pending, (state) => {
                state.statusGetPoolInfoReward = EActionStatus.Pending;
            })
            .addCase(
                getPoolInfoReward.fulfilled,
                (state, action: PayloadAction<IPoolInfoReward>) => {
                    state.statusGetPoolInfoReward = EActionStatus.Succeeded;
                    state.pool = action.payload;
                }
            )
            .addCase(getPoolInfoReward.rejected, (state, action) => {
                state.statusGetPoolInfoReward = EActionStatus.Failed;
                state.errorCodeGetPoolInfoReward =
                    action.payload?.errorCode || '';
                state.errorMessageGetPoolInfoReward =
                    action.payload?.errorMessage || '';
            })
            .addCase(getTopUserRewardByPool.pending, (state) => {
                state.statusGetUserTopRewardByPool = EActionStatus.Pending;
            })
            .addCase(getTopUserRewardByPool.fulfilled, (state, action) => {
                state.statusGetUserTopRewardByPool = EActionStatus.Succeeded;
                state.dataTopUserRewardByPool = action.payload.userInPools;
            })
            .addCase(getTopUserRewardByPool.rejected, (state, action) => {
                state.statusGetUserTopRewardByPool = EActionStatus.Failed;
                state.errorCodeGetUserTopRewardByPool =
                    action.payload?.errorCode || '';
                state.errorMessageGetUserTopRewardByPool =
                    action.payload?.errorMessage || '';
            });
    }
});

export default rewardSlice.reducer;
