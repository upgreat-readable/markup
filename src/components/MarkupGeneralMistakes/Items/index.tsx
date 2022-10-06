import React, { FC } from 'react';
import { observer } from 'mobx-react';
import clsx from 'clsx';
import { ErrorClassification } from 'domain/markup/entities/menu/menu.interface';

interface IGeneralSelection {
    id: number;
    option: ErrorClassification;
    isDone: boolean;
    isActive: boolean;
    isDisabled: boolean;
    handleClick(
        e: React.MouseEvent<HTMLElement, MouseEvent>,
        option: ErrorClassification
    ): void;
}

const GeneralMistake: FC<IGeneralSelection> = observer(
    ({ id, option, handleClick, isDone, isActive, isDisabled }) => {
        return (
            <div
                id={id + ''}
                onClick={e => handleClick(e, option)}
                className={clsx(
                    'general-mistakes-item',
                    isDone && 'active',
                    isActive && 'focused',
                    isDisabled && 'disabled'
                )}
            >
                <div id={id + ''} className="general-mistakes-item__title">
                    {option?.name}
                </div>

                {(option?.description && (
                    <div className="general-mistakes-item__desc">
                        {option?.description}
                    </div>
                )) ||
                    null}
            </div>
        );
    }
);

export default GeneralMistake;
