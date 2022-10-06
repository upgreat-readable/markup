import { FC } from 'react';
import { subjects } from 'types/markup';
import { IMarkupService } from '../service/service.interface';

export interface IMarkupMenu {
    data: IFormData;
    allOptions: ErrorClassification[];
    fullTextOptions: ErrorClassification[];
    allCategories: IMenuData;
    view: string;
    error: string;
    isCorrection: boolean;
    initMenu(data: IMenuData): void;
    save(): void;
    connect(): void;
    fragmentsOptions(array: MenuFragments): MenuFragments;
    setProperty(prop: string, value: string): void;
    filteredOptions(query: string): ErrorClassification[];
    switchView(view: Views): void;
    reset(): void;
    resetDetail(): void;
    resetSelf(): void;
    remove(): void;
    assignData(selection: IFormData): void;
    setClassification(option: ErrorClassification): void;
}

export type MenuFragments = Array<{ code: string; description: string | null }>;

export type MenuViewsProps = {
    isEditable: boolean;
    isRemovable: boolean;
};

export interface MenuViews {
    [classification: string]: FC<MenuViewsProps>;
    correction: FC<MenuViewsProps>;
    explanation: FC<MenuViewsProps>;
    detail: FC<MenuViewsProps>;
}

export interface IFormData {
    [title: string]: string | boolean | MenuFragments;
    code: string;
    name: string;
    description: string;
    correction: string;
    comment: string;
    explanation: string;
    has_correction: boolean;
    on_full_text: boolean;
    hasRelationFragment: boolean;
    fragments: MenuFragments;
    subtype: string;
}

export interface ErrorClassification {
    id: number;
    name: string;
    code: string;
    description: string;
    has_correction: boolean;
    hasRelationFragment: boolean;
    on_full_text: boolean;
    disclosure: boolean;
    color?: string;
    categoryId?: number;
    order?: number;
    fragments?: unknown[];
}

export type IMenuData = MenuCategory[];

export type Views =
    | 'none'
    | 'classification'
    | 'correction'
    | 'explanation'
    | 'detail';

export interface MenuCategory {
    order?: number;
    active: boolean;
    color: string;
    comment: string;
    errors: ErrorClassification[];
    id: number;
    name: string;
    sub_categories: MenuCategory[];
    subject_code: 'all' | keyof typeof subjects;
}

export interface IMarkupMenuConstruct {
    new (service: IMarkupService): IMarkupMenu;
}
