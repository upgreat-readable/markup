import { MouseEvent, MutableRefObject } from 'react';
import { BadgePosition } from 'domain/markup/entities/badges/badge.interface';
import { IMarkupService } from 'domain/markup/entities/service/service.interface';
import { IMarkupSelection } from '../domain/markup/entities/selection/selection.interface';

export enum subjects {
    'rus' = 'Русский язык',
    'lit' = 'Литература',
    'social' = 'Обществознание',
    'hist' = 'История',
    'eng' = 'Английский язык',
    'rus-free' = 'Произвольное эссе на русском языке',
    'eng-free' = 'Произвольное эссе на английском языке',
}

export interface Meta {
    uuid?: string;
    id?: string;
    name: string;
    category: string;
    class: string;
    subject: keyof typeof subjects;
    test: string;
    theme: string;
    year: number;
    taskText: string;
}

export interface MarkupFile {
    text: string;
    meta?: Meta;
    criteria?: any;
    selections: IMarkupSelection[];
}

export interface MarkupData {
    criterias?: unknown;
    date?: string;
    file: MarkupFile;
    id?: string;
    time?: number;
    type?: string;
    canEditFile?: boolean;
}

export interface IMarker {
    markUp: IMarkupService;
    showArrows?: boolean;
    badgePosition?: BadgePosition;
    ref?: MutableRefObject<HTMLDivElement>;
    clickHandler(e: MouseEvent, markup?: IMarkupService): void;
    badgeClickHandler(e: MouseEvent, markup?: IMarkupService): void;
}
