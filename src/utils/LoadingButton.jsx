import { useEffect } from 'react';

const LoadingButton = ({
    loading,
    id,
    cssType = 'primary',
    disabled,
    className,
    value,
    ...restProps
}) => {
    useEffect(() => {
        try {
            if (!id) throw new Error('id is required for loading button');

            const myBtn = document.getElementById(id);

            if (!myBtn.classList.contains('btn')) myBtn.classList.add('btn');
            if (!myBtn.classList.contains(`btn-${cssType}`))
                myBtn.classList.add(`btn-${cssType}`);
            if (!myBtn.classList.contains('position-relative'))
                myBtn.classList.add('position-relative');
        } catch (e) {
            console.log(e.message);
        }
    });

    if (disabled === undefined) disabled = loading;
    if (loading !== id) {
        return (
            <button
                className={className}
                id={id}
                disabled={disabled}
                {...restProps}
            >
                {value}
                {restProps.children}
            </button>
        );
    }
    return (
        <button className={className} id={id} disabled {...restProps}>
            <span
                className="position-absolute top-0 start-0 end-0 bottom-0 m-auto spinner-border spinner-border-sm"
                style={{ zIndex: 1 }}
            ></span>
            <span className="opacity-0">{value}</span>
            {restProps.children}
        </button>
    );
};

export default LoadingButton;
