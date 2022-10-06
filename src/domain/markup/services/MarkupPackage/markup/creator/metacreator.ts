import {MarkupInterface} from "../interface/markupInterface";
import {MetaProduct} from "../product/metaproduct";
import {Creator} from "../creator";
import {Params} from "../interface/params";

export class MetaCreator extends Creator {
    public factoryMethod(parserJson: MarkupInterface): Params {
        return new MetaProduct(parserJson);
    }
}