/* eslint-disable */

import { ConfigService } from '@/src/config/services/config-service';
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
    const configService = ConfigService.getInstance();

    return {
        chainId: configService.getDefaultChainNew().id,
        name: configService.getDefaultChainNew().name,
        currency: configService.getDefaultChainNew().nativeCurrency.symbol,
        explorerUrl: configService.getDefaultChainNew().blockExplorers?.default.url ?? '',
        rpcUrl: configService.getDefaultChainNew().rpcUrls.default.http[0] ?? ''
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
