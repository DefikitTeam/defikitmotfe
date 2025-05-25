/* eslint-disable */
import {
    KeyValueObj,
    PoolStatus,
    PoolStatusSortFilter,
    PoolStatusSortOrderBy
} from '@/src/common/constant/constance';
import { useCallback } from 'react';
import { RootState, useAppDispatch, useAppSelector } from '..';
import {
    getAllTransactionByPoolAndSernder,
    setOpenModalActivities
} from './activitiSlice';
import {
    resetBuyPoolInformation,
    updateBuyPoolInformation
} from './buyPoolSlice';
import {
    resetAiAgent,
    resetCreatePoolLaunchData,
    updateCreatePoolLaunchInformation
} from './createSlice';
import {
    getDetailPoolBackground,
    getHolderDistribution,
    getPoolDetail,
    getTransactions,
    resetPoolDetail,
    setOpenModalSocialScore,
    setPageHolderDistribution,
    setPageTransaction
} from './detailSlice';
import {
    getAllPoolBackgroundByType,
    getAllPoolByType,
    getPoolMetadata,
    setFilter,
    setOrderByDirectionFilter,
    setOrderByFilter,
    updateCalculatePool
} from './listSlice';
import {
    resetDataPassData,
    setKeyValueForAddLP,
    setKeyValueForAirdrop,
    setKeyValueForBonding,
    setKeyValueForFarming,
    setListKeyValueBonding,
    setListKeyValueFarming
} from './passDataSlice';
import { getPoolInfoReward, getTopUserRewardByPool } from './rewardSlice';
import {
    resetSellPoolInformation,
    updateSellPoolInformation
} from './sellPoolSlice';
import {
    setOpenModalSellSlippage,
    setOpenModalSlippage,
    setValueSellSlippage,
    setValueSlippage
} from './slippageSlice';
import {
    IActivitiesState,
    IBuyPool,
    ICreateAiAgent,
    ICreatePoolLaunch,
    IDepositLottery,
    IDetailPoolState,
    IGetAllPoolBackgroundQuery,
    IGetAllPoolQuery,
    IGetAllTransactionsParams,
    IGetDetailHolderDistributionParams,
    IGetDetailPoolBackgroundParams,
    IGetDetailPoolParams,
    IGetMetadataPoolParams,
    IGetPoolInfoRewardParams,
    IGetTransactionByPoolAndSenderParams,
    IGetTrustScoreHistoryPoolParams,
    IGetUserTopRewardByPoolParams,
    IPassDataState,
    IPoolState,
    IRewardPoolState,
    ISellPool,
    ISettingSlippageState,
    ITrustScoreHistoryPoolState,
    IUpdateCalculatePoolParams,
    IVestingState
} from './type';
import { setIsOpenModalVesting } from './vestingSlice';
import {
    resetDepositLotteryInformation,
    updateDepositLotteryInformation
} from './depositLotterySlice';
import {
    resetCreateAiAgentInformation,
    setOpenModalCreateAiAgent,
    updateCreateAiAgentInformation
} from './createAiAgent';
import {
    getTrustScoreHistoryPool,
    resetTrustScoreHistoryPool,
    setOpenModalHistoryPool
} from './trustScoreHistoryPoolSlice';
export function usePoolDetail(): [
    {
        poolStateDetail: IDetailPoolState;
    },
    // eslint-disable-next-line
    (data: IGetDetailPoolParams) => void,
    // eslint-disable-next-line
    (data: IGetDetailPoolBackgroundParams) => void,
    // eslint-disable-next-line
    (data: IGetDetailHolderDistributionParams) => void,
    // eslint-disable-next-line
    setPageTransactionAction: (isPageTransaction: number) => void,
    // eslint-disable-next-line
    setPageHolderDistributionAction: (isPageHolderDistribution: number) => void,
    // eslint-disable-next-line
    (data: IGetAllTransactionsParams) => void,

    // eslint-disable-next-line
    setOpenModalSocialScore: (isOpenModalSocialScore: boolean) => void,
    // eslint-disable-next-line
    resetPoolDetailAction: () => void
] {
    const dispatch = useAppDispatch();

    const poolStateDetail = useAppSelector(
        (state: RootState) => state.poolDetail
    );

    const fetchPoolDetail = useCallback(
        (data: IGetDetailPoolParams) => {
            dispatch(getPoolDetail(data));
        },
        [dispatch]
    );
    const fetchPoolDetailBackground = useCallback(
        (data: IGetDetailPoolBackgroundParams) => {
            dispatch(getDetailPoolBackground(data));
        },
        [dispatch]
    );
    const fetchHolderDistribution = useCallback(
        (data: IGetDetailHolderDistributionParams) => {
            dispatch(getHolderDistribution(data));
        },
        [dispatch]
    );

    const setPageTransactionAction = useCallback(
        (isPageTransaction: number) => {
            dispatch(setPageTransaction({ isPageTransaction }));
        },
        [dispatch]
    );

    const setPageHolderDistributionAction = useCallback(
        (isPageHolderDistribution: number) => {
            dispatch(setPageHolderDistribution({ isPageHolderDistribution }));
        },
        [dispatch]
    );
    const fetchTransactions = useCallback(
        (data: IGetAllTransactionsParams) => {
            dispatch(getTransactions(data));
        },
        [dispatch]
    );

    const setOpenModalSocialScoreAction = useCallback(
        (isOpenModalSocialScore: boolean) => {
            dispatch(setOpenModalSocialScore({ isOpenModalSocialScore }));
        },
        [dispatch]
    );

    const resetPoolDetailAction = useCallback(() => {
        dispatch(resetPoolDetail());
    }, [dispatch]);

    // const fetchPoolDetailFromServerAction = useCallback(() => {
    //     dispatch(fetchPoolDetailFromServer());
    // }, [dispatch]);

    return [
        {
            poolStateDetail
        },
        fetchPoolDetail,
        fetchPoolDetailBackground,
        fetchHolderDistribution,
        setPageTransactionAction,
        setPageHolderDistributionAction,
        fetchTransactions,
        setOpenModalSocialScoreAction,
        resetPoolDetailAction
        // fetchPoolDetailFromServerAction
    ];
}

type ListPooltype = {
    poolStateList: IPoolState;

    getListPoolAction: (data: IGetAllPoolQuery) => void;
    getListPoolBackgroundAction: (data: IGetAllPoolBackgroundQuery) => void;

    updateCalculatePoolAction: (data: IUpdateCalculatePoolParams) => void;
    getMetadataPoolVisibleAction: (data: IGetMetadataPoolParams) => void;

    setFilterAction: (data: PoolStatus) => void;

    setOrderByDirectionAction: (data: PoolStatusSortFilter) => void;
    setOrderByAction: (data: PoolStatusSortOrderBy) => void;
};

export const useListPool = (): ListPooltype => {
    const dispatch = useAppDispatch();
    const poolStateList = useAppSelector((state: RootState) => state.poolList);

    const getListPoolAction = useCallback(
        (data: IGetAllPoolQuery) => {
            dispatch(getAllPoolByType(data));
        },
        [dispatch]
    );

    const getListPoolBackgroundAction = useCallback(
        (data: IGetAllPoolBackgroundQuery) => {
            dispatch(getAllPoolBackgroundByType(data));
        },
        [dispatch]
    );

    const updateCalculatePoolAction = useCallback(
        (data: IUpdateCalculatePoolParams) => {
            dispatch(updateCalculatePool(data));
        },
        [dispatch]
    );

    const getMetadataPoolVisibleAction = useCallback(
        (data: IGetMetadataPoolParams) => {
            dispatch(getPoolMetadata(data));
        },
        [dispatch]
    );

    const setFilterAction = useCallback(
        (data: PoolStatus) => {
            dispatch(setFilter(data));
        },
        [dispatch]
    );

    const setOrderByDirectionAction = useCallback(
        (data: PoolStatusSortFilter) => {
            dispatch(setOrderByDirectionFilter(data));
        },
        [dispatch]
    );

    const setOrderByAction = useCallback(
        (data: PoolStatusSortOrderBy) => {
            dispatch(setOrderByFilter(data));
        },
        [dispatch]
    );

    return {
        poolStateList,
        getListPoolAction,
        getListPoolBackgroundAction,
        updateCalculatePoolAction,
        getMetadataPoolVisibleAction,
        setFilterAction,
        setOrderByDirectionAction,
        setOrderByAction
    };
};

export function useBuyPoolInformation(): [
    IBuyPool,
    (data: IBuyPool) => void,
    () => void
] {
    const dispatch = useAppDispatch();
    const data = useAppSelector((state: RootState) => state.poolBuy);
    const setBuyPoolInformation = useCallback(
        (data: IBuyPool) => {
            dispatch(updateBuyPoolInformation(data));
        },
        [dispatch]
    );

    const resetData = useCallback(() => {
        dispatch(resetBuyPoolInformation());
    }, [dispatch]);

    return [data, setBuyPoolInformation, resetData];
}

export function useDepositLottery(): [
    IDepositLottery,
    (data: IDepositLottery) => void,
    () => void
] {
    const dispatch = useAppDispatch();
    const dataDeposit = useAppSelector(
        (state: RootState) => state.depositLottery
    );
    const setDepositLotteryInformation = useCallback(
        (data: IDepositLottery) => {
            dispatch(updateDepositLotteryInformation(data));
        },
        [dispatch]
    );
    const resetData = useCallback(() => {
        dispatch(resetDepositLotteryInformation());
    }, [dispatch]);

    return [dataDeposit, setDepositLotteryInformation, resetData];
}

export function useSellPoolInformation(): [
    ISellPool,
    (data: ISellPool) => void,
    () => void
] {
    const dispatch = useAppDispatch();
    const data = useAppSelector((state: RootState) => state.poolSell);

    const setSellPoolInformation = useCallback(
        (data: ISellPool) => {
            dispatch(updateSellPoolInformation(data));
        },
        [dispatch]
    );

    const resetData = useCallback(() => {
        dispatch(resetSellPoolInformation());
    }, [dispatch]);

    return [data, setSellPoolInformation, resetData];
}

type ActivitiesType = {
    activitiesState: IActivitiesState;
    getListTransactionByPoolAndSender: (
        data: IGetTransactionByPoolAndSenderParams
    ) => void;
    setOpenModalActiviti: (isOpenModalActivities: boolean) => void;
};

export const useActivities = (): ActivitiesType => {
    const dispatch = useAppDispatch();
    const activitiesState = useAppSelector(
        (state: RootState) => state.activities
    );

    const getListTransactionByPoolAndSender = useCallback(
        (data: IGetTransactionByPoolAndSenderParams) => {
            dispatch(getAllTransactionByPoolAndSernder(data));
        },
        [dispatch]
    );
    const setOpenModalActiviti = useCallback(
        (isOpenModalActivities: boolean) => {
            dispatch(setOpenModalActivities({ isOpenModalActivities }));
        },
        [dispatch]
    );

    return {
        activitiesState,
        getListTransactionByPoolAndSender,
        setOpenModalActiviti
    };
};

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

export function useCreatePoolLaunchInformation(): [
    ICreatePoolLaunch,
    (data: ICreatePoolLaunch) => void,
    () => void,
    () => void
] {
    const dispatch = useAppDispatch();
    const data = useAppSelector((state: RootState) => state.poolCreateLaunch);

    const setCreatePoolLaiunchInformation = useCallback(
        (data: ICreatePoolLaunch) => {
            dispatch(updateCreatePoolLaunchInformation(data));
        },
        [dispatch]
    );
    const resetData = useCallback(() => {
        dispatch(resetCreatePoolLaunchData());
    }, [dispatch]);
    const resetDataAiAgentAction = useCallback(() => {
        dispatch(resetAiAgent());
    }, [dispatch]);

    return [
        data,
        setCreatePoolLaiunchInformation,
        resetData,
        resetDataAiAgentAction
    ];
}

export function useCreateAiAgentInformation(): [
    ICreateAiAgent,
    (data: ICreateAiAgent) => void,
    () => void,
    setOpenModalCreateAiAgentAction: (isOpenModalCreateAiAgent: boolean) => void
] {
    const dispatch = useAppDispatch();
    const data = useAppSelector((state: RootState) => state.createAiAgent);
    const setCreateAiAgentInformationAction = useCallback(
        (data: ICreateAiAgent) => {
            dispatch(updateCreateAiAgentInformation(data));
        },
        [dispatch]
    );
    const resetDataAction = useCallback(() => {
        dispatch(resetCreateAiAgentInformation());
    }, [dispatch]);

    const setOpenModalCreateAiAgentAction = useCallback(
        (isOpenModalCreateAiAgent: boolean) => {
            dispatch(setOpenModalCreateAiAgent({ isOpenModalCreateAiAgent }));
        },
        [dispatch]
    );

    return [
        data,
        setCreateAiAgentInformationAction,
        resetDataAction,
        setOpenModalCreateAiAgentAction
    ];
}

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

type TrustScoreHistoryPoolType = {
    trustScoreHistoryPoolState: ITrustScoreHistoryPoolState;
    getTrustScoreHistoryPoolAction: (
        data: IGetTrustScoreHistoryPoolParams
    ) => void;
    setOpenModalHistoryPoolAction: (isOpenModalHistoryPool: boolean) => void;
    resetTrustScoreHistoryPoolAction: () => void;
};

export const useTrustScoreHistoryPool = (): TrustScoreHistoryPoolType => {
    const dispatch = useAppDispatch();
    const trustScoreHistoryPoolState = useAppSelector(
        (state: RootState) => state.trustScoreHistoryPool
    );

    const getTrustScoreHistoryPoolAction = useCallback(
        (data: IGetTrustScoreHistoryPoolParams) => {
            dispatch(getTrustScoreHistoryPool(data));
        },
        [dispatch]
    );

    const setOpenModalHistoryPoolAction = useCallback(
        (isOpenModalHistoryPool: boolean) => {
            dispatch(setOpenModalHistoryPool({ isOpenModalHistoryPool }));
        },
        [dispatch]
    );

    const resetTrustScoreHistoryPoolAction = useCallback(() => {
        dispatch(resetTrustScoreHistoryPool());
    }, [dispatch]);

    return {
        trustScoreHistoryPoolState,
        getTrustScoreHistoryPoolAction,
        setOpenModalHistoryPoolAction,
        resetTrustScoreHistoryPoolAction
    };
};
