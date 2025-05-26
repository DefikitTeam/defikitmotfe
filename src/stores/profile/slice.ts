/* eslint-disable */
import servicePortfolio from '@/src/services/external-services/backend-server/portfolio';
import servicePriceNative from '@/src/services/external-services/backend-server/price-native';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { EActionStatus, FetchError } from '../type';
import {
  IGetPortfolioParams,
  IGetRecentTxParams,
  IGetRecentTxResponse,
  IGetYourFriendListParams,
  IPortfolioResponseData,
  IPortfolioState,
  IRecentTx,
  IYourFriendList
} from './type';

const initialState: IPortfolioState = {
  status: EActionStatus.Idle,
  createdTokens: [],
  createdPools: [],
  investedPools: [],
  totalInvestedETH: '0',
  priceNative: 0,
  idChooseTokenSell: '',

  errorCode: '',
  errorMessage: '',
  openModalReferralHistory: false,
  openModalYourFriendList: false,
  yourFriendList: [],
  errorCodeYourListFriend: '',
  errorMessageYourListFriend: '',
  recentTx: [],
  pageRecentTx: 0,
  limitRecentTx: 1000
};

export const getProfile = createAsyncThunk<
  IPortfolioResponseData,
  IGetPortfolioParams,
  {
    rejectValue: FetchError;
  }
>('portfolio/getPortfolio', async (params, { rejectWithValue }) => {
  try {
    const { chainId, wallet } = params;
    const portfolio = await servicePortfolio.getProfileDAtaFromSubgraph(params);

    const priceNative = await servicePriceNative.getPriceNative(
      chainId.toString()
    );
    return {
      // status: EActionStatus.Success,
      createdTokens: portfolio.user.createdTokens,
      createdPools: portfolio.user.createdPools,
      investedPools: portfolio.user.investedPools,
      totalInvestedETH: portfolio.user.totalInvestedETH,
      priceNative: priceNative
    } as unknown as IPortfolioResponseData;
  } catch (error) {
    const err = error as AxiosError;
    const responseData: any = err.response?.data;
    return rejectWithValue({
      errorMessage: responseData?.message,
      errorCode: responseData?.code
    });
  }
});

export const getYourFriendList = createAsyncThunk<
  IYourFriendList[],
  IGetYourFriendListParams,
  {
    rejectValue: FetchError;
  }
>('portfolio/getYourFriendList', async (params, { rejectWithValue }) => {
  try {
    const yourFriendList = await servicePortfolio.getYourFriendList(
      params.wallet
    );
    return yourFriendList.referrers;
  } catch (error) {
    const err = error as AxiosError;
    const responseData: any = err.response?.data;
    return rejectWithValue({
      errorMessage: responseData?.message,
      errorCode: responseData?.code
    });
  }
});

export const getRecentTx = createAsyncThunk<
  IGetRecentTxResponse,
  IGetRecentTxParams,
  { rejectValue: FetchError }
>('portfolio/getRecentTx', async (params, { rejectWithValue }) => {
  try {
    const { page, limit, userWalletAddress, chainId } = params;
    const recentTx = await servicePortfolio.getRecentTx(
      page,
      limit,
      userWalletAddress,
      chainId
    );
    const transactionsData = await recentTx.json();
    return {
      transactionUsers: transactionsData.data.transactionUsers,
      page: page,
      limit: limit
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

export const portfolioSlice = createSlice({
  name: 'portfolioSlice',
  initialState,
  reducers: {
    setIdChooseTokenSell: (state, action: PayloadAction<{ id: string }>) => {
      state.idChooseTokenSell = action.payload.id;
    },
    setOpenModalYourFriendList: (
      state,
      action: PayloadAction<{ isOpenModalYourFriendList: boolean }>
    ) => {
      state.openModalYourFriendList = action.payload.isOpenModalYourFriendList;
    },
    setPageRecentTx: (state, action: PayloadAction<{ page: number }>) => {
      state.pageRecentTx = action.payload.page;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfile.pending, (state) => {
        state.status = EActionStatus.Pending;
      })
      .addCase(
        getProfile.fulfilled,
        (state, action: PayloadAction<IPortfolioResponseData>) => {
          state.status = EActionStatus.Succeeded;
          state.createdTokens = action.payload.createdTokens;
          state.createdPools = action.payload.createdPools;
          state.investedPools = action.payload.investedPools;
          state.totalInvestedETH = action.payload.totalInvestedETH;
          state.priceNative = action.payload.priceNative;
        }
      )
      .addCase(getProfile.rejected, (state, action) => {
        state.status = EActionStatus.Failed;
        state.errorCode = action.payload?.errorCode || '';
        state.errorMessage = action.payload?.errorMessage || '';
      })
      .addCase(getYourFriendList.fulfilled, (state, action) => {
        state.yourFriendList = action.payload;
      })
      .addCase(getYourFriendList.rejected, (state, action) => {
        state.errorCodeYourListFriend = action.payload?.errorCode || '';
        state.errorMessageYourListFriend = action.payload?.errorMessage || '';
      })
      .addCase(getRecentTx.fulfilled, (state, action) => {
        state.recentTx = action.payload.transactionUsers;
        state.pageRecentTx = action.payload.page;
        state.limitRecentTx = action.payload.limit;
      });
  }
});

export const {
  setIdChooseTokenSell,
  setOpenModalYourFriendList,
  setPageRecentTx
} = portfolioSlice.actions;
export default portfolioSlice.reducer;
