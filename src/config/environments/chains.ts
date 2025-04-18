/* eslint-disable */

import { berachainBepolia, Chain } from 'viem/chains';

export const CHAIN_CONFIG = {
    // production: {
    //     defaultChain: berachain,
    //     supportedChains: [berachain]
    // },
    // staging: {
    defaultChain: berachainBepolia,
    supportedChains: [berachainBepolia]
    // },
    // development: {
    //     defaultChain: baseSepolia,
    //     supportedChains: [
    //         baseSepolia,
    //         polygonAmoy,
    //         artelaTestnet,
    //         unichainSepoliaTestnet
    //     ]
    // }
};
