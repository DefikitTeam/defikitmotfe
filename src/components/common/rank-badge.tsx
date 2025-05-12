import useWindowSize from '@/src/hooks/useWindowSize';
import React from 'react';
import BigNumber from 'bignumber.js';

interface RankBadgeProps {
    rank: number;
    total: number;
    trustScore?: string | number;
    type: 'wallet' | 'pool';
}

const RankBadge = ({ rank, total, trustScore, type }: RankBadgeProps) => {
    const { isMobile } = useWindowSize();
    const trustScoreNumber =
        trustScore !== undefined && trustScore !== null
            ? new BigNumber(trustScore as string).div(1e18).toFixed(4)
            : 'N/A';

    return (
        <div
            className="
                inline-flex w-full min-w-[110px] max-w-xs
                flex-row items-center justify-center gap-x-3
                rounded-xl border
                border-yellow-300 bg-yellow-50 px-4
                py-1
                text-xs font-semibold
                shadow-sm
                sm:w-auto sm:text-sm
            "
        >
            <span className="text-lg">{type === 'wallet' ? '🏆' : '🎯'}</span>
            <span className="!font-forza">
                {type === 'wallet' ? 'Wallet' : 'Pool'} <b>#{rank}</b>/{total}
            </span>
            {!isMobile && (
                <span className="ml-2  flex items-center gap-x-1 !font-forza text-[11px] font-medium">
                    <span className="!font-forza text-base text-yellow-400">
                        ★
                    </span>
                    Trust Score: {trustScoreNumber}
                </span>
            )}
        </div>
    );
};

export default RankBadge;
