import React, { useState } from 'react';
import NotificationIcon from 'assets/img/svg/notification.svg';
import './style.sass';

const Notification = () => {
    const [show, toggleShow] = useState<boolean>(true);

    const handleClick = () => {
        const notificationCounter = sessionStorage.getItem(
            'browserNotification'
        );

        const counter = !notificationCounter ? 1 : +notificationCounter + 1;

        sessionStorage.setItem('browserNotification', counter + '');

        toggleShow(false);
    };

    return (
        <>
            {show && (
                <div className="notification">
                    <div className="notification__content">
                        <div className="notification__img">
                            <img src={NotificationIcon} alt="notification" />
                        </div>
                        <div className="notification__text">
                            Для корректной работы сайта рекомендуем открыть его
                            в&nbsp;Google Chrome
                        </div>
                    </div>
                    <div
                        className="notification__close"
                        onClick={handleClick}
                    />
                </div>
            )}
        </>
    );
};

export default Notification;
