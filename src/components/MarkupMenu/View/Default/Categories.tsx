import React, { FC, useState, Fragment } from 'react';
import MarkupMenuLevel from './Level';
import clsx from 'clsx';
import MenuOption from './Option';
import { MenuCategory } from 'domain/markup/entities/menu/menu.interface';

interface ICategory {
    item?: MenuCategory;
}

const MarkupMenuCategories: FC<ICategory> = ({ item }) => {
    const [toggle, setToggle] = useState(false);
    return (
        <div className="markup-menu__level">
            <label
                className={clsx('markup-menu__level-title', toggle && 'open')}
                onClick={() => setToggle(!toggle)}
            >
                {item.name}
            </label>
            {toggle && (
                <Fragment>
                    {item.sub_categories.map((level, key) => {
                        if (level.active) {
                            return <MarkupMenuLevel key={key} item={level} />;
                        } else {
                            return null;
                        }
                    })}
                    {item.errors.map((item, key) => {
                        return <MenuOption option={item} key={key} />;
                    })}
                </Fragment>
            )}
        </div>
    );
};

export default MarkupMenuCategories;
