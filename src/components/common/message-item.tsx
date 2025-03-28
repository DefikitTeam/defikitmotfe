import { DeleteOutlined } from '@ant-design/icons';
import { Col, Input, Row, Typography } from 'antd';
import React, { ChangeEvent } from 'react';

import { useTranslations } from 'next-intl';
import { MessagePair } from '@/src/stores/pool/type';

interface IMessageItem {
    index: number;
    title: string;
    item: MessagePair;
    onChangeUser: (value: string) => void;
    onChangeAgent: (value: string) => void;
    onDelete: () => void;
}

const { Text, Title } = Typography;

const MessageItem = ({
    index,
    title,
    item,
    onChangeUser,
    onChangeAgent,
    onDelete
}: IMessageItem) => {
    const t = useTranslations();

    const onChange =
        (callback: (value: string) => void) =>
        (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            callback(event.target.value);
        };

    return (
        <div className="flex flex-col items-start gap-2 ">
            <div className="relative">
                <span className="absolute left-[-15px] top-1/2 h-2 w-2 -translate-y-1/2 transform rounded-full bg-black"></span>

                <Title
                    level={5}
                    className="mb-0 w-fit !flex-1 text-nowrap text-center font-medium"
                >
                    {`${title}`} {index}:
                </Title>
            </div>

            <Row
                gutter={[8, 8]}
                className="w-full"
            >
                <Col span={24}>
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex w-full flex-col">
                            <Text className="!font-forza leading-10">
                                {`${item[0].user}`} {index}:
                            </Text>
                            <Input
                                className="!font-forza placeholder:text-sm"
                                placeholder={t(
                                    'ENTER_YOUR_EXAMPLE_QUESTION_USER'
                                )}
                                size="large"
                                value={item[0].content.text}
                                onChange={onChange(onChangeUser)}
                            />
                        </div>
                    </div>
                </Col>

                <Col span={24}>
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex w-full flex-col">
                            <Text className="!font-forza leading-10">
                                {`${item[1].user}`} {index}:
                            </Text>
                            <Input
                                className="!font-forza placeholder:text-sm"
                                placeholder={t(
                                    'ENTER_YOUR_EXAMPLE_QUESTION_AGENT'
                                )}
                                size="large"
                                value={item[1].content.text}
                                onChange={onChange(onChangeAgent)}
                            />
                        </div>
                    </div>
                </Col>
                <Col
                    span={24}
                    className="flex items-center justify-between"
                >
                    <div className="flex-grow"></div>
                    <DeleteOutlined
                        // className={`h-10 text-dust-red ${index === 1 && 'invisible'}`}
                        className={`text-dust-red h-10 hover:text-red-500 ${index === 1 && 'invisible'}`}
                        disabled={index === 1}
                        onClick={onDelete}
                    />
                </Col>
            </Row>
        </div>
    );
};

export default MessageItem;
