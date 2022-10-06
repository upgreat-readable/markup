import { IMarkupService } from '../service/service.interface';
import { ISelection } from '../selection/selection.interface';

export interface IConnector {
    clickWait: boolean;
    setClickWaiting(wait: boolean): void;
    connectFragment(id: number): void;
    clearSingleConnection(): void;
    removeConnection(selection: ISelection): void;
}

export interface IConnectorConstruct {
    new (service: IMarkupService): IConnector;
}
