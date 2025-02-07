import { useState } from 'react';

export const useModal = () => {
    const [isOpen, setIsOpen] = useState(false);

    function close() {
        setIsOpen(false);
    }

    function open() {
        setIsOpen(true);
    }

    function toggle() {
        setIsOpen(!isOpen);
    }

    return {
        isOpen,
        close,
        open,
        toggle
    };
};
