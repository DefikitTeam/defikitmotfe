/* eslint-disable */

import { CloseCircleFilled, SearchOutlined } from '@ant-design/icons';
import { Button, Input, notification } from 'antd';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';
import { useAccount } from 'wagmi';

interface SearchProps {
    placeholder?: string;
    fullWidth?: boolean;
    onChange: (query: string) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    className?: string;
    onClear?: () => void;
    value?: string;
}
const SearchComponent = (props: SearchProps) => {
    const [query, setQuery] = useState('');
    // const searchQuery = useDebounce(query, 100);
    const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
        props.onChange(event.target.value);
    };
    const router = useRouter();
    const t = useTranslations();

    const { isConnected, address } = useAccount();
    const handleOnClearSearch = () => {
        if (isConnected && address) {
            setQuery('');
            props.onChange('');
            props.onClear?.();
        } else {
            notification.error({
                message: 'Error',
                description: t('PLEASE_CONNECT_WALLET'),
                duration: 2,
                showProgress: true
            });
            return;
        }
    };

    return (
        <Input
            className={props.className}
            placeholder={props.placeholder}
            type="text"
            width={props.fullWidth ? '100%' : 'auto'}
            value={props.value || query}
            onChange={(event) => handleOnChange(event)}
            // allowClear
            onKeyDown={props.onKeyDown}
            prefix={<SearchOutlined />}
            suffix={
                (props.value || query) && (
                    <Button
                        icon={
                            // <CloseCircleOutlined
                            //     style={{
                            //         color: 'white',
                            //         // backgroundColor: 'gray'
                            //     }}
                            // />
                            <CloseCircleFilled
                                twoToneColor={'707070'}
                                style={{ fontSize: '20px' }}
                            />
                        }
                        onClick={handleOnClearSearch}
                        className="cursor-pointer"
                        style={{
                            border: 'none',
                            // backgroundColor: 'gray',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    />
                )
            }
            style={{ fontFamily: 'forza' }}
        />
    );
};

export default SearchComponent;
