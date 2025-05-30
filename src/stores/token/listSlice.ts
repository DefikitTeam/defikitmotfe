import serviceToken from '@/src/services/external-services/backend-server/token';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { EActionStatus, FetchError } from '../type';
import {
  IGetTokensByOwnerParams,
  ISettingTokenState,
  ITokenList
} from './type';

const initialState: ISettingTokenState = {
  status: EActionStatus.Idle,
  openModalCreateToken: false,
  tokenList: [],
  choicedToken: {
    id: '',
    owner: '',
    name: '',
    symbol: '',
    decimals: '',
    totalSupply: '',
    status: ''
  },
  errorCode: '',
  errorMessage: '',
  filter: {
    ownerAddress: '',
    status: '',
    chainId: 0
  }
};

export const getAllTokensByOwner = createAsyncThunk<
  ITokenList[],
  IGetTokensByOwnerParams,
  {
    rejectValue: FetchError;
  }
>('token/getAllTokensByOwner', async (params, { rejectWithValue }) => {
  try {
    const data = await serviceToken.getTokensByOwner(params);
    const tokenList = await data.json();

    return tokenList.data.tokens;
  } catch (error) {
    const err = error as AxiosError;
    const responseData: any = err.response?.data;
    return rejectWithValue({
      errorMessage: responseData?.info?.message,
      errorCode: responseData?.code
    });
  }
});

export const tokenListSlice = createSlice({
  name: 'tokenListSlice',
  initialState,
  reducers: {
    setOpenModalCreateToken: (
      state,
      action: PayloadAction<{ isOpenModalCreateToken: boolean }>
    ) => {
      state.openModalCreateToken = action.payload.isOpenModalCreateToken;
    },
    setChoicedToken: (
      state,
      action: PayloadAction<{ choicedToken: ITokenList }>
    ) => {
      state.choicedToken = action.payload.choicedToken;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(getAllTokensByOwner.pending, (state) => {
        state.status = EActionStatus.Pending;
      })
      .addCase(getAllTokensByOwner.fulfilled, (state, action) => {
        state.status = EActionStatus.Succeeded;
        state.tokenList = action.payload;
      })
      .addCase(getAllTokensByOwner.rejected, (state, action) => {
        state.status = EActionStatus.Failed;
        state.errorCode = action.payload?.errorCode || '';
        state.errorMessage = action.payload?.errorMessage || '';
      });
  }
});

export const { setOpenModalCreateToken, setChoicedToken } =
  tokenListSlice.actions;
export default tokenListSlice.reducer;
