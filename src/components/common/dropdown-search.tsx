/* eslint-disable */
import { KeyValueObj } from '@/src/common/constant/constance';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Select, Tooltip, Typography } from 'antd';
import { useState } from 'react';
interface Props {
    fullWidth?: boolean;
    options: any;
    width?: number;
    height?: number;
    label?: string;
    onChange: (value: any) => void;
    defaultValue?: KeyValueObj;
    valueInput?: KeyValueObj;
    isRequired?: boolean;
    showHelpIcon?: boolean;
    helpInfo?: string;
    disable?: boolean;
}
const { Title } = Typography;

const DropdownWithSearch = (props: Props) => {
    const {
        label,
        onChange,
        options,
        fullWidth,
        height,
        defaultValue,
        valueInput,
        isRequired,
        showHelpIcon,
        helpInfo,
        disable
    } = props;

    //   const [tooltipOpen, setTooltipOpen] = useState(false);
    const [value, setValue] = useState<KeyValueObj | null>(
        defaultValue || valueInput || null
    );
    const handleOnChange = (obj: KeyValueObj | null) => {
        setValue(obj);
        onChange(Number(obj?.key));
    };

    const handleTooltipToggle = (value: boolean) => () => {};

    return (
        <div>
            <div className="flex space-x-2">
                {label && (
                    <Title
                        level={3}
                        className="!font-forza"
                    >
                        {label}
                    </Title>
                )}
                {isRequired && (
                    <Title
                        level={3}
                        className="text-red-500"
                    >
                        *
                    </Title>
                )}
                {showHelpIcon && (
                    <Tooltip
                        title={helpInfo}
                        // de={tooltipOpen}
                        mouseEnterDelay={0}
                    >
                        <QuestionCircleOutlined
                            style={{ fontSize: 'small' }}
                            onClick={handleTooltipToggle(true)}
                        />
                    </Tooltip>
                )}
            </div>

            <Select
                style={{
                    width: fullWidth ? '100%' : '',
                    height: height ? height : '55px',
                    border: '1px solid #D9D9D9',
                    borderRadius: '6px'
                }}
                disabled={disable}
                value={value}
                onChange={(newValue) => handleOnChange(newValue)}
                optionLabelProp="label"
            >
                {options?.map((option: KeyValueObj) => (
                    // @ts-ignore
                    <Option
                        key={option.key}
                        value={option.value}
                        label={option.key}
                    >
                        {option.value}
                    </Option>
                ))}
            </Select>
        </div>
    );
};

export default DropdownWithSearch;
