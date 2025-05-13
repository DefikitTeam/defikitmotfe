/* eslint-disable */
'use client';
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
    agentName?: string;
}

const AiChatWidget: React.FC<IAiChatWidget> = ({ agentId, agentName }) => {
    console.log('agentId line 26-----', agentId);


    useEffect(() => {
        if (agentId && window.AIChatWidget) {
            window.AIChatWidget.init({
                agentId: agentId,
                serverUrl: 'https://aiapi.defikit.net',
                widgetUrl: 'https://ai-cms.alex-defikit.workers.dev',
                position: 'bottom-right',
                welcomeMessage: `Welcome! This is ${agentName}. How can I help you today?`,
            });
            
        } else {
            // Cleanup khi không có agentId
            if (window.AIChatWidget) {
                window.AIChatWidget.destroy?.();
            }
            // Xóa tất cả container widget còn sót lại
            document.querySelectorAll('#ai-chat-widget-container').forEach(e => e.remove());
            document.querySelectorAll('[data-ai-chat-widget]').forEach(e => e.remove());
            
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
            const widgetContainer = document.getElementById('ai-chat-widget');
            if (widgetContainer) widgetContainer.remove();
            const widgetStyles = document.querySelectorAll('[data-ai-chat-widget]');
            widgetStyles.forEach((style) => style.remove());
        };
    }, [agentId]);

    return null;
};
export default AiChatWidget;
