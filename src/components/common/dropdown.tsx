import { DropdownObject } from '@/src/common/constant/constance';
import { Select } from 'antd';
import { useState } from 'react';

const { Option } = Select;
interface Props {
  items: DropdownObject[];
  defaultValue: any;
  width?: string;
  onSelect: (selectedOption: string) => boolean;
}

const CustomSelectOption = (props: Props) => {
  const [value, setValue] = useState('');

  return (
    <Select
      className="h-10 bg-white !font-forza text-black"
      style={{
        width: props.width || '130px',
        border: '1px solid darkgrey',
        borderRadius: '5px'
      }}
      value={value}
      placeholder={props.defaultValue}
      onChange={(value) => {
        if (props.onSelect(value.toString())) {
          setValue(value);
        }
      }}
    >
      <Option
        value=""
        disabled
      >
        <em>{props.defaultValue}</em>
      </Option>
      {props.items.map((item: DropdownObject, key) => (
        <Option
          className="!font-forza"
          value={item.value}
          key={key}
        >
          {item.text}
        </Option>
      ))}
    </Select>
  );
};

export default CustomSelectOption;
