import { IBadgesEntity } from '../badges/badge.interface';
import { IMarkupRenderer } from '../renderer/renderer.interface';
import {
    Class,
    IMarkupDependencies,
    IMarkupService,
} from './service.interface';
import { IMarkupViewRepository } from '../repository/repository.interface';
import { ErrorClassification, IMarkupMenu } from '../menu/menu.interface';
import { INestingChecker } from '../nesting/nesting.interface';
import { IConnector } from '../connector/connector.interface';
import { MarkupData } from 'types/markup';
import { IMarkupEstimate } from '../estimates/estimates.interface';
import {
    IMarkupSelection,
    ISelection,
    Status,
} from '../selection/selection.interface';
import { Markup } from 'domain/markup/services/MarkupPackage/markup';
import { action, computed, observable } from 'mobx';
import { computedFn } from 'mobx-utils';
import Selection from '../selection/Selection';

export class MarkupService implements IMarkupService {
    @observable
    public selection: Selection | undefined;

    @observable
    public markupSelections: ISelection[];

    @observable
    public disabledSelections: Array<number>;

    @observable
    public isInitialized: boolean = false;

    // @ts-ignore
    public markup: ReturnType<Markup>;

    public badges: IBadgesEntity;

    public menu: IMarkupMenu;

    public nestingChecker: INestingChecker;

    public connector: IConnector;

    public renderer: IMarkupRenderer;

    public repository: IMarkupViewRepository;

    public estimate: IMarkupEstimate;

    constructor(dependencies: IMarkupDependencies) {
        this.renderer = this.newInstance(dependencies.renderer);
        this.repository = this.newInstance(dependencies.repository);
        this.badges = this.newInstance(dependencies.badges);
        this.nestingChecker = this.newInstance(dependencies.nestingChecker);
        this.connector = this.newInstance(dependencies.connector);
        this.menu = this.newInstance(dependencies.menu);

        if (dependencies.estimate) {
            this.estimate = this.newInstance(dependencies.estimate);
        }
    }

    private newInstance = <T>(TheClass: Class<T>): T => {
        return new TheClass(this);
    };

    @computed
    public get isSelected() {
        return this.selection instanceof Selection;
    }

    @computed
    public get isTextSelectable() {
        return this.connector.clickWait;
    }

    @computed
    public get json() {
        return this.markup?.getJson() || {};
    }

    @computed
    public get isInit() {
        return this.isInitialized;
    }

    public get allSelections() {
        return this.markup?.getListSelection();
    }

    public get generalMistakes() {
        return this.allSelections?.filter(
            (selection: IMarkupSelection) =>
                !selection.startSelection && !selection.endSelection
        );
    }

    public get isFragmentExist() {
        return this.allSelections?.some((sel: ISelection) => {
            return (
                sel.id === this.selection.id &&
                sel.startSelection === this.selection.startSelection &&
                sel.endSelection === this.selection.endSelection
            );
        });
    }

    public findSelectionById = (id: number) => {
        return this.allSelections.find((selection: ISelection) => {
            return selection.id === id;
        });
    };

    public findSelectionByType = (type: string) => {
        return this.allSelections.find((selection: ISelection) => {
            return selection.type === type;
        });
    };

    public isTagsInside = computedFn((first: number, last: number) => {
        return /<.+>/g.exec(this.renderer.text.substring(first, last));
    }, true);

    private getPreviousOriginalLength = computedFn((index: number): number => {
        const reg = /<("[^"]*?"|'[^']*?'|[^'">])*>/gm;
        const str = this.renderer.text.substring(0, index);
        const originalStr = str.replace(reg, '');
        return originalStr.length;
    }, true);

    public isFullTextSelection = computedFn(
        (selection: ISelection): boolean => {
            return !selection.endSelection && !selection.startSelection;
        },
        true
    );

    @action
    protected setSelection = (
        start: number,
        end: number,
        status: Status = Status.SELECTED,
        id?: number
    ): void => {
        this.selection = new Selection(start, end, status, id);
    };

    @action
    public unsetSelection = () => {
        this.selection = undefined;
    };

    public editSelection = (selection: ISelection): void => {
        this.markup.editSelection(selection);
    };

    public connectFragment = (id: number) => {
        this.connector.connectFragment(id);
    };

    @action
    public init = (data: MarkupData): void => {
        const input = { ...data.file };

        input.selections?.forEach(
            selection => (selection.type = selection.type.toUpperCase())
        );

        this.markup = new Markup(input);

        this.estimate?.init(input);

        this.isInitialized = true;
    };

    public initWithSelections = (selections: ISelection[]) => {
        const resultSelections = selections.map(selection => ({
            ...selection,
            type: selection.type.toUpperCase(),
        }));
        this.addManySelections(resultSelections);
        this.renderer.setMarkupSelections();
        this.renderer.render();
        this.estimate?.update(this.markup.resultJson);
    };

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
    public restoreFragment = async (id: number): Promise<void> => {
        const selection = this.findSelectionById(id);

        await this.resetSelection();

        if (selection) {
            this.setSelection(
                selection.startSelection,
                selection.endSelection,
                Status.FOCUSED
            );
            this.selection.setAllData(selection);
            this.menu.assignData(selection);
            this.markup.removeSelection(selection.id);
            this.renderer.setMarkupSelections();
            this.renderer.render();
        }
    };

    @action
    public saveSelection = (): void => {
        if (this.isFragmentExist) {
            this.markup.editSelection(this.selection.result);
        } else {
            this.markup.addSelection(this.selection.result);
        }
        this.estimate?.update(this.markup.resultJson);
        this.connector.setClickWaiting(false);
        this.renderer.rerender();
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

    @action
    public removeSelection = (id: number = this.selection.id): void => {
        const selection = this.findSelectionById(id) || this.selection;
        this.connector.removeConnection(selection);
        this.resetSelection().catch(console.error);
        this.markup.removeSelection(id);
        this.renderer.rerender();
        this.estimate.update(this.markup.resultJson);
    };

    @action
    private removeUserSelection = (): void => {
        this.markupSelections = this.markupSelections.filter(
            s => s.id !== this.selection.id
        );
    };

    public resetSelection = async (): Promise<void> => {
        if (this.isSelected) {
            if (!this.selection.endSelection) {
                return this.unsetSelection();
            }

            if (
                this.selection.status === Status.SELECTED ||
                !this.selection.type.length
            ) {
                this.clearCurrentRange();
            } else {
                this.saveSelection();
            }
        }
    };

    @action
    public createNewRange = (first: number, last: number): void => {
        const start = this.getPreviousOriginalLength(first);
        const end = this.getPreviousOriginalLength(last);
        this.isSelected && this.saveSelection();
        this.menu.resetSelf();
        this.setSelection(start, end);
        this.renderer.setMarkupSelections();
        this.renderer.render();
    };

    @action
    public createFullTextSelection = (option: ErrorClassification): void => {
        this.isSelected && this.resetSelection();
        this.setSelection(0, 0);
        this.selection.setGroup('error').setType(option.code);
        this.menu.resetSelf();
        this.menu.setClassification(option);
        this.menu.switchView('correction');
    };

    @action
    public clearCurrentRange = (): void => {
        const rangeNode = this.renderer.text?.match(
            /<em[^>]([\s\S]*?)<\/em>/gm
        );
        if (rangeNode) {
            this.connector.setClickWaiting(false);
            this.removeUserSelection();
            this.unsetSelection();
            this.renderer.render();
        }
    };

    @action
    public updateRange = (): void => {
        this.selection.switchStatus(Status.FOCUSED);
        this.renderer.text = this.renderer.modifyRange(
            this.renderer.text,
            this.selection.color,
            this.selection.status,
            true
        );
    };

    @action
    public resetRange = (detail: boolean): void => {
        if (detail) {
            this.renderer.rerender();
        } else {
            this.renderer.text = this.renderer.resetModification(
                this.renderer.text,
                this.selection.color,
                this.selection.status
            );
        }
        this.selection?.switchStatus(Status.SELECTED);
    };
}
