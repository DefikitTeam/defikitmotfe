import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICreateAiAgent } from './type';

const initialState: ICreateAiAgent = {
    name: '',
    clients: [],
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
    messageExamples: [],
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
};

export const createAiAgentSlice = createSlice({
    name: 'createAiAgentSlice',
    initialState,
    reducers: {
        updateCreateAiAgentInformation: (
            state: ICreateAiAgent,
            action: PayloadAction<ICreateAiAgent>
        ) => {
            state.name = action.payload.name;
            state.clients = action.payload.clients;
            state.plugins = action.payload.plugins;
            state.modelProvider = action.payload.modelProvider;
            state.settings = action.payload.settings;
            state.system = action.payload.system;
            state.bio = action.payload.bio;
            state.lore = action.payload.lore;
            state.messageExamples = action.payload.messageExamples;
            state.postExamples = action.payload.postExamples;
            state.adjectives = action.payload.adjectives;
            state.people = action.payload.people;
            state.topics = action.payload.topics;
            state.style = action.payload.style;
        },
        resetCreateAiAgentInformation: (state: ICreateAiAgent) => {
            return initialState;
        },
        setOpenModalCreateAiAgent: (
            state: ICreateAiAgent,
            action: PayloadAction<{ isOpenModalCreateAiAgent: boolean }>
        ) => {
            state.isOpenModalCreateAiAgent =
                action.payload.isOpenModalCreateAiAgent;
        }
    }
});

export const {
    updateCreateAiAgentInformation,
    resetCreateAiAgentInformation,
    setOpenModalCreateAiAgent
} = createAiAgentSlice.actions;

export default createAiAgentSlice.reducer;
