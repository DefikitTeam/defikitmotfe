/* eslint-disable */
'use client';

import { Modal, Button, Descriptions, Tag, Space, Alert, Divider, message } from 'antd';
import { useTranslations } from 'next-intl';
import {
  WalletOutlined,
  GoldOutlined,
  FireOutlined,
  BarChartOutlined,
  SecurityScanOutlined,
  CopyOutlined
} from '@ant-design/icons';
import { useState } from 'react';

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

interface ClaimDetailsModalProps {
  claim: RetroactiveClaimData | null;
  visible: boolean;
  onClose: () => void;
  onClaim?: () => void;
  loading?: boolean;
}

const ClaimDetailsModal = ({
  claim,
  visible,
  onClose,
  onClaim,
  loading = false
}: ClaimDetailsModalProps) => {
  const t = useTranslations();
  const [proofExpanded, setProofExpanded] = useState(false);

  if (!claim) return null;

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      message.success('Copied to clipboard!');
    }).catch(() => {
      message.error('Failed to copy to clipboard');
    });
  };

  const getClaimTypeConfig = () => {
    return claim.type === 'wallet'
      ? {
        icon: <WalletOutlined className="text-blue-500" />,
        color: 'blue',
        title: t('WALLET_REWARD'),
        description: t('WALLET_REWARD_DESCRIPTION')
      }
      : {
        icon: <GoldOutlined className="text-green-500" />,
        color: 'green',
        title: t('TOKEN_REWARD'),
        description: t('TOKEN_REWARD_DESCRIPTION')
      };
  };

  const typeConfig = getClaimTypeConfig();

  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          {typeConfig.icon}
          <span className="!font-forza text-lg font-semibold">
            {t('CLAIM_DETAILS')}
          </span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      width={600}
      footer={[
        <Button key="close" onClick={onClose} className="!font-forza">
          {t('CLOSE')}
        </Button>,
        onClaim && (
          <Button
            key="claim"
            type="primary"
            onClick={onClaim}
            loading={loading}
            className="!font-forza"
            disabled={loading}
          >
            {loading ? t('CLAIMING') : t('CLAIM_REWARD')}
          </Button>
        ),
      ]}
      className="!font-forza"
    >
      <div className="space-y-6">
        {/* Claim Type and Amount */}
        <div className="text-center">
          <Tag
            color={typeConfig.color}
            icon={typeConfig.icon}
            className="!font-forza mb-3 text-base font-semibold px-4 py-1"
          >
            {typeConfig.title}
          </Tag>

          <div className="mb-2">
            <div className="!font-forza text-3xl font-bold text-green-600">
              {parseFloat(claim.amount).toFixed(6)}
            </div>
            <div className="!font-forza text-sm text-gray-500">
              {t('CLAIMABLE_AMOUNT')}
            </div>
          </div>

          <Alert
            message={typeConfig.description}
            type="info"
            showIcon
            className="!font-forza text-left"
          />
        </div>

        <Divider />

        {/* Performance Metrics */}
        <div>
          <h4 className="!font-forza text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChartOutlined className="text-blue-500" />
            {t('PERFORMANCE_METRICS')}
          </h4>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <FireOutlined className="text-2xl text-orange-500 mb-2" />
              <div className="!font-forza text-xl font-bold text-orange-600">
                {parseFloat(claim.trustScore).toFixed(4)}
              </div>
              <div className="!font-forza text-sm text-gray-600">
                {t('TRUST_SCORE')}
              </div>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <BarChartOutlined className="text-2xl text-purple-500 mb-2" />
              <div className="!font-forza text-xl font-bold text-purple-600">
                {parseFloat(claim.volume).toFixed(4)}
              </div>
              <div className="!font-forza text-sm text-gray-600">
                {t('VOLUME')}
              </div>
            </div>
          </div>
        </div>

        <Divider />

        {/* Address Information */}
        <div>
          <h4 className="!font-forza text-lg font-semibold mb-4">
            {t('ADDRESS_INFORMATION')}
          </h4>

          <Descriptions column={1} bordered size="small" className="!font-forza">
            <Descriptions.Item
              label={claim.type === 'wallet' ? t('WALLET_ADDRESS') : t('TOKEN_ADDRESS')}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm">{claim.address}</span>
                <Button
                  type="text"
                  size="small"
                  icon={<CopyOutlined />}
                  onClick={() => copyToClipboard(claim.address)}
                  className="!font-forza"
                />
              </div>
            </Descriptions.Item>

            {claim.type === 'token' && claim.owner && (
              <Descriptions.Item label={t('OWNER_ADDRESS')}>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm">{claim.owner}</span>
                  <Button
                    type="text"
                    size="small"
                    icon={<CopyOutlined />}
                    onClick={() => copyToClipboard(claim.owner || '')}
                    className="!font-forza"
                  />
                </div>
              </Descriptions.Item>
            )}

            <Descriptions.Item label={t('AMOUNT_RAW')}>
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm">{claim.amountRaw}</span>
                <Button
                  type="text"
                  size="small"
                  icon={<CopyOutlined />}
                  onClick={() => copyToClipboard(claim.amountRaw)}
                  className="!font-forza"
                />
              </div>
            </Descriptions.Item>
          </Descriptions>
        </div>

        <Divider />

        {/* Merkle Proof */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="!font-forza text-lg font-semibold flex items-center gap-2">
              <SecurityScanOutlined className="text-green-500" />
              {t('MERKLE_PROOF')}
            </h4>
            <Button
              type="link"
              size="small"
              onClick={() => setProofExpanded(!proofExpanded)}
              className="!font-forza"
            >
              {proofExpanded ? t('HIDE') : t('SHOW')}
            </Button>
          </div>

          {proofExpanded ? (
            <div className="space-y-2">
              {claim.proof.map((hash, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <span className="!font-forza font-mono text-xs text-gray-600">
                    {index + 1}: {hash}
                  </span>
                  <Button
                    type="text"
                    size="small"
                    icon={<CopyOutlined />}
                    onClick={() => copyToClipboard(hash)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="!font-forza text-sm text-gray-600 text-center py-2">
              {t('PROOF_ELEMENTS_COUNT', { count: claim.proof.length })}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ClaimDetailsModal; 