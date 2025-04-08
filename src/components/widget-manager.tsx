'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const WidgetManager = () => {
    const pathname = usePathname();

    const cleanupWidget = () => {
        if (window.AIChatWidget) {
            window.AIChatWidget.destroy?.();
        }
        const widgetContainer = document.getElementById('ai-chat-widget');
        if (widgetContainer) {
            widgetContainer.remove();
        }
        const widgetStyles = document.querySelectorAll('[data-ai-chat-widget]');
        widgetStyles.forEach((style) => style.remove());
    };

    useEffect(() => {
        // Kiểm tra nếu không phải trang pool detail thì cleanup
        if (!pathname?.includes('/pool/address/')) {
            cleanupWidget();
        }
    }, [pathname]);

    // Cleanup khi component unmount
    useEffect(() => {
        return () => {
            cleanupWidget();
        };
    }, []);

    return null;
};

export default WidgetManager;
