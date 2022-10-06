import React, { FC, useContext } from 'react';
import { observer } from 'mobx-react';
import { MenuViewsProps } from 'domain/markup/entities/menu/menu.interface';
import '../../style.sass';
import { MenuContext } from '../../index';

const DetailFragment: FC<MenuViewsProps> = observer(
    ({ isEditable, isRemovable }) => {
        const { data, resetDetail, switchView, remove } = useContext(
            MenuContext
        );

        const view = data.has_correction ? 'correction' : 'explanation';

        const detailFields = [
            {
                label: 'Подтип ошибки',
                value: data.subtype,
            },
            {
                label: 'Исправление',
                value: data.correction,
            },
            {
                label: 'Пояснение',
                value: data.explanation,
            },
            {
                label: 'Комментарий',
                value: data.comment,
            },
        ];

        return (
            <div className="correction">
                <i className="correction__close" onClick={resetDetail} />
                <div className="correction__title">{data.name}</div>
                <div className="correction__desc">{data.description}</div>
                {detailFields.map(
                    (field, key) =>
                        (field.value.length && (
                            <div className="correction__group" key={key}>
                                <label className="correction__label">
                                    {field.label}
                                </label>
                                <div className="correction__value">
                                    {field.value}
                                </div>
                            </div>
                        )) ||
                        null
                )}
                {(isEditable || isRemovable) && (
                    <div className="correction__panel">
                        {isEditable && (
                            <span
                                className="correction__edit"
                                onClick={() => switchView(view)}
                            >
                                Редактировать разметку
                            </span>
                        )}
                        {isRemovable && (
                            <span
                                className="correction__cancel"
                                onClick={remove}
                            >
                                Удалить
                            </span>
                        )}
                    </div>
                )}
            </div>
        );
    }
);

export default DetailFragment;
