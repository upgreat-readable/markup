import React, { FC, Fragment, MouseEvent } from 'react';
import { Meta } from 'types/markup';
import { useMarkupStore } from 'hooks/useMarkupStore';
import { observer } from 'mobx-react';
import clsx from 'clsx';
import Marker from 'components/Marker';
import MarkupMenu from 'components/MarkupMenu';
import MetaHead from 'components/MetaHead';
import MarkupGeneralMistakes from 'components/MarkupGeneralMistakes';

interface IPage {
    mode: boolean;
    isSelected?: boolean;
    meta: Meta;
}

const Page: FC<IPage> = observer(({ mode, meta }) => {
    const { markUp, menu, repository } = useMarkupStore();

    const clickHandler = (e: MouseEvent) => {
        const target = e.target as HTMLDivElement;
        const { id, tagName } = target;
        const isConnecting = tagName === 'MARK' && markUp.isTextSelectable;
        try {
            if (id) {
                isConnecting
                    ? markUp.connectFragment(+id)
                    : markUp.restoreFragment(+id);
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div
            className={clsx(
                'main-block__wrapper',
                markUp.isTextSelectable && 'click-copy'
            )}
        >
            <MetaHead meta={meta} />

            <MarkupGeneralMistakes
                markUp={markUp}
                clickHandler={clickHandler}
            />

            <div className="main-block__row">
                {(mode && (
                    <Fragment>
                        <Marker
                            markUp={markUp}
                            clickHandler={clickHandler}
                            badgeClickHandler={clickHandler}
                        />
                        {markUp.isSelected && (
                            <MarkupMenu
                                menu={menu}
                                isEditable={repository.isEditable}
                                isRemovable={repository.isEditable}
                            />
                        )}
                    </Fragment>
                )) || (
                    <div className="main-block__page main-block__page--result">
                        {markUp.renderer.parsedText}
                    </div>
                )}
            </div>
        </div>
    );
});

export default Page;
