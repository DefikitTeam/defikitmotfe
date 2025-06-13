/* eslint-disable */
'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, Tabs, Spin, Alert, Empty, Select, DatePicker, Space, Button, notification } from 'antd';
import { useTranslations } from 'next-intl';
import { useAccount, useChainId } from 'wagmi';
import { ClockCircleOutlined, GiftOutlined, HistoryOutlined, FilterOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import { useDistributionCaller } from '@/src/hooks/useDistributionCaller';
import { useReaderDistribution } from '@/src/hooks/useReaderDistribution';
import { getWeekStartTimestamp, getMonthStartTimestamp } from '@/src/common/utils/utils';
import serviceDistribution from '@/src/services/external-services/backend-server/distribution';
import ClaimCard from './ClaimCard';
import ClaimHistory from './ClaimHistory';
import ClaimDetailsModal from './ClaimDetailsModal';

// Types based on JSON structure
interface RetroactiveClaimData {
  address: string;
  amount: string;
  amountRaw: string;
  proof: string[];
  trustScore: string;
  volume: string;
  type: 'wallet' | 'token';
  owner?: string;
  hasClaimed: boolean;
}

interface ClaimInfo {
  hasClaimed: boolean;
}

interface MerkleTreeData {
  rootHash: string;
  result: Record<string, RetroactiveClaimData>;
}

type ClaimType = 'week' | 'month' | 'quarter' | 'year';

interface ClaimFilters {
  type: ClaimType;
  timestamp: number;
  chainId: number;
}

const ClaimRetroactive = () => {
  const t = useTranslations();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  // Get distribution contract using the new hook

  // Distribution hooks
  const {
    useWeeklyClaimForWallet,
    useWeeklyClaimForToken,
    useMonthlyClaimForWallet,
    useMonthlyClaimForToken,
    useQuarterlyClaimForWallet,
    useQuarterlyClaimForToken,
    useYearlyClaimForWallet,
    useYearlyClaimForToken
  } = useDistributionCaller();

  // State management
  const [activeTab, setActiveTab] = useState('available');
  const [loading, setLoading] = useState(false);
  const [merkleData, setMerkleData] = useState<MerkleTreeData | null>(null);
  const [selectedClaim, setSelectedClaim] = useState<RetroactiveClaimData | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [eligibleClaimsFiltered, setEligibleClaimsFiltered] = useState<RetroactiveClaimData[]>([]);
  const [claimInfos, setClaimInfos] = useState<Record<string, ClaimInfo>>({});

  // Filter state
  const [filters, setFilters] = useState<ClaimFilters>({
    type: 'month',
    timestamp: Math.floor(Date.now() / 1000),
    chainId: chainId || 80069
  });

  // Track claim success state
  const [claimSuccess, setClaimSuccess] = useState(false);

  // Calculate normalized timestamp based on type
  const getNormalizedTimestamp = (type: ClaimType, timestamp: number): number => {
    switch (type) {
      case 'week':
        return getWeekStartTimestamp(timestamp);
      case 'month':
        return getMonthStartTimestamp(timestamp);
      case 'quarter':
        // For quarter, get month start and adjust to quarter start
        const monthStart = getMonthStartTimestamp(timestamp);
        const date = new Date(monthStart * 1000);
        const quarter = Math.floor(date.getMonth() / 3);
        date.setMonth(quarter * 3, 1);
        date.setHours(0, 0, 0, 0);
        return Math.floor(date.getTime() / 1000);
      case 'year':
        // For year, get January 1st of the year
        const yearStart = getMonthStartTimestamp(timestamp);
        const yearDate = new Date(yearStart * 1000);
        yearDate.setMonth(0, 1);
        yearDate.setHours(0, 0, 0, 0);
        return Math.floor(yearDate.getTime() / 1000);
      default:
        return timestamp;
    }
  };

  // Get claim status using useReaderDistribution
  const { claimInfos: readerClaimInfos, isFetchingClaimInfo } = useReaderDistribution({
    timestamp: getNormalizedTimestamp(filters.type, filters.timestamp),
    address: eligibleClaimsFiltered.map(claim => claim.address),
    type: filters.type,
    chainId: filters.chainId
  });
  // Load merkle tree data using serviceDistribution.getReward
  const loadMerkleData = async () => {
    setLoading(true);
    try {
      const normalizedTimestamp = getNormalizedTimestamp(filters.type, filters.timestamp);

      const response = await serviceDistribution.getReward(
        normalizedTimestamp.toString(),
        filters.type
      );

      let data: MerkleTreeData;

      if (response && response.data) {
        data = {
          rootHash: response.data.merkleRoot || '',
          result: response.data.dataProofs || {}
        };
      } else {
        data = {
          rootHash: '',
          result: {}
        };
      }

      setMerkleData(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load merkle data from API:', error);
      setMerkleData({
        rootHash: '',
        result: {}
      });
      setLoading(false);
    }
  };

  // Check if any claim is successful
  const isAnyClaimSuccessful = useMemo(() => {
    return Object.values({
      useWeeklyClaimForWallet,
      useWeeklyClaimForToken,
      useMonthlyClaimForWallet,
      useMonthlyClaimForToken,
      useQuarterlyClaimForWallet,
      useQuarterlyClaimForToken,
      useYearlyClaimForWallet,
      useYearlyClaimForToken
    }).some(claim => claim.isConfirmed);
  }, [
    useWeeklyClaimForWallet.isConfirmed,
    useWeeklyClaimForToken.isConfirmed,
    useMonthlyClaimForWallet.isConfirmed,
    useMonthlyClaimForToken.isConfirmed,
    useQuarterlyClaimForWallet.isConfirmed,
    useQuarterlyClaimForToken.isConfirmed,
    useYearlyClaimForWallet.isConfirmed,
    useYearlyClaimForToken.isConfirmed
  ]);

  // Reset claim success state and reload data when claim is successful
  useEffect(() => {
    if (isAnyClaimSuccessful) {
      setClaimSuccess(true);
      // Reload data to update claim status
      loadMerkleData();
      // Reset success state after 3 seconds
      const timer = setTimeout(() => {
        setClaimSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isAnyClaimSuccessful]);

  useEffect(() => {
    if (!merkleData || !address) return;

    const eligible: RetroactiveClaimData[] = [];

    Object.entries(merkleData.result).forEach(([claimAddress, claimData]) => {
      // Check wallet claims
      if (claimData.type === 'wallet' && claimAddress.toLowerCase() === address.toLowerCase()) {
        eligible.push({
          ...claimData,
          address: claimAddress,
        });
      }

      // Check token claims
      if (claimData.type === 'token' && claimData.owner?.toLowerCase() === address.toLowerCase()) {
        eligible.push({
          ...claimData,
          address: claimAddress,
        });
      }
    });

    setEligibleClaimsFiltered(eligible);
  }, [merkleData, address]);

  // Handle claim action
  const handleClaim = async (claim: RetroactiveClaimData) => {
    if (!merkleData) return;
    if (claim.type === "token") {
      notification.error({
        message: t('CLAIM_ERROR'),
        description: t('TOKEN_OWNER_NOT_SUPPORTED'),
        placement: 'topRight'
      });
      return;
    }

    try {
      const normalizedTimestamp = getNormalizedTimestamp(filters.type, filters.timestamp).toString();

      if (claim.type === 'wallet') {
        const params = {
          timestamp: normalizedTimestamp,
          amount: claim.amountRaw,
          proof: claim.proof
        };

        switch (filters.type) {
          case 'week':
            await useWeeklyClaimForWallet.actionAsync(params);
            break;
          case 'month':
            await useMonthlyClaimForWallet.actionAsync(params);
            break;
          case 'quarter':
            await useQuarterlyClaimForWallet.actionAsync(params);
            break;
          case 'year':
            await useYearlyClaimForWallet.actionAsync(params);
            break;
        }
      } else {
        const params = {
          timestamp: normalizedTimestamp,
          amount: claim.amountRaw,
          proof: claim.proof,
          token: claim.address
        };

        switch (filters.type) {
          case 'week':
            await useWeeklyClaimForToken.actionAsync(params);
            break;
          case 'month':
            await useMonthlyClaimForToken.actionAsync(params);
            break;
          case 'quarter':
            await useQuarterlyClaimForToken.actionAsync(params);
            break;
          case 'year':
            await useYearlyClaimForToken.actionAsync(params);
            break;
        }
      }
    } catch (error) {
      console.error('Claim failed:', error);
    }
  };

  // Show claim details modal
  const showClaimDetails = (claim: RetroactiveClaimData) => {
    setSelectedClaim(claim);
    setModalVisible(true);
  };

  // Update chainId when it changes
  useEffect(() => {
    if (chainId) {
      setFilters(prev => ({
        ...prev,
        chainId
      }));
    }
  }, [chainId]);

  // Load data on mount and when wallet connects
  useEffect(() => {
    if (isConnected) {
      loadMerkleData();
    }
  }, [isConnected]);

  // Reload data when filters change
  useEffect(() => {
    if (isConnected) {
      loadMerkleData();
    }
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (key: keyof ClaimFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Handle date change from DatePicker
  const handleDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      const timestamp = Math.floor(date.valueOf() / 1000);
      handleFilterChange('timestamp', timestamp);
    }
  };

  // Get current date value for DatePicker
  const getCurrentDateValue = () => {
    return dayjs(filters.timestamp * 1000);
  };

  // Tab items
  const tabItems = [
    {
      key: 'available',
      label: (
        <span className="flex items-center gap-2 !font-forza">
          <GiftOutlined />
          {t('AVAILABLE_CLAIMS')}
        </span>
      ),
      children: (
        <div className="space-y-4">
          {/* Filter Controls */}
          <Card className="bg-gray-50">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="flex items-center gap-2">
                <FilterOutlined className="text-blue-500" />
                <span className="!font-forza font-medium">{t('FILTERS')}:</span>
              </div>

              <Space wrap className="flex-1">
                <div className="flex flex-col gap-1">
                  <span className="!font-forza text-xs text-gray-600">{t('PERIOD_TYPE')}</span>
                  <Select
                    value={filters.type}
                    onChange={(value) => handleFilterChange('type', value)}
                    className="w-24"
                    size="small"
                  >
                    <Select.Option value="week">{t('WEEK')}</Select.Option>
                    <Select.Option value="month">{t('MONTH')}</Select.Option>
                    <Select.Option value="quarter">{t('QUARTER')}</Select.Option>
                    <Select.Option value="year">{t('YEAR')}</Select.Option>
                  </Select>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="!font-forza text-xs text-gray-600">{t('DATE')}</span>
                  <DatePicker
                    value={getCurrentDateValue()}
                    onChange={handleDateChange}
                    size="small"
                    format="YYYY-MM-DD"
                    allowClear={false}
                  />
                </div>
                <Button
                  icon={<FilterOutlined />}
                  onClick={loadMerkleData}
                  loading={loading}
                  size="small"
                  type="primary"
                  className="!font-forza"
                >
                  {t('APPLY')}
                </Button>
              </Space>
            </div>
          </Card>

          {loading ? (
            <div className="flex justify-center py-8">
              <Spin size="large" />
            </div>
          ) : eligibleClaimsFiltered.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {eligibleClaimsFiltered.map((claim, index) => (
                <ClaimCard
                  key={`${claim.address}-${index}`}
                  claim={claim}
                  onClaim={() => handleClaim(claim)}
                  onViewDetails={() => showClaimDetails(claim)}
                  hasClaimed={readerClaimInfos[claim.address]?.hasClaimed || false}
                  loading={Object.values({
                    useWeeklyClaimForWallet,
                    useWeeklyClaimForToken,
                    useMonthlyClaimForWallet,
                    useMonthlyClaimForToken,
                    useQuarterlyClaimForWallet,
                    useQuarterlyClaimForToken,
                    useYearlyClaimForWallet,
                    useYearlyClaimForToken
                  }).some(claim => claim.isLoadingInit || claim.isLoadingAgreed)}
                />
              ))}
            </div>
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span className="!font-forza text-gray-500">
                  {address ? t('NO_AVAILABLE_CLAIMS') : t('CONNECT_WALLET_TO_VIEW_CLAIMS')}
                </span>
              }
            />
          )}
        </div>
      ),
    },
    {
      key: 'history',
      label: (
        <span className="flex items-center gap-2 !font-forza">
          <HistoryOutlined />
          {t('CLAIM_HISTORY')}
        </span>
      ),
      children: <ClaimHistory />,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card
        className="mt-12 w-full"
        bodyStyle={{ padding: 0 }}
      >
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <ClockCircleOutlined className="text-2xl text-blue-500" />
            <h1 className="!font-forza text-2xl font-bold">
              {t('RETROACTIVE_CLAIMS')}
            </h1>
          </div>
          <p className="mt-2 !font-forza text-gray-600">
            {t('CLAIM_RETROACTIVE_REWARDS_DESCRIPTION')}
          </p>
        </div>

        {/* Success Alert */}
        {claimSuccess && (
          <div className="px-6 pt-4">
            <Alert
              message={t('CLAIM_SUCCESS')}
              type="success"
              showIcon
              closable
              onClose={() => setClaimSuccess(false)}
              className="!font-forza"
            />
          </div>
        )}

        {/* Error Alert */}
        {Object.values({
          useWeeklyClaimForWallet,
          useWeeklyClaimForToken,
          useMonthlyClaimForWallet,
          useMonthlyClaimForToken,
          useQuarterlyClaimForWallet,
          useQuarterlyClaimForToken,
          useYearlyClaimForWallet,
          useYearlyClaimForToken
        }).some(claim => claim.isError) && (
            <div className="px-6 pt-4">
              <Alert
                message={t('CLAIM_ERROR')}
                type="error"
                showIcon
                closable
                className="!font-forza"
              />
            </div>
          )}

        {/* Wallet Connection Check */}
        {!isConnected && (
          <div className="px-6 pt-4">
            <Alert
              message={t('WALLET_NOT_CONNECTED')}
              description={t('CONNECT_WALLET_TO_VIEW_CLAIMS')}
              type="warning"
              showIcon
              className="!font-forza"
            />
          </div>
        )}

        {/* Already Claimed Alert */}
        {address && claimInfos[address]?.hasClaimed && (
          <div className="px-6 pt-4">
            <Alert
              message={t('ALREADY_CLAIMED')}
              description={t('ALREADY_CLAIMED_DESCRIPTION')}
              type="info"
              showIcon
              className="!font-forza"
            />
          </div>
        )}

        {/* Main Content */}
        <div className="p-6">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            className="!font-forza"
            size="large"
          />
        </div>
      </Card>

      {/* Claim Details Modal */}
      <ClaimDetailsModal
        claim={selectedClaim}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onClaim={selectedClaim && !readerClaimInfos[selectedClaim.address]?.hasClaimed ? () => handleClaim(selectedClaim) : undefined}
        loading={Object.values({
          useWeeklyClaimForWallet,
          useWeeklyClaimForToken,
          useMonthlyClaimForWallet,
          useMonthlyClaimForToken,
          useQuarterlyClaimForWallet,
          useQuarterlyClaimForToken,
          useYearlyClaimForWallet,
          useYearlyClaimForToken
        }).some(claim => claim.isLoadingInit || claim.isLoadingAgreed)}
        hasClaimed={readerClaimInfos[selectedClaim?.address || '']?.hasClaimed || false}
      />
    </motion.div>
  );
};

export default ClaimRetroactive; 