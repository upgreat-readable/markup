import { action, observable } from 'mobx';
import groupBy from 'lodash.groupby';
import { IMarkupService } from '../service/service.interface';
import { IConnector } from './connector.interface';
import { ISelection } from '../selection/selection.interface';

export class FragmentConnection implements IConnector {
    @observable
    public clickWait: boolean = false;

    constructor(private service: IMarkupService) {}

    @action
    public setClickWaiting = (wait: boolean): void => {
        this.clickWait = wait;
    };

    @action
    public connectFragment = (id: number): void => {
        const connectedSelection = this.service.findSelectionById(id);

        const equalTypes =
            connectedSelection?.type === this.service.selection?.type;

        const reasonUseCase =
            this.service.selection?.type === 'ПРИЧИНА' &&
            connectedSelection?.type === 'СЛЕДСТВИЕ';

        const isFullText = this.service.isFullTextSelection(connectedSelection);

        if ((equalTypes || reasonUseCase) && !isFullText) {
            const tag =
                this.service.selection.tag ||
                connectedSelection.tag ||
                Math.random().toString(36).substring(7);

            this.service.selection.setTag(tag);
            connectedSelection.tag = tag;
            this.service.editSelection(connectedSelection);
            this.service.saveSelection();
            this.clearSingleConnection();
        }
    };

    @action
    public clearSingleConnection = (): void => {
        const withTag = this.service.markupSelections.filter(s => s.tag.length);
        const tags = groupBy(withTag, 'tag');
        Object.keys(tags).forEach(tag => this.clearSingleTag(tags[tag]));
    };

    @action
    private clearSingleTag = (group: ISelection[]): void => {
        if (group.length === 1) {
            group[0].tag = '';
            this.service.editSelection(group[0]);
        }
    };

    @action
    public removeConnection = (selection: ISelection): void => {
        if (selection?.tag.length) {
            const group = this.service.markupSelections.filter(
                s =>
                    s.tag === this.service.selection.tag &&
                    s.id !== this.service.selection.id
            );
            this.clearSingleTag(group);
        }
    };
}
