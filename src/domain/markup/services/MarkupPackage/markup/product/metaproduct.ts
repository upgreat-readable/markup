import {MarkupInterface} from "../interface/markupInterface";
import {Params} from "../interface/params";
import {MetaInterface} from "../interface/metaInterface";

export class MetaProduct implements Params {
    /**
     * Входящий объект
     */
    readonly parserJson: MarkupInterface
    /**
     * Результирующий объект
     */
    resultJson: MetaInterface = {} as MetaInterface

    /**
     * Инициализация
     * @param parserJson
     */
    constructor(parserJson: MarkupInterface) {
        this.parserJson = parserJson
        // this.parserJson = {
        //     meta: {
        //         theme: 'topic',
        //         class: 11,
        //         year: 2020,
        //         subject: 'subject',
        //         test: 'test',
        //         category: 'category',
        //         expert: 'expert',
        //         timeMarkup: 'timeMarkup',
        //         timeSecondMarkup: 'timeSecondMarkup',
        //     },
        //     originalText: "Подтип ошибки или комментарий кратко объясняет учащемуся суть ошибки. Для каждого типа ошибок в классификаторе предусмотрено несколько подтипов. Каждому подтипу соответствует свой стандартный комментарий (то есть подтип ошибки – это, по сути, аббревиатура для стандартного комментария). Если эксперт считает, что ни один из стандартных комментариев не подходит для данного случая, то он может записать свой комментарий. Текст комментария должен быть лаконичным и называть типовую ошибку, встречающуюся во многих работах. Комментарий не должен обращаться к тексту данной работы."
        // };
        if (this.parserJson.meta) {
            this.resultJson = this.parserJson.meta
        }
    }

    /**
     * Добавляем значение
     * @param value
     */
    public add(value: any): MetaInterface {
        throw Error('Нельзя добавлять новый элемент в Meta, т.к. колво параметров статично')
    }

    /**
     * Редактируим значения
     * @param key
     * @param value
     */
    public edit(key: string, value: MetaInterface): MetaInterface {
        // @ts-ignore
        if (this.resultJson[key]) {
            // @ts-ignore
            this.resultJson[key] = value
        }

        return this.resultJson;
    }

    /**
     * Удаляем значения
     * @param key
     */
    remove(key: string): MetaInterface {
        // @ts-ignore
        if (this.resultJson[key]) {
            // @ts-ignore
            this.resultJson[key] = null
        }
        return {} as MetaInterface;
    }

    /**
     * Получить meta по key
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
        return this.resultJson
    }


    /**
     * Выдает текст
     */
    transformToText(): string {
        let metaText: string = '';
        for (let key in this.resultJson) {
            if (this.resultJson.hasOwnProperty(key)) {
                // @ts-ignore
                metaText = metaText + key + ' ' + this.resultJson[key] + '\n'
            }
        }
        return metaText + '\n';
    }
}