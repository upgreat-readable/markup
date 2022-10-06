import React, { FC, useEffect, useState } from 'react';
import clsx from 'clsx';

type BadgeArrowProps = {
    fill: string;
    position: string;
    isOpacity: boolean;
    clickHandler: any;
};

const colors: { [key: string]: string } = {
    blue: '#65ACE6',
    red: '#F25454',
    green: '#97D159',
};

const BadgeArrow: FC<BadgeArrowProps> = ({
    fill = '#000',
    clickHandler,
    isOpacity,
    position,
}) => {
    const [opacity, setOpacity] = useState<number>(1);

    useEffect(() => {
        setOpacity(isOpacity ? 0.3 : 1);
    }, [isOpacity]);

    return (
        <div style={{ opacity }}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="11"
                height="10"
                viewBox="0 0 11 10"
                className={clsx('badge-arrow', position)}
                fillOpacity={opacity}
                onClick={clickHandler}
            >
                <g fill="none" fillRule="evenodd">
                    <g
                        fill={colors[fill] || fill}
                        fillOpacity={opacity}
                        fillRule="nonzero"
                    >
                        <g>
                            <g>
                                <path
                                    d="M5.414 0l4.707 4.707-4.707 4.707L4 8l3.292-3.293L4 1.414 5.414 0zm-4 0l4.707 4.707-4.707 4.707L0 8l3.292-3.293L0 1.414 1.414 0z"
                                    transform="translate(-636 -637) translate(78 370) translate(558 267)"
                                />
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        </div>
    );
};

export default BadgeArrow;
