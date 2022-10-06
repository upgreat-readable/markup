import {SelectionInterface} from "./selectionInterface";
import {CriteriaInterface} from "./criteriaInterface";
import {MetaInterface} from "./metaInterface";

export interface MarkupInterface {
    meta?: MetaInterface;
    criterias?: CriteriaInterface;
    selections?: Array<SelectionInterface>;
    text: string;
}