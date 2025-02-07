/* eslint-disable */
import { Button, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
const { Text } = Typography;
const NotLogin = () => {
    const router = useRouter();
    const t = useTranslations();
    return (
        <div className="flex h-screen flex-grow  flex-col items-center justify-center  bg-gray-50">
            <div className="items-center justify-center rounded-lg bg-white  p-8 text-center  shadow-xl">
                <h1 className="mb-4 !font-forza text-4xl font-bold">401</h1>
                <p className="!font-forza text-lg text-gray-600">
                    You need to log in to access this page
                </p>
                <Button
                    type="primary"
                    onClick={() => {
                        router.back();
                    }}
                    className="mt-4 !font-forza"
                >
                    Go back to Home
                </Button>
            </div>
        </div>
    );
};

export default NotLogin;
