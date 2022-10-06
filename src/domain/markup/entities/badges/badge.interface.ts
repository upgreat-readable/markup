import { MouseEvent, MouseEventHandler } from 'react';
import { IMarkupService } from '../service/service.interface';
import { ISelection } from '../selection/selection.interface';

export interface IBadgesEntity {
    elements: {
        [key: string]: IBadgeItem[];
    };
    tags: {
        [key: string]: ISelection[];
    };
    setBadges(parentOffset: number, nodes: Element[]): void;
    clear(): void;
}

export interface IBadgesView {
    elements: { [key: string]: IBadgeItem[] };
    clickHandler: MouseEventHandler;
    isSelected: boolean;
    position: BadgePosition;
    handleHover: (e: MouseEvent<HTMLDivElement>, over: boolean) => void;
    showArrows?: boolean;
}

export type BadgePosition = 'left' | 'right' | 'none';

export interface IBadgeItem {
    id: number;
    title: string;
    color: string;
    tag: string;
    offsetTop: number;
    active: boolean;
    disabled: boolean;
}

export interface IBadgesEntityConstruct {
    new (service: IMarkupService): IBadgesEntity;
}
