import cogoToast from 'cogo-toast';
import { MarkupData, Meta } from 'types/markup';
import { IMarkupRepository } from './repository.interface';
import { IMarkupService } from '../service/service.interface';
import { IMenuData } from '../menu/menu.interface';
import FileSaver from 'file-saver';
import errors from 'data/errors';

export class MarkupRepository implements IMarkupRepository {
    public id: string;
    public meta: Meta = {} as Meta;
    public startTime: number = 0;
    public type: 'markup' | 'no-markup';
    public isEditable: boolean;
    public staticTime: number = 0;
    public error: string;

    constructor(protected service: IMarkupService) {}

    public initCatalogErrors = (data: IMenuData) => {
        this.service.menu.initMenu(data);
    };

    public initWithTask = async (task: MarkupData): Promise<void> => {
        this.service.init(task);
        this.meta = task.file.meta;
        this.type = 'no-markup';
        this.isEditable = true;
        await this.service.resetSelection();
        this.initCatalogErrors(errors[task.file.meta.subject]);
        this.service.renderer.setMarkupSelections();
        this.service.renderer.render();
    };

    public downloadJson = () => {
        try {
            const payload = {
                ...this.service.json,
                criteria: this.service.estimate.criterions,
            };
            delete payload.criterias;

            const blob = new Blob([JSON.stringify(payload, null, 2)], {
                type: 'application/json',
            });

            const fileName = `markup-${
                this.meta.subject || ''
            }-${new Date().toLocaleDateString()}.json`;

            FileSaver.saveAs(blob, fileName);
        } catch (e) {
            cogoToast.error('Ошибка при создании файла');
            console.error(e);
        }
    };

    public setStorageItems = (): void => {
        localStorage.getItem(this.id)
            ? sessionStorage.setItem('openSession_' + this.id, this.id)
            : localStorage.setItem(this.id, 'true');
    };

    public removeStorageItems = (): void => {
        !sessionStorage.getItem('openSession_' + this.id)
            ? localStorage.removeItem(this.id)
            : sessionStorage.removeItem('openSession_' + this.id);
    };
}
