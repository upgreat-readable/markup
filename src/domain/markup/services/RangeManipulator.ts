import { ISelection } from '../entities/selection/selection.interface';

export interface IRangeManipulator {
    setRange(text: string, selection: ISelection): string;
    surroundText(str: string, selection: ISelection): string;
    modifyRange(
        text: string,
        color: string,
        status: string,
        current?: boolean
    ): string;
    resetModification(
        text: string,
        color: string,
        status: string,
        current?: boolean
    ): string;
}

export default class RangeManipulator implements IRangeManipulator {
    private getModificator = (status: string, color: string) => {
        return `${status} range--${color}`;
    };

    public setRange = (text: string, selection: ISelection): string => {
        const { startSelection, endSelection, relativeEnd } = selection;

        const includedString = text.substring(
            startSelection,
            relativeEnd || endSelection
        );

        const markedNode = this.surroundText(includedString, selection);

        return this.replaceAt(
            text,
            markedNode,
            startSelection,
            includedString.length
        );
    };

    public modifyRange = (
        text: string,
        color: string,
        status: string,
        current: boolean = false
    ): string => {
        const replace = current ? 'selected' : status;
        return text.replace(replace, this.getModificator(status, color));
    };

    public resetModification = (
        text: string,
        color: string,
        status: string
    ) => {
        return text.replace(this.getModificator(status, color), `selected`);
    };

    public replaceAt = (
        text: string,
        replacement: string,
        index: number,
        length: number
    ): string => {
        const prev = text.substring(0, index);
        const next = text.substring(index + length, text.length);
        return prev + replacement + next;
    };

    public surroundText = (str: string, selection: ISelection): string => {
        const { status, id, color } = selection;

        if (status === 'selected') {
            return `<em class="range selected" id="${id}">${str}</em>`;
        } else {
            return `<mark class="range ${status} range--${color}" id="${id}">${str}</mark>`;
        }
    };
}
