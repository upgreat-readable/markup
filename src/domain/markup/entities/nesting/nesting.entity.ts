import { computedFn } from 'mobx-utils';
import { action } from 'mobx';
import { IMarkupSelection, ISelection } from '../selection/selection.interface';
import { IMarkupService } from '../service/service.interface';
import { INestingChecker } from './nesting.interface';

export class NestingChecker implements INestingChecker {
    constructor(private service: IMarkupService) {}

    public getTagsLength = (selection: ISelection): number => {
        const { status, id, color } = selection;
        return status === 'selected'
            ? `<em class="range selected" id="${id}"></em>`.length
            : `<mark class="range ${status} range--${color}" id="${id}"></mark>`
                  .length;
    };

    private lastMatchingSelection = computedFn(
        (bounds: [number, number]): ISelection => {
            const [start, end] = bounds;
            return this.service.markupSelections
                .slice()
                .reverse()
                .find(
                    s => s.startSelection === start && s.endSelection === end
                );
        },
        true
    );

    private nestedSelections = computedFn(
        (bounds: [number, number]): ISelection[] => {
            const [start, end] = bounds;
            return this.service.markupSelections.filter(s => {
                return (
                    (s.startSelection >= start && s.endSelection < end) ||
                    (s.startSelection > start && s.endSelection <= end)
                );
            });
        },
        true
    );

    private similarSelections = computedFn(
        (id: number, bounds: [number, number]): ISelection[] => {
            const [start, end] = bounds;
            return this.service.markupSelections.filter(s => {
                return (
                    s.startSelection === start &&
                    s.endSelection === end &&
                    s.id !== id
                );
            });
        },
        true
    );

    private computeDelta = (selections: ISelection[]) => {
        return selections.reduce((acc, n) => {
            acc += this.getTagsLength(n);
            return acc;
        }, 0);
    };

    @action
    public checkNestedFragments = (selection: ISelection): void => {
        const { id, startSelection, endSelection } = selection;

        const bounds: [number, number] = [startSelection, endSelection];

        const rootFragment = this.lastMatchingSelection(bounds);

        const nestedSelections = this.nestedSelections(bounds);

        const similarSelections = this.similarSelections(
            rootFragment.id,
            bounds
        );

        let relativeEnd =
            endSelection +
            this.computeDelta([...nestedSelections, ...similarSelections]);

        if (similarSelections.length && id !== rootFragment.id) {
            relativeEnd -= this.computeDelta(similarSelections);
        }

        selection.relativeEnd = relativeEnd;
    };

    public hasIntersections = (selection: ISelection): number => {
        const { id, startSelection: start1, endSelection: end1 } = selection;
        const firstIntersection = this.service.allSelections
            .filter((s: IMarkupSelection) => id !== s.id)
            .sort((s1: IMarkupSelection, s2: IMarkupSelection) => {
                return s1.startSelection - s2.startSelection;
            })
            .find((s: IMarkupSelection) => {
                const { startSelection: start2, endSelection: end2 } = s;

                const equal = start1 === start2 && end1 === end2;

                const intersectLeft =
                    start1 > start2 && end1 > end2 && start1 < end2;

                const intersectRight =
                    start1 < start2 && end1 < end2 && end1 > start2;

                return equal || intersectLeft || intersectRight;
            });

        return firstIntersection ? firstIntersection.id : null;
    };
}
