import React, { FC } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import { useMarkupStore } from 'hooks/useMarkupStore';
import { ErrorClassification } from 'domain/markup/entities/menu/menu.interface';

interface IOption {
    option: ErrorClassification;
    filtered?: boolean;
}

const MenuOption: FC<IOption> = observer(({ option, filtered }) => {
    const { menu } = useMarkupStore();
    return (
        <div
            className={clsx(
                'markup-menu__sublevel-option',
                filtered && 'markup-menu__sublevel-option--filter'
            )}
        >
            <span
                className="markup-menu__sublevel-label"
                onClick={() => menu.setClassification(option)}
            >
                {option?.name}
            </span>

            {(option?.description?.length && (
                <span
                    className="markup-menu__sublevel-desc"
                    dangerouslySetInnerHTML={{
                        __html: option.description,
                    }}
                />
            )) ||
                null}
        </div>
    );
});

export default MenuOption;
