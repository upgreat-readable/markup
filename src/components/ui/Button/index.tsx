import React, { FC } from 'react';
import './style.sass';
import { IBaseBtnProps } from '../../../types/button';
import DownloadSpinner from '../DownloadSpinner';

const Button: FC<IBaseBtnProps> = ({
    children,
    handleClick,
    href,
    modifierClass,
    color = 'blue',
    newTab,
    size,
    submit,
    download,
    loading,
    disabled,
}) => {
    const className = `button button--${color} 
                ${modifierClass ? modifierClass : ''}
                ${size ? `button--${size}` : ''}`;

    if (newTab) {
        return (
            <a
                rel="noopener noreferrer"
                target="_blank"
                className={className}
                href={href}
            >
                {children}
            </a>
        );
    }

    if (download) {
        return (
            <a download className={className} href={href}>
                {children}
            </a>
        );
    }

    return (
        <button
            type={submit ? 'submit' : 'button'}
            onClick={handleClick}
            className={className}
            disabled={loading}
        >
            {loading ? <DownloadSpinner text={''} /> : children}
        </button>
    );
};

export default Button;
