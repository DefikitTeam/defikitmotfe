/* eslint-disable */
import { useCallback } from 'react';
import { RootState, useAppDispatch, useAppSelector } from '../../';
import { setIsOpenModalVesting } from '../vestingSlice';
import {
  IVestingState
} from '../type';

type VestingType = {
  vestingState: IVestingState;
  setOpenModalVesting: (isOpenModalVesting: boolean) => void;
};

export const useVesting = (): VestingType => {
  const dispatch = useAppDispatch();
  const vestingState = useAppSelector((state: RootState) => state.vesting);

  const setOpenModalVesting = useCallback(
    (isOpenModalVesting: boolean) => {
      dispatch(setIsOpenModalVesting({ isOpenModalVesting }));
    },
    [dispatch]
  );

  return {
    vestingState,
    setOpenModalVesting
  };
};

