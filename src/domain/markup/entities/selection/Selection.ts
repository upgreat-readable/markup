import { action, computed, observable } from 'mobx';
import { ISelection, SelectionBuilder, Status } from './selection.interface';

class Selection implements SelectionBuilder {
    public id: number;
    public startSelection: number;
    public endSelection: number;
    public type: string = '';
    public subtype: string = '';
    public comment: string = '';
    public explanation: string = '';
    public correction: string = '';
    public tag: string = '';
    public group: string = '';

    @observable
    public color: string = '';
    @observable
    public relativeEnd: number = null;
    @observable
    public status: Status;

    constructor(start: number, end: number, status: Status, id?: number) {
        this.id = id || Math.floor(Math.random() * 10000);
        this.startSelection = start;
        this.endSelection = end;
        this.status = status;
    }

    @computed
    public get result() {
        const { color, relativeEnd, status, ...result } = { ...this };
        return result;
    }

    @action
    public switchStatus = (status: Status): void => {
        this.status = status;
    };

    @action
    public setColor = (color: string): Selection => {
        this.color = color;
        return this;
    };

    setType(type: string): Selection {
        this.type = type;
        return this;
    }

    addSubType(subtype: string): Selection {
        this.subtype = subtype;
        return this;
    }

    addComment(comment: string): Selection {
        this.comment = comment;
        return this;
    }

    addExplanation(explanation: string): Selection {
        this.explanation = explanation;
        return this;
    }

    addCorrection(correction: string): Selection {
        this.correction = correction;
        return this;
    }

    setTag(tag: string): Selection {
        this.tag = tag;
        return this;
    }

    setGroup(group: 'error' | 'meaning'): Selection {
        this.group = group;
        return this;
    }

    setAllData = (data: ISelection): void => {
        const { startSelection, endSelection, status, ...meta } = data;
        // @ts-ignore
        Object.keys(meta).forEach((key: string) => (this[key] = data[key]));
    };
}

export default Selection;
