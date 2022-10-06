import { MarkupData, Meta } from 'types/markup';
import { IMarkupService } from '../service/service.interface';
import { IMenuData } from '../menu/menu.interface';

export interface IMarkupRepository {
    id: string;
    type: string;
    isEditable: boolean;
    startTime: number;
    staticTime: number;
    error: string;
    meta: Meta;
    initWithTask(task: MarkupData): Promise<void>;
    setStorageItems(): void;
    removeStorageItems(): void;
    downloadJson(): void;
}

export interface IMarkupViewRepository extends IMarkupRepository {
    initializeWithData?(
        task: MarkupData,
        catalogErrors: IMenuData,
        isEditable?: boolean
    ): Promise<void>;
}

export interface IMarkupRepositoryConstruct {
    new (service: IMarkupService): IMarkupRepository | IMarkupViewRepository;
}
