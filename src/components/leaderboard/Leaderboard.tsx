/* eslint-disable */
import { useConfig } from '@/src/hooks/useConfig';
import {
    useTrustPointDailyWalletToken,
    useTrustPointMonthlyWalletToken,
    useTrustPointWeeklyWalletToken
} from '@/src/stores/trust-point/hook';
import BigNumber from 'bignumber.js';

import {
    calculateDayStartUnixForDate,
    calculateMonthStartUnixForDate_Inaccurate,
    calculateWeekStartUnixForDate
} from '@/src/common/utils/get-time-key';
import { shortWalletAddress } from '@/src/common/utils/utils';
import useWindowSize from '@/src/hooks/useWindowSize';
import { EActionStatus } from '@/src/stores/type';
import {
    CalculatorOutlined,
    DollarCircleOutlined,
    FireOutlined,
    StarOutlined,
    TrophyOutlined,
    WalletOutlined
} from '@ant-design/icons';
import { Card, Col, DatePicker, message, Row, Spin, Table, Tabs } from 'antd';
import confetti from 'canvas-confetti';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

dayjs.extend(utc);
dayjs.extend(weekOfYear);

const { TabPane } = Tabs;

interface UserLeaderboardEntry {
    rank: number;
    address: string;
    points: string;
    volume: string;
    multiplier?: string;
    lastUpdated: number;
}

interface PoolLeaderboardEntry {
    rank: number;
    poolId: string;
    tokenTrustPoint: string;
    trustScore: string;
    volume: string;
    multiplier?: string;
    lastUpdated: number;
    nameAndSymbol: string;
    // image: string
    changePrice24h: string;
}

const Leaderboard = () => {
    const t = useTranslations();
    const [activeTab, setActiveTab] = useState('daily');
    const { isMobile } = useWindowSize();

    const [selectedDate, setSelectedDate] = useState(dayjs.utc());
    const [selectedWeek, setSelectedWeek] = useState(dayjs.utc());
    const [selectedMonth, setSelectedMonth] = useState(dayjs.utc());

    const [activeDailySubTab, setActiveDailySubTab] = useState('wallet');
    const [activeWeeklySubTab, setActiveWeeklySubTab] = useState('wallet');
    const [activeMonthlySubTab, setActiveMonthlySubTab] = useState('wallet');
    const [loading, setLoading] = useState(true);
    const [loadingWeekly, setLoadingWeekly] = useState(false);
    const [loadingMonthly, setLoadingMonthly] = useState(false);
    const [userDailyData, setUserDailyData] = useState<UserLeaderboardEntry[]>(
        []
    );
    const [poolDailyData, setPoolDailyData] = useState<PoolLeaderboardEntry[]>(
        []
    );
    const [userWeeklyData, setUserWeeklyData] = useState<
        UserLeaderboardEntry[]
    >([]);
    const [poolWeeklyData, setPoolWeeklyData] = useState<
        PoolLeaderboardEntry[]
    >([]);
    const [userMonthlyData, setUserMonthlyData] = useState<
        UserLeaderboardEntry[]
    >([]);
    const [poolMonthlyData, setPoolMonthlyData] = useState<
        PoolLeaderboardEntry[]
    >([]);
    const { isConnected, address } = useAccount();

    const router = useRouter();
    const [highlightedUser, setHighlightedUser] = useState<string | null>(null);
    const { chainConfig } = useConfig();

    const { getTrustPointDailyWalletTokenAction, trustPointDailyWalletToken } =
        useTrustPointDailyWalletToken();
    const {
        getTrustPointWeeklyWalletTokenAction,
        trustPointWeeklyWalletToken
    } = useTrustPointWeeklyWalletToken();
    const {
        getTrustPointMonthlyWalletTokenAction,
        trustPointMonthlyWalletToken
    } = useTrustPointMonthlyWalletToken();

    const handleClickAddress = (address: string) => {
        router.push(
            `/${chainConfig?.name.replace(/\s+/g, '').toLowerCase()}/profile/address/${address}`
        );
    };

    const handleClickPoolAddress = (poolId: string) => {
        router.push(
            `/${chainConfig?.name.replace(/\s+/g, '').toLowerCase()}/pool/address/${poolId}`
        );
    };

    useEffect(() => {
        if (!chainConfig?.chainId || !selectedDate) {
            console.warn(
                'Cannot fetch daily data: Chain ID or Selected Date not available.'
            );
            return;
        }

        const dayStartUnix = calculateDayStartUnixForDate(selectedDate);

        getTrustPointDailyWalletTokenAction({
            chainId: chainConfig.chainId,
            dayStartUnix: dayStartUnix
        });
    }, [chainConfig?.chainId, selectedDate]);

    useEffect(() => {
        if (trustPointDailyWalletToken.status === EActionStatus.Pending) {
            setLoading(true);
        } else {
            setLoading(false);

            if (
                trustPointDailyWalletToken.status === EActionStatus.Succeeded &&
                trustPointDailyWalletToken
            ) {
                const processedUserData = (
                    trustPointDailyWalletToken.data.userTrustScoreDailies || []
                ).map((item, index) => ({
                    rank: index + 1,
                    address: item.user.id,
                    points: new BigNumber(item.trustScore).div(1e18).toFixed(7),
                    volume: new BigNumber(item.volume).div(1e18).toFixed(7),
                    multiplier: item.user.multiplier,
                    lastUpdated: item.dayStartUnix
                }));
                setUserDailyData(processedUserData);

                const processedPoolData = (
                    trustPointDailyWalletToken.data.poolTrustScoreDailies || []
                ).map((item, index) => ({
                    rank: index + 1,
                    poolId: item.pool.id,
                    tokenTrustPoint: item.tokenTrustPoint,
                    trustScore: new BigNumber(item.trustScore)
                        .div(1e18)
                        .toFixed(7),
                    volume: new BigNumber(item.volume).div(1e18).toFixed(7),
                    multiplier: item.pool.multiplier,
                    lastUpdated: item.dayStartUnix,
                    nameAndSymbol: `${item.pool.name}/${item.pool.symbol}`,
                    changePrice24h:
                        new BigNumber(item.pool.changePrice24h).toFixed(2) + '%'
                }));
                setPoolDailyData(processedPoolData);
            } else {
                setUserDailyData([]);
                setPoolDailyData([]);
                if (
                    trustPointDailyWalletToken.status === EActionStatus.Failed
                ) {
                    message.error('Failed to load daily leaderboard data.');
                }
            }
        }
    }, [trustPointDailyWalletToken.status, trustPointDailyWalletToken]);

    useEffect(() => {
        if (activeTab !== 'weekly' || !chainConfig?.chainId || !selectedWeek) {
            return;
        }

        const weekStartUnix = calculateWeekStartUnixForDate(selectedWeek);

        getTrustPointWeeklyWalletTokenAction({
            chainId: chainConfig.chainId,
            weekStartUnix: weekStartUnix
        });
    }, [chainConfig?.chainId, activeTab, selectedWeek]);

    useEffect(() => {
        if (trustPointWeeklyWalletToken.status === EActionStatus.Pending) {
            setLoadingWeekly(true);
        } else {
            setLoadingWeekly(false);
            if (
                trustPointWeeklyWalletToken.status ===
                    EActionStatus.Succeeded &&
                trustPointWeeklyWalletToken
            ) {
                const processedUserData = (
                    trustPointWeeklyWalletToken.data.userTrustScoreWeeklies ||
                    []
                ).map((item, index) => ({
                    rank: index + 1,
                    address: item.user.id,
                    points: new BigNumber(item.trustScore).div(1e18).toFixed(7),
                    volume: new BigNumber(item.volume).div(1e18).toFixed(7),
                    multiplier: item.user.multiplier,
                    lastUpdated: item.weekStartUnix
                }));
                setUserWeeklyData(processedUserData);

                const processedPoolData = (
                    trustPointWeeklyWalletToken.data.poolTrustScoreWeeklies ||
                    []
                ).map((item, index) => ({
                    rank: index + 1,
                    poolId: item.pool.id,
                    tokenTrustPoint: new BigNumber(item.tokenTrustPoint || '0')
                        .div(1e18)
                        .toFixed(7),
                    trustScore: new BigNumber(item.trustScore)
                        .div(1e18)
                        .toFixed(7),
                    volume: new BigNumber(item.volume).div(1e18).toFixed(7),
                    multiplier: item.pool.multiplier,
                    lastUpdated: item.weekStartUnix,
                    nameAndSymbol: `${item.pool.name}/${item.pool.symbol}`,
                    changePrice24h:
                        new BigNumber(item.pool.changePrice24h).toFixed(2) + '%'
                }));
                setPoolWeeklyData(processedPoolData);
            } else {
                setUserWeeklyData([]);
                setPoolWeeklyData([]);
            }
        }
    }, [trustPointWeeklyWalletToken.status, trustPointWeeklyWalletToken]);

    useEffect(() => {
        if (
            activeTab !== 'monthly' ||
            !chainConfig?.chainId ||
            !selectedMonth
        ) {
            return;
        }

        const monthStartUnix =
            calculateMonthStartUnixForDate_Inaccurate(selectedMonth);

        getTrustPointMonthlyWalletTokenAction({
            chainId: chainConfig.chainId,
            monthStartUnix: monthStartUnix
        });
    }, [activeTab, chainConfig?.chainId, selectedMonth]);

    useEffect(() => {
        if (trustPointMonthlyWalletToken.status === EActionStatus.Pending) {
            setLoadingMonthly(true);
        } else {
            setLoadingMonthly(false);
            if (
                trustPointMonthlyWalletToken.status ===
                    EActionStatus.Succeeded &&
                trustPointMonthlyWalletToken
            ) {
                const processedUserData = (
                    trustPointMonthlyWalletToken.data.userTrustScoreMonthlies ||
                    []
                ).map((item, index) => ({
                    rank: index + 1,
                    address: item.user.id,
                    points: new BigNumber(item.trustScore).div(1e18).toFixed(7),
                    volume: new BigNumber(item.volume).div(1e18).toFixed(7),
                    multiplier: item.user.multiplier,
                    lastUpdated: item.monthStartUnix
                }));
                setUserMonthlyData(processedUserData);

                const processedPoolData = (
                    trustPointMonthlyWalletToken.data.poolTrustScoreMonthlies ||
                    []
                ).map((item, index) => ({
                    rank: index + 1,
                    poolId: item.pool.id,
                    tokenTrustPoint: new BigNumber(item.tokenTrustPoint || '0')
                        .div(1e18)
                        .toFixed(7),
                    trustScore: new BigNumber(item.trustScore)
                        .div(1e18)
                        .toFixed(7),
                    volume: new BigNumber(item.volume).div(1e18).toFixed(7),
                    multiplier: item.pool.multiplier,
                    lastUpdated: item.monthStartUnix,
                    nameAndSymbol: `${item.pool.name}/${item.pool.symbol}`,
                    changePrice24h:
                        new BigNumber(item.pool.changePrice24h).toFixed(2) + '%'
                }));
                setPoolMonthlyData(processedPoolData);
            }
        }
    }, [trustPointMonthlyWalletToken.status, trustPointMonthlyWalletToken]);

    const celebrateTopRank = (address: string) => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
        setHighlightedUser(address);

        setTimeout(() => {
            setHighlightedUser(null);
        }, 3000);
    };

    const disabledDateGreaterThanCurrent = (current: any) => {
        return current && current.isAfter(dayjs(), 'day');
    };

    const userColumns = [
        {
            title: 'Rank',
            dataIndex: 'rank',
            key: 'rank',
            width: '5%',
            className: '!font-forza',
            render: (rank: number) => (
                <motion.div
                    className="flex items-center justify-center !font-forza"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.1 }}
                >
                    {rank <= 3 ? (
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{
                                duration: 0.5,
                                repeat: Infinity,
                                repeatDelay: 5
                            }}
                        >
                            <TrophyOutlined
                                className={`text-${rank === 1 ? 'yellow' : rank === 2 ? 'gray' : 'orange'}-500 text-xl`}
                            />
                        </motion.div>
                    ) : (
                        <span className="font-bold">{rank}</span>
                    )}
                </motion.div>
            )
        },
        {
            title: 'Wallet Address',
            dataIndex: 'address',
            key: 'address',
            width: '30%',

            className: '!font-forza',
            render: (address: string) => (
                <motion.div
                    className="flex items-center space-x-2 !font-forza"
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                >
                    <span
                        className="cursor-pointer !font-forza text-blue-400"
                        onClick={() => handleClickAddress(address)}
                    >
                        {isMobile
                            ? shortWalletAddress(address ? address : '')
                            : address}
                    </span>
                </motion.div>
            )
        },
        {
            title: 'Wallet Points',
            dataIndex: 'points',
            key: 'points',
            width: '20%',

            className: '!font-forza',
            sorter: (a: UserLeaderboardEntry, b: UserLeaderboardEntry) =>
                BigInt(a.points || '0') > BigInt(b.points || '0') ? 1 : -1,
            render: (points: string) => (
                <motion.div
                    className="flex items-center space-x-2 !font-forza"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                >
                    <FireOutlined className="text-orange-500" />
                    <span className="font-bold">{points || '0'}</span>
                </motion.div>
            )
        },
        {
            title: 'Volume',
            dataIndex: 'volume',
            key: 'volume',
            width: '20%',

            className: '!font-forza',
            sorter: (a: UserLeaderboardEntry, b: UserLeaderboardEntry) =>
                BigInt(a.volume || '0') > BigInt(b.volume || '0') ? 1 : -1,
            render: (volume: string) => (
                <span className="!font-forza">{volume || '0'}</span>
            )
        }
    ];

    const poolColumns = [
        {
            title: 'Rank',
            dataIndex: 'rank',
            key: 'rank',
            width: 80,
            className: '!font-forza',
            render: (rank: number) => (
                <motion.div
                    className="flex items-center justify-center !font-forza"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.1 }}
                >
                    {rank <= 3 ? (
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{
                                duration: 0.5,
                                repeat: Infinity,
                                repeatDelay: 5
                            }}
                        >
                            <TrophyOutlined
                                className={`text-${rank === 1 ? 'yellow' : rank === 2 ? 'gray' : 'orange'}-500 text-xl`}
                            />
                        </motion.div>
                    ) : (
                        <span className="font-forza">{rank}</span>
                    )}
                </motion.div>
            )
        },
        {
            title: t('SYMBOL/NAME'),
            dataIndex: 'nameAndSymbol',
            key: 'nameAndSymbol',
            className: '!font-forza',
            render: (nameAndSymbol: string) => (
                <span className="font-forza">{nameAndSymbol}</span>
            )
        },
        {
            title: 'Token (Pool ID)',
            dataIndex: 'poolId',
            key: 'poolId',
            className: '!font-forza',
            render: (poolId: string) => (
                <motion.div
                    className="flex items-center space-x-2 !font-forza"
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                >
                    <span
                        className="cursor-pointer !font-forza text-blue-400 "
                        onClick={() => handleClickPoolAddress(poolId)}
                    >
                        {isMobile
                            ? shortWalletAddress(poolId ? poolId : '')
                            : poolId}
                    </span>
                </motion.div>
            )
        },

        {
            title: 'Pool Score',
            dataIndex: 'trustScore',
            key: 'trustScore',
            className: '!font-forza',
            sorter: (a: PoolLeaderboardEntry, b: PoolLeaderboardEntry) =>
                BigInt(a.trustScore || '0') > BigInt(b.trustScore || '0')
                    ? 1
                    : -1,
            render: (score: string) => (
                <motion.div
                    className="flex items-center space-x-2 !font-forza"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                >
                    <StarOutlined className="text-blue-500" />
                    <span className="font-bold">{score || '0'}</span>
                </motion.div>
            )
        },
        {
            title: 'Volume',
            dataIndex: 'volume',
            key: 'volume',
            className: '!font-forza',
            sorter: (a: PoolLeaderboardEntry, b: PoolLeaderboardEntry) =>
                BigInt(a.volume || '0') > BigInt(b.volume || '0') ? 1 : -1,
            render: (volume: string) => (
                <span className="font-forza">{volume || '0'}</span>
            )
        },
        {
            title: '24H(%)',
            dataIndex: 'changePrice24h',
            key: 'changePrice24h',
            className: '!font-forza',
            sorter: (a: PoolLeaderboardEntry, b: PoolLeaderboardEntry) => {
                const valA = Number((a.changePrice24h || '0').replace('%', ''));
                const valB = Number((b.changePrice24h || '0').replace('%', ''));
                return valA - valB;
            },

            render: (changePrice24h: string) => (
                <span className="font-forza">{changePrice24h || '0'}</span>
            )
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card
                className="mt-3 w-full "
                bodyStyle={{ padding: 0 }}
            >
                <div className="mt-2 px-4 pt-6">
                    <Row gutter={[10, 10]}>
                        <Col
                            xs={24}
                            sm={24}
                            lg={12}
                            md={12}
                            xxl={12}
                            className="!font-forza"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <h1 className="mb-2 text-2xl font-bold">
                                    Leaderboard
                                </h1>
                                <p className="text-gray-500">
                                    Track your ranking and earn {chainConfig?.currency} tokens
                                    based on your activity
                                </p>
                            </motion.div>
                        </Col>
                        <Col
                            xs={24}
                            sm={24}
                            lg={12}
                            md={12}
                            xxl={12}
                            className="!font-forza"
                        >
                            <motion.div
                                className="mt-4 w-full rounded-lg bg-gray-50 p-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                whileHover={{ scale: 1.01 }}
                            >
                                <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                                    <CalculatorOutlined /> Point Calculation
                                    Formula
                                </h3>

                                <div className="space-y-3 rounded-md border border-gray-200 bg-white p-3 shadow-sm">
                                    <div className="flex items-start gap-2">
                                        <WalletOutlined className="mt-1 text-blue-500" />
                                        <div>
                                            <span className="font-medium">
                                                Wallet Trust Points (TP)
                                            </span>{' '}
                                            =
                                            <code className="ml-1 rounded bg-blue-50 px-1 py-0.5 text-blue-700">
                                                Multiplier (Wallet)
                                            </code>{' '}
                                            ×
                                            <code className="bg-green-50 text-green-700 ml-1 rounded px-1 py-0.5">
                                                Invested Volume
                                            </code>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <DollarCircleOutlined className="mt-1 text-purple-500" />
                                        <div>
                                            <span className="font-medium">
                                                Token Trust Points (TP)
                                            </span>{' '}
                                            =
                                            <code className="ml-1 rounded bg-purple-50 px-1 py-0.5 text-purple-700">
                                                Multiplier (Token)
                                            </code>{' '}
                                            × Σ (
                                            <code className="ml-1 rounded bg-red-50 px-1 py-0.5 text-red-700">
                                                Transaction Volume
                                            </code>{' '}
                                            ×
                                            <code className="ml-1 rounded bg-blue-50 px-1 py-0.5 text-blue-700">
                                                Multiplier (Wallet)
                                            </code>
                                            )
                                        </div>
                                    </div>
                                    <p className="!mt-4 border-t border-gray-100 pt-3 text-xs text-gray-500">
                                        * Multipliers and specific calculation
                                        details may vary.
                                    </p>
                                </div>
                            </motion.div>
                        </Col>
                    </Row>
                </div>

                <div className="px-4 pb-6">
                    <Tabs
                        activeKey={activeTab}
                        onChange={(key) => setActiveTab(key)}
                    >
                        <TabPane
                            tab="Daily Ranking"
                            key="daily"
                            className="!font-forza"
                        >
                            <div className="mb-4 flex justify-end">
                                <DatePicker
                                    value={selectedDate}
                                    className="!font-forza text-base"
                                    onChange={(date) =>
                                        setSelectedDate(date || dayjs.utc())
                                    }
                                    allowClear={false}
                                    disabledDate={
                                        disabledDateGreaterThanCurrent
                                    }
                                />
                            </div>
                            <Tabs
                                activeKey={activeDailySubTab}
                                onChange={setActiveDailySubTab}
                                type="card"
                                size="small"
                                className="mb-4"
                            >
                                <TabPane
                                    tab="Wallet Ranking"
                                    key="wallet"
                                >
                                    {loading ? (
                                        <div className="flex h-64 items-center justify-center">
                                            <Spin size="large" />
                                        </div>
                                    ) : (
                                        <AnimatePresence>
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <Table
                                                    dataSource={userDailyData}
                                                    columns={userColumns}
                                                    rowKey="address"
                                                    pagination={false}
                                                    scroll={{
                                                        x: 'max-content'
                                                    }}
                                                    onRow={(record) => ({
                                                        onClick: () =>
                                                            record.rank === 1 &&
                                                            celebrateTopRank(
                                                                record.address
                                                            ),
                                                        className:
                                                            highlightedUser ===
                                                            record.address
                                                                ? 'bg-yellow-50 transition-colors duration-300'
                                                                : ''
                                                    })}
                                                />
                                            </motion.div>
                                        </AnimatePresence>
                                    )}
                                </TabPane>
                                <TabPane
                                    tab="Token Ranking"
                                    key="token"
                                >
                                    {loading ? (
                                        <div className="flex h-64 items-center justify-center">
                                            <Spin size="large" />
                                        </div>
                                    ) : (
                                        <AnimatePresence>
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <Table
                                                    dataSource={poolDailyData}
                                                    columns={poolColumns}
                                                    rowKey="poolId"
                                                    pagination={false}
                                                    scroll={{
                                                        x: 'max-content'
                                                    }}
                                                />
                                            </motion.div>
                                        </AnimatePresence>
                                    )}
                                </TabPane>
                            </Tabs>
                        </TabPane>

                        <TabPane
                            tab="Weekly Retroactive"
                            key="weekly"
                            className="!font-forza"
                        >
                            <div className="mb-4 flex justify-end">
                                <DatePicker
                                    picker="week"
                                    value={selectedWeek}
                                    className="!font-forza text-base"
                                    onChange={(date) =>
                                        setSelectedWeek(date || dayjs.utc())
                                    }
                                    allowClear={false}
                                    disabledDate={
                                        disabledDateGreaterThanCurrent
                                    }
                                />
                            </div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Tabs
                                    activeKey={activeWeeklySubTab}
                                    onChange={setActiveWeeklySubTab}
                                    type="card"
                                    size="small"
                                    className="mb-4"
                                >
                                    <TabPane
                                        tab="Wallet Ranking"
                                        key="wallet"
                                    >
                                        {loadingWeekly ? (
                                            <div className="flex h-64 items-center justify-center">
                                                <Spin size="large" />
                                            </div>
                                        ) : (
                                            <AnimatePresence>
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{
                                                        duration: 0.3
                                                    }}
                                                >
                                                    <Table
                                                        dataSource={
                                                            userWeeklyData
                                                        }
                                                        columns={userColumns}
                                                        rowKey="address"
                                                        pagination={false}
                                                        scroll={{
                                                            x: 'max-content'
                                                        }}
                                                    />
                                                </motion.div>
                                            </AnimatePresence>
                                        )}
                                    </TabPane>
                                    <TabPane
                                        tab="Token Ranking"
                                        key="token"
                                    >
                                        {loadingWeekly ? (
                                            <div className="flex h-64 items-center justify-center">
                                                <Spin size="large" />
                                            </div>
                                        ) : (
                                            <AnimatePresence>
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{
                                                        duration: 0.3
                                                    }}
                                                >
                                                    <Table
                                                        dataSource={
                                                            poolWeeklyData
                                                        }
                                                        columns={poolColumns}
                                                        rowKey="poolId"
                                                        pagination={false}
                                                        scroll={{
                                                            x: 'max-content'
                                                        }}
                                                    />
                                                </motion.div>
                                            </AnimatePresence>
                                        )}
                                    </TabPane>
                                </Tabs>
                            </motion.div>
                        </TabPane>

                        <TabPane
                            tab="Monthly Retroactive"
                            key="monthly"
                            className="!font-forza"
                        >
                            <div className="mb-4 flex justify-end">
                                <DatePicker
                                    picker="month"
                                    value={selectedMonth}
                                    className="!font-forza text-base"
                                    onChange={(date) =>
                                        setSelectedMonth(date || dayjs.utc())
                                    }
                                    allowClear={false}
                                    disabledDate={
                                        disabledDateGreaterThanCurrent
                                    }
                                />
                            </div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Tabs
                                    activeKey={activeMonthlySubTab}
                                    onChange={setActiveMonthlySubTab}
                                    type="card"
                                    size="small"
                                    className="mb-4"
                                >
                                    <TabPane
                                        tab="Wallet Ranking"
                                        key="wallet"
                                    >
                                        {loadingMonthly ? (
                                            <div className="flex h-64 items-center justify-center">
                                                <Spin size="large" />
                                            </div>
                                        ) : (
                                            <AnimatePresence>
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{
                                                        duration: 0.3
                                                    }}
                                                >
                                                    <Table
                                                        dataSource={
                                                            userMonthlyData
                                                        }
                                                        columns={userColumns}
                                                        rowKey="address"
                                                        pagination={false}
                                                        scroll={{
                                                            x: 'max-content'
                                                        }}
                                                    />
                                                </motion.div>
                                            </AnimatePresence>
                                        )}
                                    </TabPane>
                                    <TabPane
                                        tab="Token Ranking"
                                        key="token"
                                    >
                                        {loadingMonthly ? (
                                            <div className="flex h-64 items-center justify-center">
                                                <Spin size="large" />
                                            </div>
                                        ) : (
                                            <AnimatePresence>
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{
                                                        duration: 0.3
                                                    }}
                                                >
                                                    <Table
                                                        dataSource={
                                                            poolMonthlyData
                                                        }
                                                        columns={poolColumns}
                                                        rowKey="poolId"
                                                        pagination={false}
                                                        scroll={{
                                                            x: 'max-content'
                                                        }}
                                                    />
                                                </motion.div>
                                            </AnimatePresence>
                                        )}
                                    </TabPane>
                                </Tabs>
                            </motion.div>
                        </TabPane>
                    </Tabs>
                </div>
            </Card>
        </motion.div>
    );
};

export default Leaderboard;
