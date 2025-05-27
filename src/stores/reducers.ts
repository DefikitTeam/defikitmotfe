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
import notificationReducer from '@/src/stores/notification/slice';
import topRefByVolReducer from '@/src/stores/top-ref-by-vol/slice';
import inviteListReferReducer from '@/src/stores/invite-code/list-refer-slice';
import getInviteCodeReducer from '@/src/stores/invite-code/get-invite-code';
import depositLotteryReducer from '@/src/stores/pool/depositLotterySlice';
import userReducer from '@/src/stores/Twitter/userSlice';
import discordUserReducer from '@/src/stores/discord/userSlice';
import getTrustPointReducer from '@/src/stores/trust-point/get-trust-point-status-slice';
import getTrustPointTokenReducer from '@/src/stores/trust-point/get-trust-point-status-token-slice';
import trustPointDailyWalletTokenReducer from '@/src/stores/trust-point/trust-point-daily-wallet-token-slice';
import trustPointWeeklyWalletTokenReducer from '@/src/stores/trust-point/trust-point-weekly-wallet-token-slice';
import trustPointMonthlyWalletTokenReducer from '@/src/stores/trust-point/trust-point-monthly-wallet-token-slice';
import createAiAgentReducer from '@/src/stores/pool/createAiAgent';
import trustScoreHistoryPoolReducer from '@/src/stores/pool/trustScoreHistoryPoolSlice';
import trustScoreHistoryWalletReducer from '@/src/stores/wallet/walletSlice';

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
  chainData: chainDataReducer,
  notification: notificationReducer,
  topRefByVol: topRefByVolReducer,
  // checkInviteCode: checkInviteCodeReducer,
  inviteListRefer: inviteListReferReducer,
  getInviteCode: getInviteCodeReducer,
  depositLottery: depositLotteryReducer,
  user: userReducer,
  discordUser: discordUserReducer,
  trustPoint: getTrustPointReducer,
  trustPointToken: getTrustPointTokenReducer,
  trustPointDailyWalletToken: trustPointDailyWalletTokenReducer,
  trustPointWeeklyWalletToken: trustPointWeeklyWalletTokenReducer,
  trustPointMonthlyWalletToken: trustPointMonthlyWalletTokenReducer,
  createAiAgent: createAiAgentReducer,
  trustScoreHistoryPool: trustScoreHistoryPoolReducer,
  trustScoreHistoryWallet: trustScoreHistoryWalletReducer
});

export default rootReducer;
