export interface IMarkupSelection {
    id: number;
    startSelection: number;
    endSelection: number;
    comment: string;
    correction: string;
    explanation: string;
    tag: string;
    type: string;
    subtype: string;
    group: 'error' | 'meaning';
}

export interface ISelection extends IMarkupSelection {
    [key: string]: string | number | boolean;
    color: string;
    relativeEnd: number;
    status: string;
}

export interface SelectionBuilder {
    color: string;
    relativeEnd: number;
    status: Status;
    setType(type: string): SelectionBuilder;
    addSubType(subtype: string): SelectionBuilder;
    addComment(comment: string): SelectionBuilder;
    addExplanation(explanation: string): SelectionBuilder;
    addCorrection(correction: string): SelectionBuilder;
    setGroup(group: string): SelectionBuilder;
}

export enum Status {
    SELECTED = 'selected',
    FOCUSED = 'focused',
    DISABLED = 'disabled',
    DONE = 'done',
}
