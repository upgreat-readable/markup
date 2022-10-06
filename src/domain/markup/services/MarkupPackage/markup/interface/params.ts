import {MarkupInterface} from "./markupInterface";
import {CriteriaInterface} from "./criteriaInterface";
import {MetaInterface} from "./metaInterface";

/**
 * Интерфейс Продукта объявляет операции, которые должны выполнять все
 * конкретные продукты.
 */
export interface Params {
    parserJson: MarkupInterface
    resultJson: CriteriaInterface | MetaInterface

    add(key: string, value: any): CriteriaInterface | MetaInterface

    edit(key: string, value: any): CriteriaInterface | MetaInterface

    remove(key: string): CriteriaInterface | MetaInterface

    get(key: string): number | string

    transformToText(): string
}