import {
    ArrowRightOutlined,
    CalendarOutlined,
    CheckCircleFilled,
    CheckSquareOutlined,
    LoginOutlined,
    ShoppingCartOutlined
} from '@ant-design/icons';
import { Button, Card, List, Spin, Tag, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';

const { Title, Text } = Typography;

interface Task {
    id: number;
    descriptionKey: string; 
    completed: boolean;
    icon?: React.ReactNode;
    actionUrl?: string; 
}

const taskIcons: { [key: number]: React.ReactNode } = {
    1: <LoginOutlined />,
    4: <CalendarOutlined />,
    5: <ShoppingCartOutlined />,
    6: <ShoppingCartOutlined />,
    14: <CheckSquareOutlined />
};

const initialTasks: Task[] = [
    { id: 1, descriptionKey: 'TASK_LOGIN_X', completed: false, icon: taskIcons[1] },
    { id: 4, descriptionKey: 'TASK_DAILY_LOGIN', completed: false, icon: taskIcons[4] },
    { id: 5, descriptionKey: 'TASK_PURCHASE_10', completed: false, icon: taskIcons[5] },
    { id: 6, descriptionKey: 'TASK_PURCHASE_20', completed: false, icon: taskIcons[6] },
    { id: 14, descriptionKey: 'TASK_VERIFY_DISCORD', completed: false, icon: taskIcons[14] },
];

const TaskList = () => {
    const t = useTranslations();
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchTaskStatus = async () => {
            setLoading(true);
            try {
                // --- Placeholder for API call ---
                // Example: const userTaskStatus = await yourApi.getUserTaskStatus();
                // const updatedTasks = initialTasks.map(task => ({
                //     ...task,
                //     completed: userTaskStatus[task.id] ?? false,
                // }));
                // setTasks(updatedTasks);
                // --- End Placeholder ---

                // Mock delay and setting some tasks as completed for demonstration
                await new Promise(resolve => setTimeout(resolve, 1200));
                setTasks(prevTasks => prevTasks.map(task =>
                    (task.id === 1 || task.id === 4) ? { ...task, completed: true } : task
                ));

            } catch (error) {
                console.error("Failed to fetch task status:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTaskStatus();
    }, []); 

    const handleGoClick = (task: Task) => {
        console.log(`Navigating or performing action for task ${task.id}...`, task.actionUrl);
    };

    const listItemStyle = {
        transition: 'background-color 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease',
        padding: '12px 16px',
        cursor: 'pointer',
    };

    const listItemHoverStyle = {
        backgroundColor: 'rgba(0, 0, 0, 0.07)', 
        transform: 'scale(1.01)', 
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)', 
    };

    return (
        <Card
            title={<Title level={4} style={{ marginBottom: 0 }}>{t('WALLET_TRUST_POINTS_TASKS')}</Title>}
            style={{ marginBottom: '16px' }}
            bordered={true}
            bodyStyle={{ padding: '0' }}
        >
            {loading ? (
                <div style={{ textAlign: 'center', padding: '30px 0' }}>
                    <Spin size="large" />
                </div>
            ) : (
                <List
                    itemLayout="horizontal"
                    dataSource={tasks}
                    renderItem={(task, index) => {
                        const [isHovered, setIsHovered] = useState(false);
                        return (
                            <List.Item
                                style={{
                                    ...listItemStyle,
                                    ...(isHovered ? listItemHoverStyle : {}),
                                    borderBottom: index === tasks.length - 1 ? 'none' : undefined // Remove bottom border for last item
                                }}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                actions={[
                                    task.completed ? (
                                        <Tag icon={<CheckCircleFilled />} color="success" className="!font-forza m-0">
                                            {t('COMPLETED')}
                                        </Tag>
                                    ) : (
                                        <Button
                                            type="primary"
                                            size="small"
                                            icon={<ArrowRightOutlined />}
                                            onClick={(e) => {
                                                e.stopPropagation(); 
                                                handleGoClick(task);
                                            }}
                                            className="mr-2 !font-forza"
                                        >
                                            {t('GO')}
                                        </Button>
                                    )
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={task.icon ? <span style={{ fontSize: '1.5em', marginRight: '8px' }}>{task.icon}</span> : null}
                                    title={<Text strong className="!font-forza">{`NFT ${task.id}`}</Text>}
                                    description={t(task.descriptionKey)}
                                />
                            </List.Item>
                        );
                    }}
                />
            )}
        </Card>
    );
};

export default TaskList; 