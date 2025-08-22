import { DeleteOutlined } from '@ant-design/icons';
import { Input, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { ChangeEvent } from 'react';

interface ICreateTypeChatItem {
  index: number;
  title: string;
  content: string;
  onChangeContent: (value: string) => void;
  onDelete: () => void;
}

const { Text } = Typography;
const CreateTypeChatItem = ({
  index,
  title,
  content,
  onChangeContent,
  onDelete
}: ICreateTypeChatItem) => {
  const t = useTranslations();
  const onChange =
    (callback: (value: string) => void) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      callback(event.target.value);
    };

  return (
    <div className="flex flex-row items-start gap-2">
      <div className="flex flex-none max-[470px]:max-w-[100px]">
        <Text className="!font-forza leading-10">
          {`${title}`} {index}:
        </Text>
      </div>
      <div className="flex flex-grow flex-col gap-2">
        <Input
          className="!font-forza placeholder:text-sm"
          placeholder={t('ENTER_YOUR_STYLE_ALL')}
          size="large"
          value={content}
          onChange={onChange(onChangeContent)}
          maxLength={250}
        />
      </div>
      <div></div>

      <DeleteOutlined
        // className={`h-10 text-dust-red ${index === 1 && 'invisible'}`}
        className={`text-dust-red h-10 hover:text-red-500 ${index === 1 && 'invisible'}`}
        disabled={index === 1}
        onClick={onDelete}
      />
    </div>
  );
};

export default CreateTypeChatItem;
