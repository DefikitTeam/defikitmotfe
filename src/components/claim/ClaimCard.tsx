/* eslint-disable */
'use client';

import { Card, Button, Tag, Space, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { WalletOutlined, GoldOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Text } = Typography;

interface ClaimCardProps {
  claim: {
    type: 'wallet' | 'token';
    amount: string;
    trustScore: string;
    volume: string;
  };
  hasClaimed: boolean;
  onClaim: () => void;
  onViewDetails: () => void;
  loading?: boolean;
}

const ClaimCard = ({ claim, onClaim, onViewDetails, loading = false, hasClaimed }: ClaimCardProps) => {
  const t = useTranslations();

  const typeConfig = {
    wallet: {
      icon: <WalletOutlined />,
      title: t('WALLET_CLAIM'),
      color: 'blue',
      description: t('WALLET_CLAIM_DESCRIPTION')
    },
    token: {
      icon: <GoldOutlined />,
      title: t('TOKEN_CLAIM'),
      color: 'gold',
      description: t('TOKEN_CLAIM_DESCRIPTION')
    }
  };

  const config = typeConfig[claim.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className="h-full !font-forza"
        bodyStyle={{ padding: '1.5rem' }}
      >
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Tag
              color={config.color}
              icon={config.icon}
              className="!font-forza text-base font-semibold px-4 py-1"
            >
              {config.title}
            </Tag>
            {hasClaimed && (
              <Tag color="green" className="!font-forza">
                {t('CLAIMED')}
              </Tag>
            )}
          </div>

          {/* Amount */}
          <div className="text-center">
            <Text className="!font-forza text-3xl font-bold text-green-600">
              {parseFloat(claim.amount).toFixed(6)}
            </Text>
            <Text className="!font-forza block text-sm text-gray-500">
              {t('CLAIMABLE_AMOUNT')}
            </Text>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <Text className="!font-forza block text-sm text-gray-500">
                {t('TRUST_SCORE')}
              </Text>
              <Text className="!font-forza text-lg font-semibold">
                {claim.trustScore}
              </Text>
            </div>
            <div className="text-center">
              <Text className="!font-forza block text-sm text-gray-500">
                {t('VOLUME')}
              </Text>
              <Text className="!font-forza text-lg font-semibold">
                {claim.volume}
              </Text>
            </div>
          </div>

          {/* Actions */}
          <Space className="w-full justify-center">
            <Button
              type="primary"
              onClick={onClaim}
              loading={loading}
              disabled={hasClaimed || loading}
              className="!font-forza"
            >
              {hasClaimed ? t('CLAIMED') : t('CLAIM_REWARD')}
            </Button>
            <Button
              onClick={onViewDetails}
              className="!font-forza"
            >
              {t('VIEW_DETAILS')}
            </Button>
          </Space>
        </div>
      </Card>
    </motion.div>
  );
};

export default ClaimCard; 