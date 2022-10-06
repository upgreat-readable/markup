import { MarkupFile } from 'types/markup';
import { IMarkupService } from '../service/service.interface';

export interface IMarkupEstimate {
    criterions: Record<string, number>;
    grade: number;
    init: (input: MarkupFile) => void;
    update: (input: MarkupFile) => void;
}

export interface IMarkupEstimateConstruct {
    new (service: IMarkupService): IMarkupEstimate;
}
