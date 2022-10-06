import React, { FC, useState } from 'react';
import { MenuCategory } from 'domain/markup/entities/menu/menu.interface';
import MenuOption from './Option';
import clsx from 'clsx';

interface MenuLevel {
    item?: MenuCategory;
}

const MarkupMenuLevel: FC<MenuLevel> = ({ item, ...rest }) => {
    const [toggle, setToggle] = useState(false);
    return (
        <div className="markup-menu__sublevel">
            <label
                onClick={() => setToggle(!toggle)}
                className={clsx(
                    'markup-menu__sublevel-title',
                    toggle && 'open'
                )}
            >
                {item.name}
            </label>
            {toggle && (
                <div className="markup-menu__sublevel-body">
                    {item.errors
                        .filter(el => el.on_full_text !== true)
                        .map((option, key) => (
                            <MenuOption {...rest} option={option} key={key} />
                        ))}
                    {item.comment !== null && (
                        <span className="markup-menu__sublevel-comment">
                            {item.comment}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default MarkupMenuLevel;
