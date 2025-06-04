/* eslint-disable */
import { Roboto } from 'next/font/google';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import './globals.css';

import WorkspaceLayout from '@/src/components/workspace-layout';
import GlobalProvider from '@/src/global-provider';
import { Metadata } from 'next'
import { siteConfig } from '@/src/common/constant/siteConfig';
const roboto = Roboto({ subsets: ['latin'], weight: ['400', '500', '700'] });

// export async function generateMetadata() {
//   return {
//     title: `Rocket Launch - Home`,
//     description:
//       'Mother Of Token - Rocket Launch is a decentralized platform for launching tokens',
//     openGraph: {
//       title: `Rocket Launch - Home`,
//       description:
//         'Mother Of Token - Rocket Launch is a decentralized platform for launching tokens',
//       url: `https://staging.rocketlaunch.fun/`,
//       type: 'website',
//       images: [
//         {
//           url: 'https://defikit-mot.s3.ap-southeast-1.amazonaws.com/rocket_launch.png',
//           width: 800,
//           height: 600,
//           alt: 'Rocket Launch Image'
//         }
//       ]
//     },
//     twitter: {
//       card: 'summary_large_image',
//       title: `Rocket Launch - Home`,
//       description:
//         'Mother Of Token - Rocket Launch is a decentralized platform for launching tokens',
//       images:
//         'https://defikit-mot.s3.ap-southeast-1.amazonaws.com/rocket_launch.png'
//     }
//   };
// }
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`
  },
  description: siteConfig.description,
  icons: {
    icon: siteConfig.icon,
    shortcut: siteConfig.logo,
    apple: siteConfig.logo
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.landing]
  },
  openGraph: {
    type: 'website',
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.landing,
        width: 1200,
        height: 630,
        alt: 'Landing Meta Image'
      }
    ]
  },
  viewport: 'width=device-width, initial-scale=1.0',
  robots: 'index, follow'
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
        <script src="https://ai-cms.alex-defikit.workers.dev/widget.js" async></script>
      </head>

      <body className={roboto.className}>
        <script src="https://telegram.org/js/telegram-web-app.js"></script>

        <noscript>You need to enable JavaScript to run this app.</noscript>
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
