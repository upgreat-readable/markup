import {MarkupInterface} from "./interface/markupInterface";
import {SelectionInterface} from "./interface/selectionInterface";


export class Selection {
    /**
     * Входящий объект
     */
    readonly parserJson: MarkupInterface
    /**
     * Результирующий объект
     */
    resultJson: MarkupInterface = {} as MarkupInterface
    private segmentText: Array<object> = []

    indexOffer: number = 0
    private firstText: string = ''

    /**
     * Инициализация
     * @param parserJson
     */
    constructor(parserJson: MarkupInterface, firstText: string) {
        this.parserJson = parserJson
        this.resultJson = this.parserJson
        this.firstText = firstText
        //console.log(this.parserJson.originalText,' ================')
    }

    /**
     * Список секций
     */
    getResult(): Array<SelectionInterface> | undefined {
        if (this.resultJson.selections) {
            return this.resultJson.selections
        } else {
            return [] as Array<SelectionInterface>
        }
    }

    /**
     * Добавление секций
     * @param selection
     */
    addSelection(selection: SelectionInterface): MarkupInterface {
        if (this.resultJson.selections) {
            this.resultJson.selections.push(selection);
        } else {
            this.resultJson.selections = [selection]
        }
        return this.resultJson;
    }

    /**
     * Добавление нескольких секций
     * @param arrSelections
     */
    addManySelection(arrSelections: Array<SelectionInterface>): MarkupInterface {
        arrSelections.forEach((item) => {
            this.addSelection(item)
        });
        return this.resultJson
    }

    /**
     * Удаление секции
     * @param id
     */
    removeSelection(id: number): MarkupInterface {
        this.resultJson = this.parserJson
        if (this.resultJson.selections) {
            for (let i = this.resultJson.selections.length - 1; i >= 0; i--) {
                if (this.resultJson.selections[i].id === id) {
                    this.resultJson.selections.splice(i, 1)
                }
            }
        }
        return this.resultJson;
    }

    /**
     * Исправление секции
     * @param section
     */
    editSelection(section: SelectionInterface): MarkupInterface {
        if (this.resultJson.selections) {
            for (let i = this.resultJson.selections.length - 1; i >= 0; i--) {
                if (this.resultJson.selections[i].id === section.id) {
                    this.resultJson.selections[i] = section
                }
            }
        }
        return this.resultJson;
    }

    /**
     * Выдает текст
     */
    transformToText(): string {
        let markupText: string = this.resultJson.text
        if (this.resultJson.selections) {
            for (let i = this.resultJson.selections.length - 1; i >= 0; i--) {
                //this.createMarkup(section); // это текст нужно втсавить вместое выделенного
            }
        }
        return markupText
    }

    /**
     * Создание строки
     * @param section
     */
    createMarkup(section: SelectionInterface): string {
        let markupString: string = ''
        let countSymbol: number = section.endSelection - section.startSelection

        // console.log(this.parserJson.originalText,' --- this.parserJson.originalText');
        // console.log('**************************************************************************');
        // console.log(this.firstText,' --- firstText');
        // console.log(this.resultJson.originalText,' --- originalText');
        // console.log('**************************************************************************');
        if (countSymbol >= 0) {
            // добавляем subtype
            // if(section.subtype) {
            //     section.type += ' ' + section.subtype
            // }
            //c корреткировкой на добавленный текст
            markupString = this.resultJson.text.substr(section.startSelection + this.indexOffer, countSymbol)
            // вызов нужного метода в заивисоти от типа ошибки
            let methodName: string = section.group + 'GenerateString'; // errorGenerateString || meaningGenerateString
            if (methodName in this) {
                // @ts-ignore
                return this[methodName](section, countSymbol)
            }
        }
        return markupString
    }

    /**
     * Генерация строки с понятием
     * @param section
     * @param countSymbol
     */
    meaningGenerateString(section: SelectionInterface, countSymbol: number): string {
        //смещение текста
        let countAddSymbol: number = this.indexOffer

        // добавляем отрезки в массив
        this.segmentText.push({
            start: section.startSelection,
            end: section.endSelection,
            newlength: 0,
        })

        //проверка на вхождение
        this.segmentText.forEach((couple) => {
            // @ts-ignore
            if (section.startSelection > couple.start && section.endSelection < couple.end) {
                // @ts-ignore
                countAddSymbol = this.indexOffer - couple.newlength + section.type.length + 3
            }
            // @ts-ignore
            if (section.startSelection < couple.start && section.endSelection < couple.end) {
                // console.log('-------------------MIN-------------------');
                // @ts-ignore
                countAddSymbol = this.indexOffer - couple.newlength
            }
        })

        let markupString = this.resultJson.text.substr(section.startSelection + countAddSymbol, countSymbol)
        let oldLengthstr: number = markupString.length
        let generateString: string = '(*' + section.type + section.subtype + '\\' + markupString + '\\' + section.comment + '::' + section.explanation + '>>' + section.correction + '#' + section.tag + '*)'
        let newLengthstr: number = generateString.length

        this.resultJson.text = this.replaceString(markupString, generateString, section.startSelection + countAddSymbol, section.endSelection + countAddSymbol)
        this.indexOffer += newLengthstr - oldLengthstr

        this.segmentText.pop()
        this.segmentText.push({
            start: section.startSelection,
            end: section.endSelection,
            newlength: newLengthstr - oldLengthstr,
        })

        return this.resultJson.text
    }

    /**
     * Генерация строки с ошибкой
     * @param section
     * @param countSymbol
     */
    errorGenerateString(section: SelectionInterface, countSymbol: number): string {
        //смещение текста
        let countAddSymbol: number = this.indexOffer

        // добавляем отрезки в массив
        this.segmentText.push({
            start: section.startSelection,
            end: section.endSelection,
            newlength: 0,
        })
        // console.log('******************************************');
        // console.log(this.segmentText,'this.segmentText - start');
        // console.log(this.indexOffer, ' - this.indexOffer');
        // console.log('__________________________________________');

        //проверка на вхождение
        this.segmentText.forEach((couple) => {
            // console.log(couple,' - couple');

            //Если отрезок влодженный
            // @ts-ignore
            if (section.startSelection > couple.start && section.endSelection < couple.end) {
                // console.log('-------------------INNER-------------------');
                // @ts-ignore
                countAddSymbol = this.indexOffer - couple.newlength + section.type.length + 3
            }

            //Если отрезок перед другим отрезком
            // @ts-ignore
            if (section.startSelection < couple.start && section.endSelection < couple.end) {
                // console.log('-------------------MIN-------------------');
                // @ts-ignore
                countAddSymbol = this.indexOffer - couple.newlength
            }
        })

        let markupString = this.resultJson.text.substr(section.startSelection + countAddSymbol, countSymbol)
        let oldLengthstr: number = markupString.length
        let generateString: string = '(\\' + section.type + section.subtype + '\\' + markupString + '\\' + section.comment + '::' + section.explanation + '>>' + section.correction + '#' + section.tag + '\\)'
        let newLengthstr: number = generateString.length


        // console.log(markupString,' - markupString');
        // console.log(generateString,' - generateString');
        // console.log(countAddSymbol,' - countAddSymbol');
        // console.log(section.startSelection,' - section.startSelection');
        // console.log(section.endSelection,' - section.endSelection');
        this.resultJson.text = this.replaceString(markupString, generateString, section.startSelection + countAddSymbol, section.endSelection + countAddSymbol)
        this.indexOffer += newLengthstr - oldLengthstr

        this.segmentText.pop()
        this.segmentText.push({
            start: section.startSelection,
            end: section.endSelection,
            newlength: newLengthstr - oldLengthstr,
        })
        // console.log('__________________________________________');
        // console.log(this.segmentText,'this.segmentText - end');
        return this.resultJson.text
    }

    /**
     *  Замена текста
     * @param oldString
     * @param newString
     * @param indexStart
     * @param indexEnd
     */
    replaceString(oldString: string, newString: string, indexStart: number, indexEnd: number) {
        return this.resultJson.text.substring(0, indexStart) + newString + this.resultJson.text.substring(indexEnd, this.resultJson.text.length);
    }
}