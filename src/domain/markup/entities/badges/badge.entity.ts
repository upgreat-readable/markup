import { action, computed, observable } from 'mobx';
import groupBy from 'lodash.groupby';
import Selection from '../selection/Selection';
import { IBadgesEntity, IBadgeItem } from './badge.interface';
import { IMarkupService } from '../service/service.interface';
import { ISelection, Status } from '../selection/selection.interface';
import { ErrorClassification } from '../menu/menu.interface';

export class Badges implements IBadgesEntity {
    @observable
    public elements = {};

    @observable
    public tags = {};

    constructor(private markupService: IMarkupService) {}

    @computed
    private get selections() {
        return this.markupService.markupSelections.slice().reverse();
    }

    @action
    private defineTag = (selection: ISelection) => {
        if (selection.tag.length) {
            const index =
                Object.keys(this.tags).findIndex(tag => tag === selection.tag) +
                1;
            return 'T' + index;
        }
    };

    @action
    private setTags = (): void => {
        const taggedSelections = this.selections.filter(s => s.tag.length);
        this.tags = groupBy(taggedSelections, 'tag');
    };

    private processBadgesData = (parentOffset: number, nodes: Element[]) => {
        const options = this.markupService.menu.allOptions;

        return this.selections
            .map(
                (selection: ISelection): IBadgeItem => {
                    const node = nodes.find(node => +node.id === selection.id);

                    if (!node) return null;

                    const option = options.find(
                        (option: ErrorClassification) =>
                            option.code === selection.type
                    );

                    const offsetTop =
                        node.getBoundingClientRect()?.top - parentOffset;

                    const tag = this.defineTag(selection as ISelection);

                    const active = selection instanceof Selection;

                    const disabled = selection.status === Status.DISABLED;

                    return {
                        id: selection.id,
                        title: option?.name,
                        color: selection.color as string,
                        tag,
                        offsetTop,
                        active,
                        disabled,
                    };
                }
            )
            .filter(badge => Boolean(badge));
    };

    @action
    public setBadges = (parentOffset: number, nodes: Element[]): void => {
        this.setTags();

        try {
            const badges = this.processBadgesData(parentOffset, nodes);
            this.elements = groupBy(badges, 'offsetTop');
        } catch (e) {
            console.error(e);
        }
    };

    @action
    public clear(): void {
        this.elements = {};
    }
}
