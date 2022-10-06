import { MarkupService } from '../service.entity';
import {
    IMarkupSelection,
    ISelection,
    Status,
} from '../../selection/selection.interface';
import { action } from 'mobx';
import { IMarkupService } from '../service.interface';

interface IMarkupServiceWithComparison extends IMarkupService {
    addManySelections(selections: ISelection[]): void;
    checkConflicts(selection: ISelection): number | null;
    clearAllSelections(): void;
}

export class MarkupServiceWithComparison extends MarkupService
    implements IMarkupServiceWithComparison {
    public checkConflicts = (selection: ISelection): number => {
        return this.nestingChecker.hasIntersections(selection);
    };

    @action
    public setDisabledSelections = (ids: Array<number>) => {
        if (this.markupSelections?.length) {
            this.disabledSelections = ids;
            this.renderer.rerender();
        }
    };

    @action
    public addKnownSelection = (selection: ISelection): void => {
        this.setSelection(
            selection.startSelection,
            selection.endSelection,
            Status.DONE
        );

        this.selection.setAllData(selection);

        if (!this.isFragmentExist) {
            this.markup.addSelection(this.selection.result);
            this.renderer.rerender();
        } else {
            this.isFullTextSelection(selection)
                ? this.removeSelection(selection.id)
                : this.unsetSelection();
        }
    };
    @action
    public addManySelections = (selections: ISelection[]): void => {
        this.clearAllSelections();
        selections.forEach(selection => {
            this.markup.addSelection(selection);
        });
        this.renderer.rerender();
    };

    @action
    public clearAllSelections = (): void => {
        this.markupSelections.forEach((selection: IMarkupSelection) => {
            this.markup.removeSelection(selection.id);
        });

        this.generalMistakes.forEach((s: IMarkupSelection) =>
            this.markup.removeSelection(s.id)
        );

        this.markupSelections = [];
        this.renderer.rerender();
    };
}
