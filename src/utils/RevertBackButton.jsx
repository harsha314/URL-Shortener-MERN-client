import { useRef, useEffect } from 'react';

const RevertBackButton = ({ cssType = 'light', ...restProps }) => {
    const btnRef = useRef();

    useEffect(() => {
        const btn = btnRef.current;
        const btnList = btn.classList;
        if (!btnList.contains('btn')) btnList.add('btn');
        if (!btn.classList.contains(`btn-${cssType}`))
            btn.classList.add(`btn-${cssType}`);
    });

    return (
        <button ref={btnRef} {...restProps}>
            {'🔙'}
        </button>
    );
};

export default RevertBackButton;
