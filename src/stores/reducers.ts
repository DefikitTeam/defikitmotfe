import activitiesReducer from '@/src/stores/pool/activitiSlice';
import poolBuyReducer from '@/src/stores/pool/buyPoolSlice';
import poolCreateLaunchReducer from '@/src/stores/pool/createSlice';
import poolDetailReducer from '@/src/stores/pool/detailSlice';
import poolListReducer from '@/src/stores/pool/listSlice';
import poolSellReducer from '@/src/stores/pool/sellPoolSlice';
import slippageReducer from '@/src/stores/pool//slippageSlice';
import vestingReducer from '@/src/stores/pool/vestingSlice';
import tokenCreateReducer from '@/src/stores/token/createSlice';
import { combineReducers } from '@reduxjs/toolkit';
import tokenListReducer from './token/listSlice';
import portfolioReducer from '@/src/stores/profile/slice';
import tokenSellReducer from '@/src/stores/profile/sellTokenSlice';
import passDataSlice from '@/src/stores/pool/passDataSlice';
import authReducer from '@/src/stores/auth/slice';
import rewardReducer from '@/src/stores/pool/rewardSlice';
import chainDataReducer from '@/src/stores/Chain/chainDataSlice';

const rootReducer = combineReducers({
    auth: authReducer,
    poolDetail: poolDetailReducer,
    poolList: poolListReducer,
    poolBuy: poolBuyReducer,
    poolSell: poolSellReducer,
    activities: activitiesReducer,
    slippage: slippageReducer,
    vesting: vestingReducer,
    tokenList: tokenListReducer,
    tokenCreate: tokenCreateReducer,
    poolCreateLaunch: poolCreateLaunchReducer,
    portfolio: portfolioReducer,
    tokenSell: tokenSellReducer,
    passData: passDataSlice,
    reward: rewardReducer,
    chainData: chainDataReducer
});

export default rootReducer;
