import React, { FC } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import GeneralMistake from './Items';
import Help from 'components/ui/Help';
import './style.sass';
import { ErrorClassification } from 'domain/markup/entities/menu/menu.interface';
import { IMarkupService } from 'domain/markup/entities/service/service.interface';

interface IMarker {
    markUp: IMarkupService;
    clickHandler(e: React.MouseEvent<HTMLElement, MouseEvent>): void;
    showActiveOnly?: boolean;
    showDisabled?: boolean;
}

const MarkupGeneralMistakes: FC<IMarker> = observer(
    ({
        markUp,
        clickHandler,
        showActiveOnly = false,
        showDisabled = false,
    }) => {
        const { menu, repository } = markUp;

        const mistakes = [
            {
                label: 'Общие ошибки:',
                options: menu.fullTextOptions?.filter(opt => opt.on_full_text),
            },
            {
                label: 'Раскрытие темы:',
                options: menu.fullTextOptions?.filter(opt => opt.disclosure),
            },
        ];

        const isSelectionExist = (code: string): boolean =>
            markUp.findSelectionByType(code)?.type.length > 0;

        const findIdByCode = (code: string): number =>
            markUp.findSelectionByType(code)?.id;

        const isActive = (code: string): boolean =>
            markUp.selection?.type === code;

        const isOpacity = (arr: ErrorClassification[]) =>
            arr.some(item => markUp.selection?.type === item.code);

        const handleClick = (
            event: React.MouseEvent<HTMLElement, MouseEvent>,
            option: ErrorClassification
        ): void => {
            if (isSelectionExist(option.code)) {
                clickHandler(event);
            } else if (repository.isEditable) {
                markUp.createFullTextSelection(option);
            }
        };

        const renderSingleMistake = (
            option: ErrorClassification,
            key: number
        ) => {
            if (showActiveOnly && !isSelectionExist(option.code)) {
                return null;
            }

            const id = findIdByCode(option.code);

            const isDone = isSelectionExist(option.code);

            const active = isActive(option.code);

            const isDisabled =
                showDisabled && markUp.disabledSelections?.includes(id);

            return (
                <GeneralMistake
                    id={id}
                    key={key}
                    option={option}
                    isDone={isDone}
                    isActive={active}
                    isDisabled={isDisabled}
                    handleClick={handleClick}
                />
            );
        };

        if (!menu.fullTextOptions?.length) return;

        return (
            <div className="general-mistakes">
                <div className="general-mistakes__body">
                    {mistakes.map(
                        mistake =>
                            (mistake.options?.length && (
                                <div
                                    className="general-mistakes__col"
                                    key={mistake.label}
                                >
                                    <div className="general-mistakes__container">
                                        <div className="general-mistakes__title">
                                            {mistake.label}
                                        </div>

                                        <Help
                                            type={'general'}
                                            modification={'right'}
                                        />
                                    </div>
                                    <div
                                        className={clsx(
                                            'general-mistakes__items',
                                            isOpacity(mistake.options) &&
                                                `opacity`
                                        )}
                                    >
                                        {mistake.options.map(
                                            renderSingleMistake
                                        )}
                                    </div>
                                </div>
                            )) ||
                            null
                    )}
                </div>
            </div>
        );
    }
);

export default MarkupGeneralMistakes;
