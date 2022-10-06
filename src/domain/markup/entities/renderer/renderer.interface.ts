import { IMarkupService } from '../service/service.interface';
import { IRangeManipulator } from '../../services/RangeManipulator';

export interface IMarkupRenderer extends IRangeManipulator {
    text: string;
    parsedText: string;
    service: IMarkupService;
    render(): void;
    rerender(): void;
    setMarkupSelections(): void;
}

export interface IMarkupRendererConstruct {
    new (service: IMarkupService): IMarkupRenderer;
}
