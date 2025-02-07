'use client';
import '@rainbow-me/rainbowkit/styles.css';
import { ConfigProvider } from 'antd';
import { AbstractIntlMessages, NextIntlClientProvider } from 'next-intl';
import { FC, ReactNode } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { useStore } from './stores';
import theme from './theme/antdThemeConfig';

import { AntdRegistry } from '@ant-design/nextjs-registry';
import GlobalConnectWalletProvider from './components/connect-wallet/config';
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
                            {/* <div>demo12</div> */}
                            {children}
                        </GlobalConnectWalletProvider>
                    </AntdRegistry>
                </ConfigProvider>
            </NextIntlClientProvider>
        </ReduxProvider>
    );
};

export default GlobalProvider;
