'use client';
import { ConfigProvider } from 'antd';
import { AbstractIntlMessages, NextIntlClientProvider } from 'next-intl';
import { FC, ReactNode } from 'react';
import '@rainbow-me/rainbowkit/styles.css';
import { Provider as ReduxProvider } from 'react-redux';
import { useStore } from './stores';
import theme from './theme/antdThemeConfig';

import GlobalConnectWalletProvider from './components/connect-wallet/config';
import { AntdRegistry } from '@ant-design/nextjs-registry';
interface ProvidersProps {
    locale: string;
    messages: AbstractIntlMessages;
    children: ReactNode;
}

const GlobalProvider: FC<ProvidersProps> = ({ locale, messages, children }) => {
    // init state
    const store = useStore(undefined);
    return (
        <ReduxProvider store={store}>
            <NextIntlClientProvider
                locale={locale}
                messages={messages}
            >
                <ConfigProvider theme={theme}>
                    <AntdRegistry>
                        <GlobalConnectWalletProvider>
                            {children}
                        </GlobalConnectWalletProvider>
                    </AntdRegistry>
                </ConfigProvider>
            </NextIntlClientProvider>
        </ReduxProvider>
    );
};

export default GlobalProvider;
