import React, { FC } from 'react';
import HelpText from 'data/help';
import './style.sass';
import clsx from 'clsx';

const Help: FC<{ type: string; modification?: string }> = ({
    type,
    modification = '',
}) => {
    return (
        <i className="hint">
            <span>?</span>
            <span className={clsx('hint__desc', modification)}>
                {HelpText[type]}
            </span>
        </i>
    );
};

export default Help;
