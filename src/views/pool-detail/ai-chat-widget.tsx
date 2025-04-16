/* eslint-disable */

import { useEffect } from 'react';
interface AIChatWidgetConfig {
    agentId: string;
    serverUrl: string;
    widgetUrl: string;
    position: string;
    welcomeMessage?: string;
}

declare global {
    interface Window {
        AIChatWidget?: {
            init: (config: AIChatWidgetConfig) => void;
            destroy?: () => void;
        };
    }
}

export interface IAiChatWidget {
    agentId?: string;
}

const AiChatWidget: React.FC<IAiChatWidget> = ({ agentId }) => {
    useEffect(() => {
        if (agentId && window.AIChatWidget) {
            window.AIChatWidget.init({
                agentId: agentId,
                serverUrl: 'https://aiapi-internal.defikit.net',
                widgetUrl: 'https://ai-cms.alex-defikit.workers.dev',
                position: 'bottom-right',
                welcomeMessage: 'welcome'
            });
        } else {
            // Cleanup khi không có agentId
            if (window.AIChatWidget) {
                window.AIChatWidget.destroy?.();
            }
            const widgetContainer = document.getElementById('ai-chat-widget');
            if (widgetContainer) {
                widgetContainer.remove();
            }
            const widgetStyles = document.querySelectorAll(
                '[data-ai-chat-widget]'
            );
            widgetStyles.forEach((style) => style.remove());
        }

        return () => {
            if (window.AIChatWidget) {
                window.AIChatWidget.destroy?.();
            }
        };
    }, [agentId]);

    return null;
};
export default AiChatWidget;
