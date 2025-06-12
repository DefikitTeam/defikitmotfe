/* eslint-disable */
'use client';

import { Card, Button, Tag, Tooltip, Spin } from 'antd';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import {
  WalletOutlined,
  GoldOutlined,
  InfoCircleOutlined,
  FireOutlined,
  BarChartOutlined
} from '@ant-design/icons';

interface RetroactiveClaimData {
  address: string;
  amount: string;
  amountRaw: string;
  proof: string[];
  trustScore: string;
  volume: string;
  type: 'wallet' | 'token';
  owner?: string;
}

interface ClaimCardProps {
  claim: RetroactiveClaimData;
  onClaim: () => void;
  onViewDetails: () => void;
  loading?: boolean;
}

const ClaimCard = ({ claim, onClaim, onViewDetails, loading = false }: ClaimCardProps) => {
  const t = useTranslations();

  const formatAmount = (amount: string) => {
    const num = parseFloat(amount);
    return num.toFixed(4);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getClaimTypeIcon = () => {
    return claim.type === 'wallet' ? (
      <WalletOutlined className="text-blue-500" />
    ) : (
      <GoldOutlined className="text-green-500" />
    );
  };

  const getClaimTypeBadge = () => {
    return (
      <Tag
        color={claim.type === 'wallet' ? 'blue' : 'green'}
        className="!font-forza font-semibold"
        icon={getClaimTypeIcon()}
      >
        {claim.type === 'wallet' ? t('WALLET_REWARD') : t('TOKEN_REWARD')}
      </Tag>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card
        className="h-full border-2 border-gray-200 shadow-lg transition-all duration-300 hover:border-blue-300 hover:shadow-xl"
        bodyStyle={{ padding: '20px' }}
      >
        {/* Header with claim type badge */}
        <div className="mb-4 flex items-center justify-between">
          {getClaimTypeBadge()}
          <Tooltip title={t('VIEW_DETAILS')}>
            <Button
              type="text"
              icon={<InfoCircleOutlined />}
              onClick={onViewDetails}
              className="text-gray-500 hover:text-blue-500"
            />
          </Tooltip>
        </div>

        {/* Amount Information */}
        <div className="mb-4">
          <div className="text-center">
            <h3 className="!font-forza text-2xl font-bold text-green-600">
              {formatAmount(claim.amount)}
            </h3>
            <p className="!font-forza text-sm text-gray-500">
              {t('CLAIMABLE_AMOUNT')}
            </p>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 !font-forza text-sm text-gray-600">
              <FireOutlined className="text-orange-500" />
              {t('TRUST_SCORE')}:
            </span>
            <span className="!font-forza font-semibold text-orange-600">
              {parseFloat(claim.trustScore).toFixed(4)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 !font-forza text-sm text-gray-600">
              <BarChartOutlined className="text-purple-500" />
              {t('VOLUME')}:
            </span>
            <span className="!font-forza font-semibold text-purple-600">
              {parseFloat(claim.volume).toFixed(4)}
            </span>
          </div>
        </div>

        {/* Claim Details */}
        <div className="mb-4 space-y-1">
          <div className="!font-forza text-xs text-gray-500">
            {claim.type === 'wallet' ? t('WALLET_ADDRESS') : t('TOKEN_ADDRESS')}:
          </div>
          <div className="!font-forza text-sm font-mono">
            {formatAddress(claim.address)}
          </div>

          {claim.type === 'token' && claim.owner && (
            <>
              <div className="!font-forza text-xs text-gray-500">
                {t('OWNER_ADDRESS')}:
              </div>
              <div className="!font-forza text-sm font-mono">
                {formatAddress(claim.owner)}
              </div>
            </>
          )}
        </div>

        {/* Claim Button */}
        <Button
          type="primary"
          size="large"
          block
          onClick={onClaim}
          loading={loading}
          className="!font-forza font-semibold"
          disabled={loading}
        >
          {loading ? t('CLAIMING') : t('CLAIM_REWARD')}
        </Button>
      </Card>
    </motion.div>
  );
};

export default ClaimCard; 