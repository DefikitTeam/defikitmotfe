/* eslint-disable */

import { CloseCircleFilled, SearchOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import { ChangeEvent, useState } from 'react';

interface SearchProps {
    placeholder?: string;
    fullWidth?: boolean;
    onChange: (query: string) => void;
    className?: string;
}
const SearchComponent = (props: SearchProps) => {
    const [query, setQuery] = useState('');
    // const searchQuery = useDebounce(query, 100);
    const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
        props.onChange(event.target.value);
    };

    const handleOnClearSearch = () => {
        setQuery('');
        props.onChange('');
    };

    return (
        <Input
            className={props.className}
            placeholder={props.placeholder}
            type="text"
            width={props.fullWidth ? '100%' : 'auto'}
            value={query}
            onChange={(event) => handleOnChange(event)}
            // allowClear
            prefix={<SearchOutlined />}
            suffix={
                query && (
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
