import { Typography } from 'antd';
import { useTranslations } from 'next-intl';

const { Text } = Typography;
import Image from 'next/image';
interface EmptyPoolProps {
    message?: string;
}
const EmptyPool = ({ message }: EmptyPoolProps) => {
    const t = useTranslations();
    return (
        <div className="flex flex-col items-center">
            <Image
                src={'/images/no_data.png'}
                alt={'no_data'}
                width={300}
                height={300}
            />
            <Text className="mt-6 text-xl font-medium text-black-45">
                {message ? t(message) : t('NO_DATA')}
            </Text>
        </div>
    );
};

export default EmptyPool;
