import { useConfig } from '@/src/hooks/useConfig';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';

const Footer = () => {
    const router = useRouter();
    const { address, isConnected } = useAccount();
    const t = useTranslations();

    const { chainConfig } = useConfig();
    const handlePortfolioClick = () => {
        // if (isConnected && address) {
        router.push(
            `/${chainConfig?.name.replace(/\s+/g, '').toLowerCase()}/profile/address/${address}`
        );
        // } else {
        //     notification.error({
        //         message: 'Error',
        //         description: t('PLEASE_CONNECT_WALLET'),
        //         duration: 2,
        //         showProgress: true
        //     });
        //     return;
        // }
    };
    const handleClickCreateLaunch = () => {
        // if (isConnected && address) {
        router.push(
            `/${chainConfig?.name.replace(/\s+/g, '').toLowerCase()}/create-launch`
        );
        // } else {
        //     notification.error({
        //         message: 'Error',
        //         description: t('PLEASE_CONNECT_WALLET'),
        //         duration: 2,
        //         showProgress: true
        //     });
        //     return;
        // }
    };
    // const handleClickFaucet = () => {
    //     if (isConnected && address) {
    //         router.push(
    //             `/${chainData.name.replace(/\s+/g, '').toLowerCase()}/faucet`
    //         );
    //     } else {
    //         notification.error({
    //             message: 'Error',
    //             description: t('PLEASE_CONNECT_WALLET'),
    //             duration: 2,
    //             showProgress: true
    //         });
    //         return;
    //     }
    // };
    // const handleClickAgents = () => {
    //     if (!isConnected) {
    //         notification.error({
    //             message: 'Error',
    //             description: t('PLEASE_CONNECT_WALLET'),
    //             duration: 2,
    //             showProgress: true
    //         });
    //         return;
    //     }
    // };
    const handleClickCommunity = () => {
        // if (!isConnected) {
        // notification.error({
        //     message: 'Error',
        //     description: t('PLEASE_CONNECT_WALLET'),
        //     duration: 2,
        //     showProgress: true
        // });
        // return;
        // }
    };

    return (
        <div>
            <div className="h-20 bg-white"></div>
            <div className="fixed bottom-0 left-0 z-50 h-16 w-full border-t border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-700">
                <div
                    className={` mx-auto grid h-full max-w-lg cursor-pointer grid-cols-4 font-medium`}
                >
                    <div
                        className="group inline-flex flex-col items-center justify-center border-x border-gray-200 px-5 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
                        onClick={() =>
                            router.push(
                                `/${chainConfig?.name.replace(/\s+/g, '').toLowerCase()}`
                            )
                        }
                    >
                        <svg
                            className="mb-2 h-5 w-5 text-gray-500 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                        </svg>
                        <span className="text-sm text-gray-500 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-500">
                            Home
                        </span>
                    </div>

                    <div
                        className="group inline-flex cursor-pointer flex-col items-center justify-center border-x border-gray-200 px-5 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
                        onClick={handleClickCreateLaunch}
                    >
                        <svg
                            className="mb-2 h-5 w-5 text-gray-500 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 1v16M1 9h16"
                            />
                        </svg>
                        <span className="text-sm text-gray-500 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-500">
                            Create
                        </span>
                    </div>
                    <div
                        className="group inline-flex cursor-pointer flex-col items-center justify-center border-x border-gray-200 px-5 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
                        // onClick={() => router.push(`/profile/address/`)}
                        onClick={handlePortfolioClick}
                    >
                        <svg
                            className="mb-2 h-5 w-5 text-gray-500 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M11.074 4 8.442.408A.95.95 0 0 0 7.014.254L2.926 4h8.148ZM9 13v-1a4 4 0 0 1 4-4h6V6a1 1 0 0 0-1-1H1a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h17a1 1 0 0 0 1-1v-2h-6a4 4 0 0 1-4-4Z" />
                            <path d="M19 10h-6a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1Zm-4.5 3.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2ZM12.62 4h2.78L12.539.41a1.086 1.086 0 1 0-1.7 1.352L12.62 4Z" />
                        </svg>
                        <span className="text-sm text-gray-500 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-500">
                            Portfolio
                        </span>
                    </div>

                    <div
                        className="group inline-flex cursor-pointer flex-col items-center justify-center border-x border-gray-200 px-5 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
                        onClick={handleClickCommunity}
                    >
                        <a
                            // href={'https://discord.com/invite/jQCFDYMrU9'}
                            href="https://linktr.ee/rocket.launch"
                            target="_blank"
                            className={`group inline-flex flex-col items-center justify-center border-gray-200 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800`}
                        >
                            <svg
                                className="mb-2 h-5 w-5 text-gray-500 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-500"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                                />
                            </svg>
                            <span className="text-sm text-gray-500 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-500">
                                Community
                            </span>
                        </a>
                    </div>

                    {/* {chainData.onFaucet && (
                        <div
                            className="group inline-flex cursor-pointer flex-col items-center justify-center border-x border-gray-200 px-5 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
                            onClick={handleClickFaucet}
                        >
                            <svg
                                viewBox="0 0 512 512"
                                className="h- mb-2 h-5 w-5 text-gray-500 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-500"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                            >
                                <g>
                                    <g>
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M436.87,279.474v-147.3c0-11.526-9.343-20.87-20.87-20.87H272.582c-12.143-12.728-27.498-21.451-44.408-25.407V41.739
			h20.87c11.528,0,20.87-9.344,20.87-20.87S260.57,0,249.043,0h-41.739h-41.739c-11.524,0-20.87,9.344-20.87,20.87
			s9.345,20.87,20.87,20.87h20.87v44.159c-16.91,3.955-32.264,12.679-44.408,25.407h-59.94c-11.524,0-20.87,9.344-20.87,20.87
			v83.478c0,11.526,9.345,20.87,20.87,20.87h59.94c16.988,17.805,40.241,27.826,65.277,27.826c25.038,0,48.291-10.022,65.277-27.826
			h39.071v42.952c-8.1,2.867-13.913,10.574-13.913,19.656c0,11.526,9.345,20.87,20.87,20.87h13.913H416h13.913
			c11.527,0,20.87-9.344,20.87-20.87C450.783,290.048,444.971,282.343,436.87,279.474z"
                                        />
                                    </g>
                                </g>
                                <g>
                                    <g>
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M389.359,368.2c-3.937-4.127-9.394-6.461-15.098-6.461s-11.158,2.335-15.098,6.461
			c-11.143,11.677-47.51,52.044-47.51,81.191c0,34.522,28.088,62.609,62.609,62.609s62.609-28.088,62.609-62.609
			C436.87,420.245,400.502,379.878,389.359,368.2z"
                                        />
                                    </g>
                                </g>
                            </svg>

                            <span className="text-sm text-gray-500 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-500">
                                Faucet
                            </span>
                        </div>
                    )} */}
                </div>
            </div>
        </div>
    );
};

export default Footer;
