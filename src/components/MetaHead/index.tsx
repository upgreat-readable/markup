import React, { FC } from 'react';
import { Meta, subjects } from 'types/markup';
import Collapsible from 'react-collapsible';
import clsx from 'clsx';
import './style.sass';

interface IMainHead {
    meta: Meta;
    titleSm?: boolean;
}

const MetaHead: FC<IMainHead> = ({ meta, titleSm = false }) => {
    return (
        <div className={clsx('meta-head', titleSm && 'meta-head--title-sm')}>
            <div className="meta-head__theme">Тема</div>
            <div className="meta-head__title">{meta?.theme}</div>
            <div className="meta-head__info">
                <div className="meta-head__param">Класс: {meta?.class}</div>
                <div className="meta-head__param">Год: {meta?.year}</div>
                <div className="meta-head__param">
                    Предмет: {subjects[meta?.subject]}
                </div>
                <div className="meta-head__param">Тест: {meta?.test}</div>
                {(meta?.category?.length && (
                    <div className="meta-head__param">
                        Категория: {meta?.category}
                    </div>
                )) ||
                    null}
            </div>
            {meta?.taskText && (
                <Collapsible
                    classParentString="meta-collapse"
                    trigger="Показать исходный текст"
                    triggerWhenOpen="Свернуть исходный текст"
                >
                    <span>{meta?.taskText}</span>
                </Collapsible>
            )}
        </div>
    );
};

export default MetaHead;
