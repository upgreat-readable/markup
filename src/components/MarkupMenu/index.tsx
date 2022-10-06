import React, { createContext, FC } from 'react';
import { observer } from 'mobx-react';
import {
    IMarkupMenu,
    MenuViews,
} from 'domain/markup/entities/menu/menu.interface';
import DefaultView from './View/Default';
import CorrectionForm from './View/CorrectionForm';
import DetailFragment from './View/Detail';

export const MenuContext = createContext<IMarkupMenu>({} as IMarkupMenu);

interface IMarkupMenuContainer {
    menu: IMarkupMenu;
    isEditable?: boolean;
    isRemovable?: boolean;
}

const MarkupMenuContainer: FC<IMarkupMenuContainer> = observer(
    ({ menu, isEditable, isRemovable = true }) => {
        const viewConfig: MenuViews = {
            classification: DefaultView,
            correction: CorrectionForm,
            explanation: CorrectionForm,
            detail: DetailFragment,
        };

        const ViewComponent = viewConfig[menu.view];

        return (
            <MenuContext.Provider value={menu}>
                <ViewComponent
                    isEditable={!!isEditable}
                    isRemovable={isRemovable}
                />
            </MenuContext.Provider>
        );
    }
);

export default MarkupMenuContainer;
