import { MarkupRenderer } from '../renderer.entity';
import { IMarkupService } from '../../service/service.interface';
import { ISelection } from '../../selection/selection.interface';

export class CommentRenderer extends MarkupRenderer {
    constructor(public service: IMarkupService) {
        super(service);
    }

    private addAdditionalInfo = (
        includedString: string,
        selection: ISelection
    ): string => {
        if (
            !selection.correction.length &&
            !selection.comment.length &&
            !selection.explanation.length
        ) {
            return includedString;
        }

        const additionalInfo = [
            { label: 'ИСПРАВЛЕНИЕ', value: selection.correction },
            { label: 'ПОЯСНЕНИЕ', value: selection.explanation },
            { label: 'КОММЕНТАРИЙ', value: selection.comment },
        ];

        const additionalString = additionalInfo.reduce((acc, item) => {
            const itemStr = item.value.length
                ? ` <b>[</b>${item.label}: ${item.value}<b>]</b>`
                : '';
            acc += itemStr;
            return acc;
        }, '');

        return includedString.concat(
            `<span class="range-comment">${additionalString}</span>`
        );
    };

    public setRange = (text: string, selection: ISelection): string => {
        const { startSelection, endSelection, relativeEnd } = selection;

        const includedString = text.substring(
            startSelection,
            relativeEnd || endSelection
        );

        const resultString = this.addAdditionalInfo(includedString, selection);

        const markedNode = this.surroundText(resultString, selection);

        return this.replaceAt(
            text,
            markedNode,
            startSelection,
            includedString.length
        );
    };
}
