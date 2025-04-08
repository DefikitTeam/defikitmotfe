/* eslint-disable */
'use client';
import { useConfig } from '@/src/hooks/useConfig';
import { Layout } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useCallback, useEffect } from 'react';
import Content from './content';
import Footer from './footer';
import Header from './header';
import WidgetManager from '../widget-manager';

export interface IWorkspaceLayout {
    children: ReactNode;
}

const WorkspaceLayout = (props: IWorkspaceLayout) => {
    const router = useRouter();
    const pathname = usePathname();
    const currentPath = pathname?.split('/');

    const { chainConfig } = useConfig();

    useEffect(() => {
        if (currentPath && currentPath.length < 2) {
            handleNavigation();
        }
    }, [currentPath, chainConfig?.name]);

    const handleNavigation = useCallback(() => {
        router.push(`/${chainConfig?.name.replace(/\s+/g, '').toLowerCase()}`);
    }, [chainConfig]);

    if (currentPath && currentPath.length < 2) {
        handleNavigation();
        return null;
    }

    return (
        <Layout className="min-h-screen">
            <WidgetManager />
            <Header />
            <Layout className="mt-12">
                <Content {...props} />
            </Layout>
            <Footer />
        </Layout>
    );
};
export default WorkspaceLayout;
