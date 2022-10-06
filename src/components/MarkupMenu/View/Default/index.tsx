import React, { useContext, useState } from 'react';
import { observer } from 'mobx-react';
import { MenuCategory } from 'domain/markup/entities/menu/menu.interface';
import MarkupMenuCategories from './Categories';
import MenuOption from './Option';
import '../../style.sass';
import { MenuContext } from '../../index';

const DefaultView = observer(() => {
    const { filteredOptions, allCategories } = useContext(MenuContext);
    const [query, setQuery] = useState<string>('');
    const isQuery: boolean = query.length > 0;
    const menuFilteredOptions = filteredOptions(query);

    return (
        <div className="markup-menu">
            <div className="markup-menu__head">
                <div className="markup-menu__title">Классификатор ошибок</div>
                <div className="markup-menu__search-wrap">
                    <input
                        type="text"
                        className="markup-menu__search"
                        value={query}
                        onChange={({ target }) => setQuery(target.value)}
                        placeholder="Быстрый поиск по коду"
                    />
                    {isQuery && (
                        <span onClick={() => setQuery('')}>Очистить</span>
                    )}
                </div>
            </div>
            <div className="markup-menu__body">
                {(!isQuery &&
                    allCategories?.map((item: MenuCategory, key: number) => (
                        <MarkupMenuCategories item={item} key={key} />
                    ))) ||
                    (menuFilteredOptions?.length > 0 &&
                        menuFilteredOptions.map((option, key) => (
                            <MenuOption
                                key={key}
                                option={option}
                                filtered={true}
                            />
                        ))) || (
                        <span className="markup-menu__nothing">
                            По вашему запросу ничего не найдено
                        </span>
                    )}
            </div>
        </div>
    );
});

export default DefaultView;
