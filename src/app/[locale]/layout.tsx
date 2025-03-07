/* eslint-disable */
import { Roboto } from 'next/font/google';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import './globals.css';

import WorkspaceLayout from '@/src/components/workspace-layout';
import GlobalProvider from '@/src/global-provider';
import ErudaInit from '@/src/components/eruda-int';

const roboto = Roboto({ subsets: ['latin'], weight: ['400', '500', '700'] });

export async function generateMetadata() {
    return {
        title: `Rocket Launch - Home`,
        description:
            'Mother Of Token - Rocket Launch is a decentralized platform for launching tokens',
        openGraph: {
            title: `Rocket Launch - Home`,
            description:
                'Mother Of Token - Rocket Launch is a decentralized platform for launching tokens',
            url: `https://staging.defikitmotfe.pages.dev/`,
            type: 'website',
            images: [
                {
                    url: 'https://testnet.rocketlaunch.fun/rocket_launch.jpg',
                    width: 800,
                    height: 600,
                    alt: 'Rocket Launch Image'
                }
            ]
        },
        twitter: {
            card: 'summary_large_image',
            title: `Rocket Launch - Home`,
            description:
                'Mother Of Token - Rocket Launch is a decentralized platform for launching tokens',
            images: 'https://testnet.rocketlaunch.fun/rocket_launch.jpg'
        }
    };
}

export function generateStaticParams() {
    return [{ locale: 'en' }];
}

export default async function RootLayout({
    children,
    params: { locale }
}: {
    children: ReactNode;
    params: {
        locale: string;
    };
}) {
    let messages;
    try {
        messages = (await import(`../../locales/${locale}.json`)).default;
    } catch (error) {
        notFound();
    }

    return (
        <html
            lang={locale}
            className="scroll-smooth"
        >
            <head>
                <link
                    rel="stylesheet"
                    href="https://ai-cms.alex-defikit.workers.dev/styling.css"
                />
                <script
                    src="https://ai-cms.alex-defikit.workers.dev/widget.js"
                    defer // Add defer attribute
                />
            </head>

            <body className={roboto.className}>
                <script src="https://telegram.org/js/telegram-web-app.js"></script>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                function initWidget() {
                    if (typeof AIChatWidget !== 'undefined') {
                        AIChatWidget.init({
                            agentId: '5105450d-3b4c-46ca-b2f8-2584193dec34',
                            serverUrl: 'https://aiapi-internal.defikit.net',
                            position: 'bottom-right',
                            containerID: 'ai-chat-widget', // Add this line
                            customStyles: {
                                position: 'fixed',
                                bottom: '120px',
                                right: '40px',
                                zIndex: '99999',
                            }
                        });
                    } else {
                        setTimeout(initWidget, 500); // Increased timeout
                    }
                }
                
                if (document.readyState === 'complete') {
                    initWidget();
                } else {
                    window.addEventListener('load', initWidget);
                }
            `
                    }}
                />
                <noscript>
                    You need to enable JavaScript to run this app.
                </noscript>
                <GlobalProvider
                    locale={locale}
                    messages={messages}
                >
                    <WorkspaceLayout>{children}</WorkspaceLayout>
                </GlobalProvider>
            </body>
        </html>
    );
}
