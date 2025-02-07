/* eslint-disable */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICreatePoolLaunch } from './type';

const initialState: ICreatePoolLaunch = {
    token: '',
    fixedCapETH: '2',
    websiteLink: '',
    telegramLink: '',
    twitterLink: '',
    discordLink: '',
    tokenForAirdrop: '0',
    description: '',
    tokenForFarm: '0',
    tokenToMint: '0',
    tokenForAddLP: '0',
    totalBatch: 1000,
    maxRepeatPurdchase: 100,
    startTime: 0,
    endTime: 0,
    maxDurationSell: 604800,
    minDurationSell: 12,
    metadata: ''
};

export const poolLaunchSlice = createSlice({
    name: 'poolLaunchSlice',
    initialState,
    reducers: {
        updateCreatePoolLaunchInformation: (
            state: ICreatePoolLaunch,
            action: PayloadAction<ICreatePoolLaunch>
        ) => {
            state.token = action.payload.token;
            state.fixedCapETH = action.payload.fixedCapETH;
            state.websiteLink = action.payload.websiteLink;
            state.telegramLink = action.payload.telegramLink;
            state.twitterLink = action.payload.twitterLink;
            state.discordLink = action.payload.discordLink;
            state.tokenForAirdrop = action.payload.tokenForAirdrop;
            state.description = action.payload.description;
            state.tokenForFarm = action.payload.tokenForFarm;
            state.tokenToMint = action.payload.tokenToMint;
            state.tokenForAddLP = action.payload.tokenForAddLP;
            state.totalBatch = action.payload.totalBatch;
            state.maxRepeatPurdchase = action.payload.maxRepeatPurdchase;
            state.startTime = action.payload.startTime;
            state.endTime = action.payload.endTime;
            state.maxDurationSell = action.payload.maxDurationSell;
            state.minDurationSell = action.payload.minDurationSell;
            state.metadata = action.payload.metadata;
        },
        resetCreatePoolLaunchData: () => {
            return initialState;
        }
    }
});

export const { resetCreatePoolLaunchData, updateCreatePoolLaunchInformation } =
    poolLaunchSlice.actions;

export default poolLaunchSlice.reducer;
