import React, { FC } from 'react';
import './style.sass';
import preloader from '../../../assets/img/svg/preloader.svg';

interface IProps {
    text?: string;
}

const DownloadSpinner: FC<IProps> = props => {
    const { text } = props;

    return (
        <div className="download-spinner">
            <div className="download-spinner__img">
                <img src={preloader} alt="loading" />
            </div>
            {text}
        </div>
    );
};

DownloadSpinner.defaultProps = {
    text: 'Загрузка',
};

export default DownloadSpinner;
