import { MarkupRepository } from '../repository';
import { IMenuData } from '../../menu/menu.interface';
import { MarkupData } from 'types/markup';

export class MarkupViewRepository extends MarkupRepository {
    public initializeWithData = async (
        task: MarkupData,
        catalogErrors: IMenuData,
        isEditable?: boolean
    ): Promise<void> => {
        this.id = task.id || undefined;
        this.service.init(task);
        this.meta = task.file.meta;
        this.isEditable = isEditable || false;
        this.type = 'markup';
        this.initCatalogErrors(catalogErrors);
        this.service.renderer.setMarkupSelections();
        this.service.renderer.render();
    };
}
