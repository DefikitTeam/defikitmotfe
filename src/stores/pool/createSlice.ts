/* eslint-disable */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICreatePoolLaunch } from './type';

const initialState: ICreatePoolLaunch = {
    token: '',
    name: '',
    symbol: '',
    decimal: '18',
    totalSupply: '1000000000',
    bondBuyFirst: '0',
    fixedCapETH: '',
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
    metadata: '',
    aiAgent: {
        name: '',
        clients: ['twitter'],
        plugins: [],
        modelProvider: 'google',
        settings: {
            secrets: {},
            voice: {
                model: 'en_US-hfc_female-medium'
            }
        },
        system: '',
        bio: '',
        lore: [],
        messageExamples: [
            
        ],
        postExamples: [],
        adjectives: [],
        people: [],
        topics: [],
        style: {
            all: [
                'write short, impactful posts',
                'focus on motivating and inspiring the audience',
                'use plain, clear language—no jargon',
                'be confident, but humble',
                'be warm and engaging—connect with people',
                'focus on collaboration and shared goals',
                'avoid cynicism or negativity; stay optimistic'
                // 'be based in reality, but encourage bold thinking',
                // 'engage others to think and act, not just consume',
                // "be inclusive and accessible, no matter the audience's expertise",
                // 'always tie ideas back to action and purpose'
            ],
            chat: [
                'be approachable and friendly',
                'focus on solving problems and providing value',
                'stay constructive and positive in tone',
                'encourage collaboration and teamwork'
                // 'don’t shy away from big ideas, but keep the audience in mind',
                // 'be inspiring without being arrogant',
                // 'share knowledge generously and clearly'
            ],
            post: [
                'always leave the reader with a call to action or thought-provoking idea',
                'be concise and sharp—every word should have impact',
                'write posts that inspire action, not just admiration',
                'connect blockchain ideas to real-world scenarios or personal stories',
                'focus on building community and a shared vision'
                // 'don’t overly self-promote; instead, promote the mission and the possibilities',
                // 'be relatable—use sports metaphors or analogies when appropriate',
                // 'stay humble, but celebrate achievements when appropriate'
            ]
        }
    }
    // aiAgent: {}
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
            state.name = action.payload.name;
            state.symbol = action.payload.symbol;
            state.decimal = action.payload.decimal;
            state.totalSupply = action.payload.totalSupply;
            state.bondBuyFirst = action.payload.bondBuyFirst;

            if (action.payload.aiAgent) {
                state.aiAgent = {
                    ...state.aiAgent,
                    ...action.payload.aiAgent
                };
            }
        },
        resetCreatePoolLaunchData: () => {
            return initialState;
        },
        resetAiAgent: (state) => {
            state.aiAgent = initialState.aiAgent;
        }
    }
});

export const {
    resetCreatePoolLaunchData,
    updateCreatePoolLaunchInformation,
    resetAiAgent
} = poolLaunchSlice.actions;

export default poolLaunchSlice.reducer;
