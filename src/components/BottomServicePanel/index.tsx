import React, { FC } from 'react';
import './style.sass';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import { useMarkupStore } from 'hooks/useMarkupStore';

export type BottomPanelProps = {
    mode: boolean;
    switchMode(mode: boolean): void;
    download(): void;
    handleClose(): void;
};

const BottomPanel: FC<BottomPanelProps> = observer(
    ({ mode, switchMode, download, handleClose }) => {
        const { menu } = useMarkupStore();

        const handleClick = () => {
            menu.save();
            download();
        };

        return (
            <div className="bottom-service-panel">
                <div className="bottom-service-panel__wrapper">
                    <div
                        className={clsx(
                            'bottom-service-panel__viewcode',
                            mode ? 'code' : 'mark'
                        )}
                        onClick={() => switchMode(!mode)}
                    >
                        <i />
                        <span>
                            Переключить в{' '}
                            {(mode && 'режим кода') || 'режим разметки'}
                        </span>
                    </div>

                    <div className="bottom-service-panel__buttons">
                        <div
                            className="bottom-service-panel__btn bottom-service-panel__btn"
                            onClick={handleClick}
                        >
                            Скачать результат
                        </div>
                        <div
                            className="bottom-service-panel__btn bottom-service-panel__btn--outline"
                            onClick={handleClose}
                        >
                            Закрыть
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);
export default BottomPanel;
