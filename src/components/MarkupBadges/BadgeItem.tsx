import React, { FC, Fragment, MouseEvent, MouseEventHandler } from 'react';
import { observer } from 'mobx-react';
import clsx from 'clsx';
import BadgeArrow from 'components/ui/svg-components/BadgeArrow';
import { BadgePosition } from 'domain/markup/entities/badges/badge.interface';

type BadgeItemProps = {
    clickHandler: MouseEventHandler;
    isSelected: boolean;
    position: BadgePosition;
    handleHover: (e: MouseEvent<HTMLDivElement>, over: boolean) => void;
    showArrows?: boolean;
    title: string;
    color: string;
    active: boolean;
    disabled: boolean;
    id: number;
    tag: string;
};

const BadgeItem: FC<BadgeItemProps> = observer(
    ({
        id,
        tag,
        color,
        title,
        active,
        disabled,
        clickHandler,
        isSelected,
        handleHover,
        position,
        showArrows = false,
    }) => {
        const handleMouseOver = (e: MouseEvent<HTMLDivElement>) =>
            handleHover(e, true);

        const handleMouseOut = (e: MouseEvent<HTMLDivElement>) =>
            handleHover(e, false);

        const isArrowsShown = showArrows && !disabled;

        const isOpacity = isSelected && !active;

        const cn = clsx(
            `badge badge--${color}`,
            !title && 'badge--hidden',
            isOpacity && 'opacity',
            active && 'active',
            disabled && 'disabled'
        );

        return (
            <Fragment key={id}>
                <div
                    id={id + ''}
                    className={cn}
                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}
                    onClick={clickHandler}
                >
                    {title} {tag}
                </div>

                {(isArrowsShown && (
                    <BadgeArrow
                        fill={color}
                        isOpacity={isOpacity}
                        position={position}
                        clickHandler={clickHandler}
                    />
                )) ||
                    null}
            </Fragment>
        );
    }
);

export default BadgeItem;
