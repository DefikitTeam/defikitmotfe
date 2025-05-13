'use client';

import Leaderboard from '@/src/components/leaderboard/Leaderboard';
import { useEffect } from 'react';

const LeaderboardView = () => {
    useEffect(() => {
        // Force cleanup widget khi vào home
        if (window.AIChatWidget) {
            window.AIChatWidget.destroy?.();
        }
        document
            .querySelectorAll('#ai-chat-widget-container')
            .forEach((e) => e.remove());
        document
            .querySelectorAll('[data-ai-chat-widget]')
            .forEach((e) => e.remove());
    }, []);

    return (
        <div>
            <Leaderboard />
        </div>
    );
};

export default LeaderboardView;
