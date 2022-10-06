import {MarkupInterface} from "../interface/markupInterface";
import {Params} from "../interface/params";
import {CriteriaInterface} from "../interface/criteriaInterface";

export class CriteriaProduct implements Params {
    /**
     * Входящий объект
     */
    readonly parserJson: MarkupInterface
    /**
     * Результирующий объект
     */
    // @ts-ignore
    resultJson: CriteriaInterface | undefined

    /**
     * Инициализация
     * @param parserJson
     */
    constructor(parserJson: MarkupInterface) {
        this.parserJson = parserJson
        // this.parserJson = {
        //     originalText: "Подтип ошибки или комментарий кратко объясняет учащемуся суть ошибки. Для каждого типа ошибок в классификаторе предусмотрено несколько подтипов. Каждому подтипу соответствует свой стандартный комментарий (то есть подтип ошибки – это, по сути, аббревиатура для стандартного комментария). Если эксперт считает, что ни один из стандартных комментариев не подходит для данного случая, то он может записать свой комментарий. Текст комментария должен быть лаконичным и называть типовую ошибку, встречающуюся во многих работах. Комментарий не должен обращаться к тексту данной работы."
        // };
        this.resultJson = this.parserJson.criterias;
    }

    /**
     * Добавляем значение
     * @param value
     */
    public add(value: string | number): CriteriaInterface {
        // @ts-ignore
        const criteriaLength = this.resultJson.length
        const criteriaNumber = 'K' + criteriaLength
        if (this.resultJson) {
            this.resultJson[criteriaNumber] = value
        }
        return {} as CriteriaInterface;
    }

    /**
     * Редактируим значения
     * @param key
     * @param value
     */
    public edit(key: string, value: string | number): CriteriaInterface {
        // @ts-ignore
        if (this.resultJson[key]) {
            // @ts-ignore
            this.resultJson[key] = value
        }
        return {} as CriteriaInterface;
    }

    /**
     * Удаляем значения
     * @param key
     */
    remove(key: string): CriteriaInterface {
        // @ts-ignore
        if (this.resultJson[key]) {
            // @ts-ignore
            this.resultJson[key] = null
        }
        return {} as CriteriaInterface;
    }

    /**
     * Критерии по ключу
     * @param key
     */
    get(key: string): number | string {
        // @ts-ignore
        if (this.resultJson[key]) {
            // @ts-ignore
            return this.resultJson[key]
        }
        return ''
    }

    /**
     * Вернуть json
     */
    getResult() {
        if(this.resultJson) {
            return this.resultJson
        } else {
            return {} as CriteriaInterface
        }
    }

    /**
     * Выдает текст
     */
    transformToText():string {
        let creteriaText: string = '';
        for (let key in this.resultJson) {
            if(this.resultJson.hasOwnProperty(key)) {
                creteriaText = creteriaText + key + ': ' + this.resultJson[key] + '\n'
            }
        }
        return creteriaText + '\n';
    }
}