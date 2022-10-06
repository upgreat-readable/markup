import cogoToast from 'cogo-toast';

type TParams = {
    clientX: number;
    clientY: number;
    parentElement: Element;
    clientWidth: number;
    clientHeight: number;
};

export class TargetCalculation {
    static calculateMenuCoords = (params: TParams): [number, number] => {
        const {
            clientX,
            clientY,
            parentElement,
            clientWidth: menuWidth,
            clientHeight: menuHeight,
        } = params;

        const { top, left, right } = parentElement.getBoundingClientRect();

        try {
            const pageWidth = right - left;
            const rightOffset = pageWidth - menuWidth;

            const relativeX = clientX - left;
            const relativeY = clientY - top;
            const isOutsideRight = relativeX >= rightOffset;

            let X = relativeX;

            if (isOutsideRight) X = rightOffset + 5;

            if (X < 0) X = 0;

            const Y = relativeY - menuHeight - 40;

            return [X, Y];
        } catch (e) {
            console.error(e);
            cogoToast.error(e || e?.message);
        }
    };
}
