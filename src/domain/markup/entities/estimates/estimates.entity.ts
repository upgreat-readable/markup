import { AbstractProcessor } from '@upgreat-readable/criteria/build/estimate/subj-processors/abstractProcessor';
import CriterionFabric from '@upgreat-readable/criteria';
import { MarkupFile } from 'types/markup';
import { action, computed, observable } from 'mobx';
import { IMarkupEstimate } from './estimates.interface';

export class MarkupEstimate implements IMarkupEstimate {
    @observable
    public criterions: Record<string, number> = {};

    private criterionProcessor: AbstractProcessor;

    @computed
    public get grade(): number {
        if (!this.criterions) return 0;

        return Object.values(this.criterions).reduce(
            (prev, current) => prev + current,
            0
        );
    }

    public init(input: MarkupFile) {
        if (input.meta?.subject) {
            this.criterionProcessor = new CriterionFabric(
                input
            ).decisionCriterionClass(input.meta.subject, true);

            this.criterions = this.criterionProcessor.analyze();
        }
    }

    @action
    public update(markupJson: MarkupFile) {
        try {
            // @ts-ignore
            this.criterionProcessor?.updateMarkupData(markupJson);
            this.criterions = this.criterionProcessor.analyze();
        } catch (e) {
            console.error(e);
        }
    }
}
