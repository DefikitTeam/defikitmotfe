import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FC, ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';
import { config } from './wagmi';
import { RootState } from '@/src/stores';
import { useSelector } from 'react-redux';
import { berachain } from 'viem/chains';
interface ProvidersProps {
    children: ReactNode;
}
const queryClient = new QueryClient();
const GlobalConnectWalletProvider: FC<ProvidersProps> = ({ children }) => {
    const chainData = useSelector(
        (state: RootState) => state.chainData.chainData
    );

    // console.log('chainData line 18----', chainData)

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider
                    initialChain={chainData.chainId || berachain}
                    coolMode
                    theme={darkTheme({
                        accentColor: '#7b3fe4',
                        accentColorForeground: 'white',
                        borderRadius: 'small',
                        fontStack: 'system',
                        overlayBlur: 'small'
                    })}
                >
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
};

export default GlobalConnectWalletProvider;
