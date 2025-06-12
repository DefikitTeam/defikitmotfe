/* eslint-disable */
import { KeyValueObj } from '@/src/common/constant/constance';
import { useCallback } from 'react';
import { RootState, useAppDispatch, useAppSelector } from '../../';
import {
  resetDataPassData,
  setKeyValueForAddLP,
  setKeyValueForAirdrop,
  setKeyValueForBonding,
  setKeyValueForFarming,
  setListKeyValueBonding,
  setListKeyValueFarming
} from '../passDataSlice';
import { IPassDataState } from '../type';

type passDataType = {
  passDataState: IPassDataState;
  setListDataBonding: (data: KeyValueObj[]) => void;
  setListDataFarming: (data: KeyValueObj[]) => void;
  setValueForAddLP: (data: KeyValueObj) => void;
  setValueForAirdrop: (data: KeyValueObj) => void;
  setValueForFarming: (data: KeyValueObj) => void;
  setValueForBonding: (data: KeyValueObj) => void;
  resetPassData: () => void;
};

export const usePassData = (): passDataType => {
  const dispatch = useAppDispatch();
  const passDataState = useAppSelector((state: RootState) => state.passData);
  const setListDataBonding = useCallback(
    (data: KeyValueObj[]) => {
      dispatch(setListKeyValueBonding({ isListKeyValueBonding: data }));
    },
    [dispatch]
  );

  const setListDataFarming = useCallback(
    (data: KeyValueObj[]) => {
      dispatch(setListKeyValueFarming({ isListKeyValueFarming: data }));
    },
    [dispatch]
  );
  const setValueForAddLP = useCallback(
    (data: KeyValueObj) => {
      dispatch(setKeyValueForAddLP({ isValueForAddLP: data }));
    },
    [dispatch]
  );

  const setValueForAirdrop = useCallback(
    (data: KeyValueObj) => {
      dispatch(setKeyValueForAirdrop({ isValueForAirdrop: data }));
    },
    [dispatch]
  );

  const setValueForFarming = useCallback(
    (data: KeyValueObj) => {
      dispatch(setKeyValueForFarming({ isValueForFarming: data }));
    },
    [dispatch]
  );
  const setValueForBonding = useCallback(
    (data: KeyValueObj) => {
      dispatch(setKeyValueForBonding({ isValueForBonding: data }));
    },
    [dispatch]
  );

  const resetPassData = useCallback(() => {
    dispatch(resetDataPassData());
  }, [dispatch]);

  return {
    passDataState,
    setListDataBonding,
    setListDataFarming,
    setValueForAddLP,
    setValueForAirdrop,
    setValueForFarming,
    setValueForBonding,
    resetPassData
  };
};
