/* eslint-disable */

import { useTrustPointCaller } from '@/src/hooks/useTrustPointCaller';
import serviceTrustPoint from '@/src/services/external-services/backend-server/trust-point';
import { useTrustPoint } from '@/src/stores/trust-point/hook';
import { EActionStatus } from '@/src/stores/type';
import { CheckCircleFilled, InfoCircleOutlined } from '@ant-design/icons';
import {
    Button,
    Card,
    List,
    notification,
    Spin,
    Tag,
    Tooltip,
    Typography
} from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useConfig } from '@/src/hooks/useConfig';

const { Title, Text } = Typography;

interface Task {
    id: number;
    multiplier: number;
    description: string;
    trustPointType: string;
    completed: boolean;
    claimed: boolean;
    reason: string;
}

const TaskList = () => {
    const t = useTranslations();
    const { chainConfig } = useConfig();

    const [hoveredTaskId, setHoveredTaskId] = useState<number | null>(null);
    const { getTrustPointStatusAction, trustPointStatus } = useTrustPoint();
    const [tokenIdProcessClaimed, setTokenIdProcessClaimed] =
        useState<number>(0);
    const router = useRouter();

    const { useMintWithSignature } = useTrustPointCaller();
    const [loadingMintWithSignature, setLoadingMintWithSignature] =
        useState<boolean>(false);

    useEffect(() => {
        if (useMintWithSignature.isLoadingInitMintWithSignature) {
            notification.info({
                message: 'Transaction in Progress',
                description:
                    'Please wait while your transaction is being processed.',
                duration: 1.3,
                showProgress: true
            });
        }
    }, [useMintWithSignature.isLoadingInitMintWithSignature]);

    useEffect(() => {
        if (useMintWithSignature.isLoadingAgreedMintWithSignature) {
            setLoadingMintWithSignature(true);
            notification.info({
                message: 'Transaction in Progress',
                description: 'Please wait while minting your token.',
                duration: 2,
                showProgress: true
            });
        }
    }, [useMintWithSignature.isLoadingAgreedMintWithSignature]);

    useEffect(() => {
        if (useMintWithSignature.isConfirmed) {
            setLoadingMintWithSignature(false);
            notification.success({
                message: 'Transaction Success',
                description: 'Minting token successfully.',
                duration: 1.2,
                showProgress: true
            });
            setTokenIdProcessClaimed(0);

            setTimeout(() => {
                getTrustPointStatusAction();
            }, 1_000);
        }
    }, [useMintWithSignature.isConfirmed]);

    useEffect(() => {
        if (useMintWithSignature.isError) {
            setLoadingMintWithSignature(false);
            setTokenIdProcessClaimed(0);
            notification.error({
                message: 'Transaction Failed',
                duration: 3,
                showProgress: true
            });
        }
    }, [useMintWithSignature.isError]);

    useEffect(() => {
        getTrustPointStatusAction();
    }, []);

    const handleClaimClick = async (task: Task) => {
        setLoadingMintWithSignature(true);
        setTokenIdProcessClaimed(task.id);
        try {
            const signature = await serviceTrustPoint.getSignatureTrustPoint(
                task.id
            );
            if (signature) {
                await useMintWithSignature.actionAsync({
                    id: task.id.toString(),
                    signature: signature.data.signature.toString()
                });
            }
        } catch (err: any) {
            notification.error({
                message: 'Error',
                description: err?.shortMessage || err?.message || 'Error',
                showProgress: true
            });
            setLoadingMintWithSignature(false);
            setTokenIdProcessClaimed(0);
        } finally {
            setLoadingMintWithSignature(false);
            setTokenIdProcessClaimed(0);
        }
    };

    const listItemStyle = {
        transition: 'all 0.3s ease',
        padding: '16px 20px',
        cursor: 'pointer',
        borderRadius: '8px',
        marginBottom: '8px',
        backgroundColor: '#ffffff'
    };

    const listItemHoverStyle = {
        backgroundColor: '#f8f9fa',
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    };

    const getStatusTag = (task: Task) => {
        if (task.claimed) {
            return (
                <Tag
                    icon={<CheckCircleFilled />}
                    color="success"
                    className="m-0 !px-3 !py-1 !font-forza !text-sm"
                >
                    {t('CLAIMED')}
                </Tag>
            );
        }

        if (task.completed) {
            return (
                <Spin
                    spinning={
                        tokenIdProcessClaimed === task.id &&
                        loadingMintWithSignature
                    }
                    delay={0}
                >
                    <Button
                        type="primary"
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleClaimClick(task);
                        }}
                        disabled={
                            tokenIdProcessClaimed !== 0 &&
                            tokenIdProcessClaimed === task.id
                        }
                        className="!h-auto !border-none !bg-[#1677ff] !px-6 !py-1 !font-forza hover:!bg-[#4096ff]"
                    >
                        {t('CLAIM')}
                    </Button>
                </Spin>
            );
        }

        const notCompletedTag = (
            <Tag className="m-0 !border-[#ffa39e] !bg-[#fff1f0] !px-3 !py-1 !font-forza !text-sm !text-[#cf1322]">
                {t('NOT_COMPLETED')}
            </Tag>
        );

        let actionButton = null;
        if (task.id === 2) {
            actionButton = (
                <Button
                    type="primary"
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation();
                        router.push(
                            `/${chainConfig?.name.replace(/\s+/g, '').toLowerCase()}/create-launch`
                        );
                    }}
                    className="ml-2 !h-auto !border-none !bg-[#1890ff] !px-6 !py-1 !font-forza hover:!bg-[#40a9ff]"
                >
                    {t('GO')}
                </Button>
            );
        } else if (task.id === 3) {
            actionButton = (
                <Button
                    type="primary"
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation();
                        router.push(
                            `/${chainConfig?.name.replace(/\s+/g, '').toLowerCase()}/`
                        );
                    }}
                    className="ml-2 !h-auto !border-none !bg-[#1890ff] !px-6 !py-1 !font-forza hover:!bg-[#40a9ff]"
                >
                    {t('GO')}
                </Button>
            );
        }

        return (
            <div className="flex items-center">
                {notCompletedTag}
                {actionButton}
            </div>
        );
    };

    return (
        <Card
            title={
                <Title
                    level={4}
                    className="!mb-0 !font-forza"
                >
                    {t('WALLET_TRUST_POINTS_TASKS')}
                </Title>
            }
            bordered={true}
            bodyStyle={{ padding: '16px' }}
            className="!rounded-lg !border-0 !shadow-md "
        >
            {trustPointStatus.status === EActionStatus.Pending ? (
                <div style={{ textAlign: 'center', padding: '30px 0' }}>
                    <Spin size="large" />
                </div>
            ) : (
                <List
                    itemLayout="horizontal"
                    dataSource={trustPointStatus.data}
                    renderItem={(task: Task, index) => {
                        const [isHovered, setIsHovered] = useState(false);
                        return (
                            <List.Item
                                style={{
                                    ...listItemStyle,
                                    ...(isHovered ? listItemHoverStyle : {})
                                }}
                                onMouseEnter={() => {
                                    setIsHovered(true);
                                    setHoveredTaskId(task.id);
                                }}
                                onMouseLeave={() => {
                                    setIsHovered(false);
                                    setHoveredTaskId(null);
                                }}
                                actions={[getStatusTag(task)]}
                                className="!mb-4 !border-0"
                            >
                                <List.Item.Meta
                                    title={
                                        <div className="flex items-center gap-3">
                                            <Text
                                                strong
                                                className="!font-forza !text-base"
                                            >{`NFT ${task.id}`}</Text>
                                            <Tag className="!m-0 !border-[#91caff] !bg-[#e6f4ff] !px-2 !py-0.5 !font-forza !text-sm !text-[#1677ff]">
                                                x{task.multiplier}
                                            </Tag>
                                            {!task.completed && (
                                                <Tooltip
                                                    title={task.reason}
                                                    placement="right"
                                                >
                                                    <InfoCircleOutlined className="text-[#1677ff] hover:text-[#4096ff]" />
                                                </Tooltip>
                                            )}
                                        </div>
                                    }
                                    description={
                                        <div>
                                            <Text className="!mt-1 !font-forza !text-[#697586]">
                                                {task.description}
                                            </Text>
                                            {!task.completed && (
                                                <div className="mt-1">
                                                    <Text
                                                        type="secondary"
                                                        className="!font-forza !text-sm"
                                                    >
                                                        {task.reason}
                                                    </Text>
                                                </div>
                                            )}
                                        </div>
                                    }
                                />
                            </List.Item>
                        );
                    }}
                    className="!divide-y !divide-gray-100"
                />
            )}
        </Card>
    );
};

export default TaskList;
