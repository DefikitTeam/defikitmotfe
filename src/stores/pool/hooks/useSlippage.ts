/* eslint-disable */
import { useCallback } from 'react';
import { RootState, useAppDispatch, useAppSelector } from '../../';
import {
  setOpenModalSellSlippage,
  setOpenModalSlippage,
  setValueSellSlippage,
  setValueSlippage
} from '../slippageSlice';
import {
  ISettingSlippageState
} from '../type';

type SlippageType = {
  slippageState: ISettingSlippageState;
  setSlippage: (slippage: number) => void;
  setSellSlippage: (sellSlippage: number) => void;
  setOpenModalSettingSlippage: (isOpenModalSlippage: boolean) => void;
  setOpenModalSellSettingSlippage: (isOpenModalSellSlippage: boolean) => void;
};

export const useSlippage = (): SlippageType => {
  const dispatch = useAppDispatch();
  const slippageState = useAppSelector((state: RootState) => state.slippage);

  const setSlippage = useCallback(
    (slippage: number) => {
      dispatch(setValueSlippage({ slippage }));
    },
    [dispatch]
  );
  const setSellSlippage = useCallback(
    (sellSlippage: number) => {
      dispatch(setValueSellSlippage({ sellSlippage }));
    },
    [dispatch]
  );
  const setOpenModalSettingSlippage = useCallback(
    (isOpenModalSlippage: boolean) => {
      dispatch(setOpenModalSlippage({ isOpenModalSlippage }));
    },
    [dispatch]
  );
  const setOpenModalSellSettingSlippage = useCallback(
    (isOpenModalSellSlippage: boolean) => {
      dispatch(setOpenModalSellSlippage({ isOpenModalSellSlippage }));
    },
    [dispatch]
  );

  return {
    slippageState,
    setSlippage,
    setSellSlippage,
    setOpenModalSettingSlippage,
    setOpenModalSellSettingSlippage
  };
};

