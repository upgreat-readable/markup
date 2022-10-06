import React, { useContext } from 'react';
import '../../style.sass';
import { observer } from 'mobx-react';
import SelectSubType from '../Detail/SelectSubType';
import Help from '../../../ui/Help';
import { MenuContext } from '../../index';

const CorrectionForm = observer(() => {
    const {
        isCorrection,
        setProperty,
        data,
        save,
        error,
        reset,
        connect,
        fragmentsOptions,
    } = useContext(MenuContext);

    return (
        <div className="correction">
            <i className="correction__close" onClick={reset} />
            <div className="correction__title">{data.name}</div>
            <div
                className="correction__desc"
                dangerouslySetInnerHTML={{ __html: data.description }}
            />

            {(data.fragments.length && (
                <div className="correction__group">
                    <div className="correction__title">
                        <label className="correction__label">
                            Подтип ошибки
                        </label>
                        <Help type={'subtype'} />
                    </div>
                    <SelectSubType
                        change={setProperty}
                        value={data.subtype}
                        options={fragmentsOptions(data.fragments)}
                    />
                </div>
            )) ||
                null}

            {isCorrection &&
                ((
                    <div
                        className={`correction__group ${
                            data.correction.length < 1 &&
                            data.name === 'ИСП' &&
                            `correction__group--red`
                        }`}
                    >
                        <div className="correction__title">
                            <label className="correction__label">
                                Исправление
                            </label>
                            <Help type={'correction'} />
                        </div>
                        <input
                            type="text"
                            value={data.correction}
                            className="correction__input"
                            onChange={({ target }) =>
                                setProperty('correction', target.value)
                            }
                        />
                    </div>
                ) ||
                    null)}

            <div className="correction__group">
                <div className="correction__title">
                    <label className="correction__label">Пояснение</label>
                    <Help type={'explanation'} />
                </div>
                <input
                    type="text"
                    value={data.explanation}
                    className="correction__input"
                    onChange={({ target }) =>
                        setProperty('explanation', target.value)
                    }
                />
            </div>
            <div className="correction__group">
                <div className="correction__title">
                    <label className="correction__label">Комментарий</label>
                    <Help type={'comment'} />
                </div>
                <input
                    type="text"
                    value={data.comment}
                    className="correction__input"
                    onChange={({ target }) =>
                        setProperty('comment', target.value)
                    }
                />
            </div>

            {(data.hasRelationFragment && (
                <div className="correction__connect" onClick={connect}>
                    <i /> <span>Связать с фрагментом</span>
                </div>
            )) ||
                null}

            <div className="correction__save" onClick={save}>
                Сохранить
            </div>

            {(error.length && (
                <div className="correction__cancel">{error}</div>
            )) ||
                null}

            <div className="correction__cancel" onClick={reset}>
                Отмена
            </div>
        </div>
    );
});

export default CorrectionForm;
