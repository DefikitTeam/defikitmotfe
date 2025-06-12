/* eslint-disable */
import { useCallback } from 'react';
import { RootState, useAppDispatch, useAppSelector } from '../../';
import { getPoolInfoReward, getTopUserRewardByPool } from '../rewardSlice';
import {
  IGetPoolInfoRewardParams,
  IGetUserTopRewardByPoolParams,
  IRewardPoolState
} from '../type';

type RewardType = {
  rewardState: IRewardPoolState;
  getPoolInfoRewardAction: (data: IGetPoolInfoRewardParams) => void;
  getTopUserRewardByPoolAction: (data: IGetUserTopRewardByPoolParams) => void;
};

export const useReward = (): RewardType => {
  const dispatch = useAppDispatch();
  const rewardState = useAppSelector((state: RootState) => state.reward);
  const getPoolInfoRewardAction = useCallback(
    (data: IGetPoolInfoRewardParams) => {
      dispatch(getPoolInfoReward(data));
    },
    [dispatch]
  );

  const getTopUserRewardByPoolAction = useCallback(
    (data: IGetUserTopRewardByPoolParams) => {
      dispatch(getTopUserRewardByPool(data));
    },
    [dispatch]
  );

  return {
    rewardState,
    getPoolInfoRewardAction,
    getTopUserRewardByPoolAction
  };
};
