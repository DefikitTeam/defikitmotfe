/* eslint-disable */
'use client';
import { Layout } from 'antd';
import { ReactNode, useCallback, useEffect } from 'react';
import Content from './content';
import Footer from './footer';
import Header from './header';
import { usePathname, useRouter } from 'next/navigation';
import useCurrentChainInformation from '@/src/hooks/useCurrentChainInformation';

export interface IWorkspaceLayout {
    children: ReactNode;
}

const WorkspaceLayout = (props: IWorkspaceLayout) => {
    const { chainData } = useCurrentChainInformation();
    const router = useRouter();
    const pathname = usePathname();
    const currentPath = pathname?.split('/');

    useEffect(() => {
        if (currentPath && currentPath.length < 2) {
            handleNavigation();
        }
    }, [currentPath, chainData.name]);

    const handleNavigation = useCallback(() => {
        router.push(`/${chainData.name.replace(/\s+/g, '').toLowerCase()}`);
    }, [chainData]);

    return (
        <>
            {currentPath && currentPath.length < 2 ? (
                handleNavigation()
            ) : (
                <Layout className="min-h-screen">
                    <Header />
                    <Layout className="mt-12">
                        <Content {...props} />
                    </Layout>
                    <Footer />
                </Layout>
            )}
        </>
    );
};
export default WorkspaceLayout;
