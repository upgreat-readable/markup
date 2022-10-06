import { MarkupInterface } from './markup/interface/markupInterface';
import { Creator } from './markup/creator';
import { MetaCreator } from './markup/creator/metacreator';
import { CriteriaCreator } from './markup/creator/criteriacreator';
import { Selection } from './markup/selection';
import { SelectionInterface } from './markup/interface/selectionInterface';

export class Markup {
    /**
     * Входящий обеъект
     */
    private readonly parserJson: MarkupInterface;
    private readonly originalText: string;
    /**
     * Результирующий объект
     */
    private resultJson: MarkupInterface;

    private meta: any;
    private criteria: any;
    private selections: Selection;

    /**
     * Инициализация
     * @param parserJson
     */
    constructor(parserJson: MarkupInterface) {
        this.parserJson = parserJson;
        // this.parserJson = {
        //     originalText: "Подтип ошибки или комментарий кратко объясняет учащемуся суть ошибки. Для каждого типа ошибок в классификаторе предусмотрено несколько подтипов. Каждому подтипу соответствует свой стандартный комментарий (то есть подтип ошибки – это, по сути, аббревиатура для стандартного комментария). Если эксперт считает, что ни один из стандартных комментариев не подходит для данного случая, то он может записать свой комментарий. Текст комментария должен быть лаконичным и называть типовую ошибку, встречающуюся во многих работах. Комментарий не должен обращаться к тексту данной работы."
        // }
        this.originalText = this.parserJson.text;
        this.resultJson = this.parserJson;
        /**
         * Приложение выбирает тип создателя в зависимости от конфигурации или среды.
         */
        console.log('App: Launched with the MetaCreator.');
        this.meta = this.clientInitaial(new MetaCreator());

        console.log('App: Launched with the CriteriaCreator.');
        this.criteria = this.clientInitaial(new CriteriaCreator());

        console.log('App: Launched with the SectionCreator.');
        this.selections = new Selection(parserJson, this.originalText);
    }

    /**
     *
     * @param selection
     */
    public addSelection(selection: SelectionInterface): MarkupInterface {
        return this.selections.addSelection(selection);
    }

    /**
     *
     */
    public getListSelection(): Array<SelectionInterface> | undefined {
        return this.selections.getResult();
    }

    /**
     *
     */
    public addDoubleSelection(
        arrSelections: Array<SelectionInterface>
    ): MarkupInterface {
        return this.selections.addManySelection(arrSelections);
    }

    /**
     *
     */
    public removeSelection(id: number): MarkupInterface {
        return this.selections.removeSelection(id);
    }

    /**
     *
     */
    public editSelection(section: SelectionInterface): MarkupInterface {
        return this.selections.editSelection(section);
    }

    /**
     * Получить текст
     */
    getResult(): string {
        const arSelection = this.selections.getResult();
        let result: string = this.parserJson.text;
        this.selections.resultJson.text = this.originalText;
        this.selections.indexOffer = 0;
        // console.log(arSelection,' -1- result');
        if (arSelection) {
            arSelection.forEach(selection => {
                result = this.selections.createMarkup(selection);
            });
        }
        // console.log(this.parserJson.originalText,' -2- this.parserJson.originalText');
        // console.log(' -------------------------------------- ');
        return result;
    }

    /**
     * Получить маркап
     */
    getJson(): MarkupInterface {
        this.resultJson.criterias = this.criteria.getResult();
        this.resultJson.meta = this.meta.getResult();
        this.resultJson.selections = this.selections.getResult();
        this.resultJson.text = this.originalText;
        return this.resultJson;
    }

    /**
     * Клиентский код работает с экземпляром конкретного создателя, хотя и через его
     * базовый интерфейс. Пока клиент продолжает работать с создателем через базовый
     * интерфейс, вы можете передать ему любой подкласс создателя.
     */
    private clientInitaial(creator: Creator): object {
        return creator.factoryMethod(this.parserJson);
    }
}
