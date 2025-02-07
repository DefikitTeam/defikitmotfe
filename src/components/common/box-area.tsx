import { ReactNode } from 'react';

interface IBoxArea {
    children: ReactNode;
}

const BoxArea = ({ children, ...rest }: IBoxArea) => {
    return (
        <div
            {...rest}
            className="bg-white"
        >
            <div className="p-3">{children}</div>
        </div>
    );
};

export default BoxArea;
