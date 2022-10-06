import React, { FC } from 'react';
import { observer } from 'mobx-react';
import {
    IBadgeItem,
    IBadgesView,
} from 'domain/markup/entities/badges/badge.interface';
import BadgeItem from './BadgeItem';

const Badges: FC<IBadgesView> = observer(props => {
    const { elements, position, ...rest } = props;
    return (
        <div className={`main-block__badges ${position}`}>
            {elements &&
                Object.keys(elements).map((top, key) => (
                    <div
                        key={key}
                        className="main-block__badges-container"
                        style={{ top: `${top}px` }}
                    >
                        {elements[top].map((item: IBadgeItem) => (
                            <BadgeItem
                                key={item.id}
                                position={position}
                                {...item}
                                {...rest}
                            />
                        ))}
                    </div>
                ))}
        </div>
    );
});

export default Badges;
