import React, { FC } from 'react';
import './style.sass';
import ArrowLinkAboveTitle from '../svg-components/ArrowLinkAboveTitle';

interface IProps {
    href?: string;
    text: string;
}

const LinkAboveTitle: FC<IProps> = ({ href, text }) => {
    return (
        <div className="link-above-title">
            <ArrowLinkAboveTitle />
            <div className="link-above-title__text">{text}</div>
        </div>
    );
};

export default LinkAboveTitle;
