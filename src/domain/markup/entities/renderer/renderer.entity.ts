import { action, observable } from 'mobx';
import cloneDeep from 'lodash.clonedeep';
import DOMPurify from 'dompurify';
import Selection from '../selection/Selection';
import RangeManipulator from '../../services/RangeManipulator';
import { IMarkupService } from '../service/service.interface';
import { IMarkupRenderer } from './renderer.interface';
import { ISelection, Status } from '../selection/selection.interface';
import { ErrorClassification } from '../menu/menu.interface';

class MarkupRenderer extends RangeManipulator implements IMarkupRenderer {
    @observable
    public text: string = '';

    @observable
    public parsedText: string = '';

    constructor(public service: IMarkupService) {
        super();
    }

    private findColorFromErrors = (type: string) => {
        return this.service.menu.allOptions.find(
            (o: ErrorClassification) => o.code === type
        )?.color;
    };

    private sortSelections = (selections: ISelection[]): ISelection[] => {
        return selections?.sort((s1: ISelection, s2: ISelection) => {
            const isEqual =
                s2.startSelection - s1.startSelection === 0 &&
                s2.endSelection - s1.endSelection === 0;

            const isStartEqual = s2.startSelection - s1.startSelection === 0;

            if (isEqual) return -1;

            if (s1.endSelection && s2.endSelection) {
                return isStartEqual
                    ? s1.endSelection - s2.endSelection
                    : s2.startSelection - s1.startSelection;
            }
        });
    };

    @action
    public setMarkupSelections = (): void => {
        const { selection, isSelected, markup } = this.service;

        const listSelections = cloneDeep(markup.getListSelection());

        if (isSelected) listSelections.push(selection);

        const selections = listSelections
            .filter((s: ISelection) => !this.service.isFullTextSelection(s))
            .map((s: ISelection) => {
                if (!(s instanceof Selection)) {
                    this.service.disabledSelections?.includes(s.id)
                        ? (s.status = Status.DISABLED)
                        : (s.status = Status.DONE);
                }
                s.color = this.findColorFromErrors(s.type);
                return s;
            });

        this.service.markupSelections = this.sortSelections(selections);
    };

    @action
    public rerender = (): void => {
        this.service.unsetSelection();
        this.setMarkupSelections();
        this.render();
    };

    @action
    public render = (): void => {
        const { markup, markupSelections, nestingChecker } = this.service;

        try {
            let text = markup.getJson().text;
            markupSelections.forEach((selection: ISelection) => {
                nestingChecker.checkNestedFragments(selection);
                text = this.setRange(text, selection);
            });

            this.text = DOMPurify.sanitize(text);
            this.parsedText = JSON.stringify(
                markup.getJson(),
                (key, value) => {
                    if (key === 'name' || key === 'criterias') return undefined;
                    return value;
                },
                4
            );
        } catch (e) {
            console.error(e);
            this.text = 'Ошибка визуализации данных';
        }
    };
}

export { MarkupRenderer };
