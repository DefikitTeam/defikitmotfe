import { ConfigService } from '@/src/config/services/config-service';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FC, ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';
import { config } from './wagmi';
interface ProvidersProps {
  children: ReactNode;
}
const queryClient = new QueryClient();
const GlobalConnectWalletProvider: FC<ProvidersProps> = ({ children }) => {
  const chainConfig = ConfigService.getInstance();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          initialChain={chainConfig.getDefaultChain()}
          appInfo={{
            appName: 'Rocket Launch'
          }}
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
