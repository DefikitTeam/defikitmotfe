/* eslint-disable */
import useWindowSize from '@/src/hooks/useWindowSize';
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import TrustScoreHistoryModal from './trust-score-history-modal';

interface ITrustScore {
  rank: number;
  total: number;
  isHeader?: boolean;
  size: number;
}

export const TrustScore = ({
  rank,
  total,
  isHeader = false,
  size = 44
}: ITrustScore) => {
  // Calculate percentage for the circular progress
  const percentage = useMemo(() => {
    if (rank && total) {
      // Lower rank is better, so we invert the percentage
      return Math.max(
        0,
        Math.min(100, Math.round((1 - (rank - 1) / total) * 100))
      );
    }
    return 0;
  }, [rank, total]);

  // SVG circle properties - smaller size for header integration
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex-shrink-0">
      {/* Circular progress indicator */}
      <svg
        width={size}
        height={size}
        className="rotate-[-90deg]"
      >
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="#e5e7eb"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="#10b981"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>

      {/* Score text overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="flex items-baseline justify-center">
          <span
            className={`${isHeader ? '!font-forza text-sm font-bold text-gray-300' : '!font-forza text-sm  font-bold'}`}
          >
            {percentage}
          </span>
        </div>
      </div>
    </div>
  );
};

interface RankBadgeProps {
  rank: number;
  total: number;
  trustScore?: string | number;
  type: 'wallet' | 'pool';
  isHeader?: boolean;
}

const RankBadge = ({
  rank,
  total,
  trustScore,
  type,
  isHeader = false
}: RankBadgeProps) => {
  const { isMobile } = useWindowSize();
  const trustScoreNumber =
    trustScore !== undefined && trustScore !== null
      ? new BigNumber(trustScore as string).div(1e18).toFixed(4)
      : 'N/A';

  // Calculate percentage for the circular progress
  const percentage = useMemo(() => {
    if (rank && total) {
      // Lower rank is better, so we invert the percentage
      return Math.max(
        0,
        Math.min(100, Math.round((1 - (rank - 1) / total) * 100))
      );
    }
    return 0;
  }, [rank, total]);

  // SVG circle properties - smaller size for header integration
  return (
    <div className="inline-flex items-center">
      {trustScoreNumber !== 'N/A' && (
        <span
          className={`${isHeader ? 'mr-2 !font-forza text-sm text-gray-300' : 'mr-2 !font-forza text-sm'}`}
        >
          Trust Score: {trustScoreNumber}
        </span>
      )}

      <TrustScore
        rank={rank}
        total={total}
        isHeader={isHeader}
        size={44}
      />
    </div>
  );
};

export default RankBadge;
