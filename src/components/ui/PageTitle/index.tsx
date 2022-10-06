import React, { FC } from 'react';
import './style.sass';

interface IProps {
    text: string;
    mb?: 'lg' | 'md' | 'sm';
}

const PageTitle: FC<IProps> = ({ text, mb }) => {
    const classList = ['page-title'];

    switch (mb) {
        case 'lg':
            classList.push('page-title--mb-lg');
            break;
        case 'md':
            classList.push('page-title--mb-md');
            break;
        case 'sm':
            classList.push('page-title--mb-sm');
            break;
    }

    return <h1 className={classList.join(' ')}>{text}</h1>;
};

export default PageTitle;
