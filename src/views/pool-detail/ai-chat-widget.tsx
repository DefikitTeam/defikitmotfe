/* eslint-disable */
'use client';
import {
  NEXT_PUBLIC_AI_AGENT_SERVER,
  NEXT_PUBLIC_AI_CMS
} from '@/src/common/web3/constants/env';
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
  useEffect(() => {
    // Cleanup trước khi init mới
    if (window.AIChatWidget) {
      window.AIChatWidget.destroy?.();
    }
    document
      .querySelectorAll('#ai-chat-widget-container')
      .forEach((e) => e.remove());
    document
      .querySelectorAll('[data-ai-chat-widget]')
      .forEach((e) => e.remove());

    if (agentId && window.AIChatWidget) {
      window.AIChatWidget.init({
        agentId: agentId,
        serverUrl: NEXT_PUBLIC_AI_AGENT_SERVER!,
        widgetUrl: NEXT_PUBLIC_AI_CMS!,
        position: 'bottom-right',
        welcomeMessage: `Welcome! This is ${agentName}. How can I help you today?`
      });
    } else {
      // Cleanup khi không có agentId
      if (window.AIChatWidget) {
        window.AIChatWidget.destroy?.();
      }
      document
        .querySelectorAll('#ai-chat-widget-container')
        .forEach((e) => e.remove());
      document
        .querySelectorAll('[data-ai-chat-widget]')
        .forEach((e) => e.remove());

      const widgetContainer = document.getElementById('ai-chat-widget');
      if (widgetContainer) {
        widgetContainer.remove();
      }
      const widgetStyles = document.querySelectorAll('[data-ai-chat-widget]');
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
