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
            url: `https://staging.rocketlaunch.fun/`,
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
                <script src="https://ai-cms.alex-defikit.workers.dev/widget.js"></script>
            </head>

            <body className={roboto.className}>
                <script src="https://telegram.org/js/telegram-web-app.js"></script>

                

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
