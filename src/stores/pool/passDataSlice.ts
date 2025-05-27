import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IPassDataState } from './type';
import { KeyValueObj } from '@/src/common/constant/constance';

const initialState: IPassDataState = {
  listKeyValueBonding: [],
  listKeyValueFarming: [],
  valueForAddLP: { key: '', value: '' },
  valueForAirdrop: { key: '', value: '' },
  valueForFarming: { key: '', value: '' },
  valueForBonding: { key: '', value: '' }
};

export const passDataSlice = createSlice({
  name: 'passData',
  initialState,
  reducers: {
    setListKeyValueBonding: (
      state,
      action: PayloadAction<{ isListKeyValueBonding: KeyValueObj[] }>
    ) => {
      state.listKeyValueBonding = action.payload.isListKeyValueBonding;
    },

    setListKeyValueFarming: (
      state,
      action: PayloadAction<{ isListKeyValueFarming: KeyValueObj[] }>
    ) => {
      state.listKeyValueFarming = action.payload.isListKeyValueFarming;
    },
    setKeyValueForAddLP: (
      state,
      action: PayloadAction<{ isValueForAddLP: KeyValueObj }>
    ) => {
      state.valueForAddLP = action.payload.isValueForAddLP;
    },
    setKeyValueForAirdrop: (
      state,
      action: PayloadAction<{ isValueForAirdrop: KeyValueObj }>
    ) => {
      state.valueForAirdrop = action.payload.isValueForAirdrop;
    },
    setKeyValueForFarming: (
      state,
      action: PayloadAction<{ isValueForFarming: KeyValueObj }>
    ) => {
      state.valueForFarming = action.payload.isValueForFarming;
    },
    setKeyValueForBonding: (
      state,
      action: PayloadAction<{ isValueForBonding: KeyValueObj }>
    ) => {
      state.valueForBonding = action.payload.isValueForBonding;
    },
    resetDataPassData: () => {
      return initialState;
    }
  }
});

export const {
  setListKeyValueBonding,
  setListKeyValueFarming,
  setKeyValueForAddLP,
  setKeyValueForAirdrop,
  setKeyValueForFarming,
  setKeyValueForBonding,
  resetDataPassData
} = passDataSlice.actions;
export default passDataSlice.reducer;
