import useCurrentChainInformation from '@/src/hooks/useCurrentChainInformation';
import { Button } from 'antd';
import { useRouter } from 'next/navigation';

const NotFoundPage = () => {
    const { chainData } = useCurrentChainInformation();
    const router = useRouter();
    return (
        <div className="flex h-screen flex-grow  flex-col items-center justify-center  bg-gray-50">
            <div className="rounded-lg bg-white p-8 text-center shadow-xl">
                <h1 className="mb-4 !font-forza text-4xl font-bold">404</h1>
                <p className="!font-forza text-gray-600">
                    Oops! The page you are looking for could not be found.
                </p>
                <Button
                    type="primary"
                    onClick={() => {
                        router.push(
                            `/${chainData.name.replace(/\s+/g, '').toLowerCase()}`
                        );
                    }}
                    className="mt-4 !font-forza"
                >
                    Go back to Home
                </Button>
            </div>
        </div>
    );
};

export default NotFoundPage;
