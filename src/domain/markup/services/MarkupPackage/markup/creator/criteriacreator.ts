import { Creator } from "../creator";
import { MarkupInterface } from "../interface/markupInterface";
import {Params} from "../interface/params";
import {CriteriaProduct} from "../product/creteriaproduct";


export class CriteriaCreator extends Creator {
    public factoryMethod(parserJson: MarkupInterface): Params {
        // @ts-ignore
        return new CriteriaProduct(parserJson);
    }
}