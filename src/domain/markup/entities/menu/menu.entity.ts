import { action, computed, observable } from 'mobx';
import { computedFn } from 'mobx-utils';
import { IMarkupService } from '../service/service.interface';
import {
    ErrorClassification,
    IFormData,
    IMarkupMenu,
    IMenuData,
    Views,
} from './menu.interface';

export class MarkupMenu implements IMarkupMenu {
    @observable
    public view: Views = 'classification';

    @observable
    public error: string = '';

    public allCategories: IMenuData;

    public allOptions: ErrorClassification[];

    public fullTextOptions: ErrorClassification[];

    private readonly initialData: IFormData = {
        id: null,
        code: '',
        subtype: '',
        name: '',
        description: '',
        fragments: [],
        comment: '',
        correction: '',
        explanation: '',
        has_correction: false,
        on_full_text: false,
        disclosure: false,
        hasRelationFragment: false,
    };

    @observable
    public data: IFormData = this.initialData;

    constructor(private service: IMarkupService) {}

    @computed
    public get isCorrection() {
        return this.view === 'correction';
    }

    public isValidCorrection = () => {
        if (this.data.code === 'ИСП' && this.data.correction.length < 1) {
            this.error = 'Заполните поле "Исправление"';
            return false;
        } else {
            this.error = '';
            return true;
        }
    };

    public fragmentsOptions = computedFn(array => {
        let arr = array;
        arr.unshift({
            code: 'Не выбрано',
            description: null,
        });
        return arr;
    }, true);

    public initMenu(data: IMenuData): void {
        this.setAllCategories(data);
        this.setAllOptions();
    }

    private setAllCategories = (data: IMenuData): void => {
        data.forEach(category => {
            category.errors.forEach(e => (e.color = category.color));
            category.sub_categories.forEach(s =>
                s.errors.forEach(e => (e.color = s.color))
            );
        });
        this.allCategories = data;
    };

    private setAllOptions = () => {
        this.allOptions = this.allCategories
            .reduce((acc, { errors, sub_categories }) => {
                errors.forEach(i => acc.push(i));
                sub_categories.forEach(x => x.errors.forEach(y => acc.push(y)));
                return acc;
            }, [])
            .map(option => {
                option.code = option.code.toUpperCase();
                return option;
            });
        this.fullTextOptions = this.allOptions.filter(
            option => option?.on_full_text || option?.disclosure
        );
    };

    @action
    public switchView = (view: Views): void => {
        this.view = view;
    };

    public filteredOptions = computedFn(query => {
        return this.allOptions?.filter(
            option =>
                !option?.on_full_text &&
                !option?.disclosure &&
                option.name.toLowerCase().includes(query.toLowerCase())
        );
    }, true);

    public findOptionByType = (type: string) => {
        return this.allOptions.find(option => option.code === type);
    };

    public save = (): void => {
        const { code, comment, correction, explanation, subtype } = this.data;

        if (
            this.service.selection &&
            this.data.code?.length &&
            this.isValidCorrection()
        ) {
            this.service.selection
                .setType(code)
                .addComment(comment)
                .addExplanation(explanation)
                .addCorrection(correction)
                .addSubType(subtype)
                .setGroup(this.isCorrection ? 'error' : 'meaning');

            this.service.saveSelection();
            this.resetSelf();
        }
    };

    public connect = () => {
        this.service.connector.setClickWaiting(true);
    };

    @action
    public remove = (): void => {
        this.service.removeSelection();
        this.data = this.initialData;
        this.switchView('classification');
    };

    @action
    public resetSelf = (): void => {
        this.data = this.initialData;
        this.switchView('classification');
    };

    @action
    public reset = (): void => {
        this.resetSelf();
        this.service.resetSelection();
        this.error = '';
    };

    @action
    public resetDetail = (): void => {
        this.resetSelf();
        this.service.saveSelection();
    };

    @action
    public setProperty = (prop: string, value: string): void => {
        if (!this.data.hasOwnProperty(prop)) throw Error('undefined property');
        this.data[prop] = value;
    };

    @action
    public setClassification = (option: ErrorClassification): void => {
        Object.assign(this.data, option);
        this.service.selection?.setColor(option.color as string);
        !option.on_full_text && this.service.updateRange();
        this.switchView(option.has_correction ? 'correction' : 'explanation');
    };

    @action
    public assignData = (selection: IFormData): void => {
        this.data = Object.assign(
            this.data,
            this.findOptionByType(selection.type as string),
            selection
        );

        this.switchView('detail');
    };
}
