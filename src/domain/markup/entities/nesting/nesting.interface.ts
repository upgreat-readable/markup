import { IMarkupService } from '../service/service.interface';
import { ISelection } from '../selection/selection.interface';

export interface INestingChecker {
    getTagsLength(selection: ISelection): number;
    checkNestedFragments(selection: ISelection): void;
    hasIntersections(selection: ISelection): number;
}

export interface INestingCheckerConstruct {
    new (service: IMarkupService): INestingChecker;
}
