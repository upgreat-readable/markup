import Selection from '../selection/Selection';
import { Markup } from 'readable.io_markup/markup/build/markup';
import { MarkupData } from 'types/markup';
import {
    ErrorClassification,
    IMarkupMenu,
    IMarkupMenuConstruct,
} from '../menu/menu.interface';
import { IMarkupSelection, ISelection } from '../selection/selection.interface';
import {
    IMarkupRenderer,
    IMarkupRendererConstruct,
} from '../renderer/renderer.interface';
import {
    IBadgesEntity,
    IBadgesEntityConstruct,
} from '../badges/badge.interface';
import {
    IMarkupRepositoryConstruct,
    IMarkupViewRepository,
} from '../repository/repository.interface';
import {
    INestingChecker,
    INestingCheckerConstruct,
} from '../nesting/nesting.interface';
import {
    IConnector,
    IConnectorConstruct,
} from '../connector/connector.interface';
import {
    IMarkupEstimateConstruct,
    IMarkupEstimate,
} from '../estimates/estimates.interface';

export interface IMarkupService {
    selection: Selection | undefined;
    markupSelections: ISelection[];
    disabledSelections: Array<number>;
    markup: ReturnType<Markup>;
    renderer: IMarkupRenderer;
    badges: IBadgesEntity;
    repository: IMarkupViewRepository;
    connector: IConnector;
    estimate: IMarkupEstimate;
    json: MarkupData;
    menu: IMarkupMenu;
    nestingChecker: INestingChecker;
    isSelected: boolean;
    isTextSelectable: boolean;
    generalMistakes: IMarkupSelection[];
    allSelections: IMarkupSelection[];
    init(task: MarkupData): void;
    isFullTextSelection(selection: ISelection): boolean;
    findSelectionById(id: number): ISelection;
    findSelectionByType(type: string): ISelection;
    createFullTextSelection(selection: ErrorClassification): void;
    clearAllSelections(): void;
    saveSelection(): void;
    checkConflicts(selection: ISelection): number | null;
    addManySelections(selections: ISelection[]): void;
    editSelection(selection: ISelection): void;
    createNewRange(first: number, last: number): void;
    updateRange(): void;
    clearCurrentRange(): void;
    resetSelection(): Promise<void>;
    removeSelection(id?: number): void;
    restoreFragment(id: number): Promise<void>;
    unsetSelection(): void;
}

export interface IMarkupDependencies {
    renderer: IMarkupRendererConstruct;
    repository: IMarkupRepositoryConstruct;
    menu: IMarkupMenuConstruct;
    badges: IBadgesEntityConstruct;
    nestingChecker: INestingCheckerConstruct;
    connector: IConnectorConstruct;
    estimate?: IMarkupEstimateConstruct;
}

export type Class<T> = new (...args: any[]) => T;
