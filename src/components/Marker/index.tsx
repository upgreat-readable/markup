import React, {
    MouseEvent,
    Fragment,
    useEffect,
    useLayoutEffect,
    useState,
    forwardRef,
    ForwardRefExoticComponent,
    RefAttributes,
    PropsWithoutRef,
} from 'react';
import { observer } from 'mobx-react';
import { isWindows } from 'react-device-detect';
import clsx from 'clsx';
import Badges from 'components/MarkupBadges';
import WordSnap from 'domain/markup/services/WordSelection';
import { IBadgeItem } from 'domain/markup/entities/badges/badge.interface';
import { IMarker } from 'types/markup';

type TMarker = ForwardRefExoticComponent<
    PropsWithoutRef<IMarker> & RefAttributes<HTMLDivElement>
>;

const Marker: TMarker = forwardRef<HTMLDivElement, IMarker>(
    (
        {
            markUp,
            clickHandler,
            badgeClickHandler,
            showArrows,
            badgePosition = 'right',
        },
        ref
    ) => {
        const [isSelected, setIsSelected] = useState<boolean>(false);
        const [badgesList, setBadgesList] = useState([]);
        const [fragmentsList, setFragmentsList] = useState([]);

        const onMouseUp = (): void => {
            if (!markUp.isSelected) {
                fragmentsList.forEach(item => item.classList.remove('focused'));
            }

            const range = WordSnap.mouseUpHandler('.main-block__page');

            if (
                range &&
                range[0] >= 0 &&
                range[1] &&
                markUp.repository.isEditable
            ) {
                markUp.createNewRange(range[0], range[1]);
            }
        };

        const handleHover = (e: MouseEvent, over: boolean): void => {
            const target = e.target as HTMLDivElement;
            if (!isSelected) {
                badgesList.forEach(item => {
                    if (over && target.id) {
                        item.classList.add(
                            item.id === target.id ? 'active' : 'opacity'
                        );
                    } else {
                        item.classList.remove('active', 'opacity');
                    }
                });
                fragmentsList.forEach(item => {
                    if (over && item.id === target.id) {
                        item.classList.add('focused');
                    } else {
                        item.classList.remove('focused');
                    }
                });
            }
        };

        const renderBadges = () => (
            <Badges
                position={badgePosition}
                elements={markUp.badges.elements}
                clickHandler={badgeClickHandler}
                handleHover={handleHover}
                isSelected={isSelected}
                showArrows={showArrows}
            />
        );

        useEffect(() => {
            if (markUp.badges.elements) {
                setIsSelected(
                    Object.values(markUp.badges.elements).some(element =>
                        (element as IBadgeItem[]).some(item => item?.active)
                    )
                );
            }
        }, [markUp.badges.elements]);

        useEffect(() => {
            function escapeHandler(e: KeyboardEvent): void {
                if (e.key === 'Escape' && markUp.isSelected) {
                    markUp.resetSelection();
                }
            }
            window.addEventListener('keydown', escapeHandler);
            return () => window.removeEventListener('keydown', escapeHandler);
        }, [markUp]);

        useLayoutEffect(() => {
            setBadgesList(Array.from(document.querySelectorAll(`.badge`)));
            setFragmentsList(Array.from(document.querySelectorAll(`.range`)));
        }, [markUp.badges.elements]);

        useLayoutEffect(() => {
            const nodes = Array.from(document.querySelectorAll('mark, em'));
            const badgesTopOffset = document
                .querySelector('.main-block__badges')
                ?.getBoundingClientRect().top;

            nodes.length > 0
                ? markUp.badges.setBadges(badgesTopOffset, nodes)
                : markUp.badges.clear();
        }, [markUp.renderer.text, markUp.badges]);

        return (
            <Fragment>
                {badgePosition === 'left' && renderBadges()}
                <div
                    ref={ref}
                    onClick={clickHandler}
                    onMouseUp={onMouseUp}
                    onMouseDown={markUp.clearCurrentRange}
                    onMouseOver={e => handleHover(e, true)}
                    onMouseOut={e => handleHover(e, false)}
                    className={clsx(
                        'main-block__page',
                        isWindows && 'main-block__page--windows'
                    )}
                    dangerouslySetInnerHTML={{
                        __html: markUp.renderer.text,
                    }}
                />
                {badgePosition === 'right' && renderBadges()}
            </Fragment>
        );
    }
);

export default observer(Marker);
