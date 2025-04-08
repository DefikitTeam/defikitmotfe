/* eslint-disable */

import { CHAIN_CONFIG } from '@/src/config/environments/chains';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IChainInfor {
    chainId: number;
    name: string;
    currency: string;
    explorerUrl: string;
    rpcUrl: string;
    // onFaucet: boolean;
}

interface ChainDataState {
    chainData: IChainInfor;
}

const getInitialChainData = () => {
    // const environment = getEnvironment();

    return {
        chainId: CHAIN_CONFIG.defaultChain.id,
        name: CHAIN_CONFIG.defaultChain.name,
        currency: CHAIN_CONFIG.defaultChain.nativeCurrency.symbol,
        explorerUrl: CHAIN_CONFIG.defaultChain.blockExplorers.default.url,
        rpcUrl: CHAIN_CONFIG.defaultChain.rpcUrls.default.http[0]
    };
};

const initialState: ChainDataState = {
    chainData: getInitialChainData()!
};

const chainDataSlice = createSlice({
    name: 'chainData',
    initialState,
    reducers: {
        setChainData: (state, action: PayloadAction<IChainInfor>) => {
            state.chainData = action.payload;
        }
    }
});

export const { setChainData } = chainDataSlice.actions;
export default chainDataSlice.reducer;
