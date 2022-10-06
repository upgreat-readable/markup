interface IWordSelection extends Selection {
    modify?: Function;
    createRange?: Function;
}

export type WordsRange = [number, number] | [undefined, undefined];

class WordSelection {
    private selection: IWordSelection | null;

    private range: Range | null;

    private page: HTMLElement;

    private shift: number;

    private get backwards(): boolean {
        return this.range.collapsed;
    }

    private getNodeLength = (node: Element): number => {
        return node.nodeType === 3
            ? node.textContent.length
            : node.outerHTML.length;
    };

    private reset = (): WordsRange => {
        this.selection.removeAllRanges();
        return [0, 0];
    };

    private checkSpaces = (str: string): boolean => {
        return /\s/.test(str[0]) || /\s/.test(str[str.length - 1]);
    };

    private createRange = (): void => {
        const {
            anchorNode,
            anchorOffset,
            focusNode,
            focusOffset,
        } = this.selection;

        this.range = document.createRange();

        if (anchorNode) this.range.setStart(anchorNode, anchorOffset);

        if (focusNode) this.range.setEnd(focusNode, focusOffset);

        this.range.detach();
    };

    private extendSelection = (focusNode: Node, focusOffset: number): void => {
        const { selection, backwards } = this;
        const direction = backwards
            ? ['backward', 'forward']
            : ['forward', 'backward'];

        selection.modify('move', direction[0], 'character');

        selection.modify('move', direction[1], 'word');

        selection.extend(focusNode, focusOffset);

        const selectionString = selection.toString();

        selection.modify('extend', direction[1], 'character');

        if (!this.checkSpaces(selectionString)) {
            selection.modify('extend', direction[0], 'word');
        }
    };

    private extendRange = (): void => {
        const { selection, range, backwards } = this;
        if (backwards) {
            range.setStart(selection.focusNode, selection.focusOffset);
            range.setEnd(selection.anchorNode, selection.anchorOffset);
        } else {
            range.setStart(selection.anchorNode, selection.anchorOffset);
            range.setEnd(selection.focusNode, selection.focusOffset);
        }
    };

    private increaseShift = (
        nodes: Array<Node>,
        nodeToCompare: Node,
        shift: number = 0
    ) => {
        let i = 0;
        while (!nodes[i].isEqualNode(nodeToCompare)) {
            shift += this.getNodeLength(nodes[i] as Element);
            i++;
        }
        return shift;
    };

    private collapseSelection = (): void => {
        const { anchorNode, anchorOffset } = this.selection;
        let offset = anchorOffset;
        const isSpacing = this.checkSpaces(this.selection.toString());
        const modifiedOffset = this.backwards ? offset - 1 : offset + 1;
        this.selection.collapse(
            anchorNode,
            isSpacing ? modifiedOffset : offset
        );
    };

    private crossBrowserModification = (): void => {
        const direction = this.backwards
            ? ['backward', 'forward']
            : ['forward', 'backward'];

        if (
            this.checkSpaces(this.selection.toString()) &&
            navigator.userAgent.indexOf('Win') !== -1
        ) {
            this.selection.modify('extend', direction[1], 'character');
        }
    };

    private computeShift = (): void => {
        const nodes = Array.from(this.page.childNodes);
        let shift = 0;
        let startNode = this.selection.anchorNode as Node;

        try {
            while (!nodes.includes(startNode as ChildNode)) {
                let innerNodes = Array.from(startNode.parentElement.childNodes);
                let shiftInner =
                    startNode.parentElement.outerHTML.indexOf('>') + 1;

                shiftInner = this.increaseShift(
                    innerNodes,
                    startNode,
                    shiftInner
                );

                shift += shiftInner;

                startNode = startNode.parentElement;

                if (shift > 7000) break;
            }

            shift = this.increaseShift(nodes, startNode, shift);
        } catch (e) {
            // console.error('shift computation error');
            shift = 0;
        }

        this.shift = shift;
    };

    private handleWrapping = (): WordsRange => {
        const { startOffset, endOffset } = this.range;
        const { anchorNode } = this.selection;

        const selectedWords = startOffset
            ? anchorNode.textContent.length - startOffset
            : 0;

        const parentNodes = Array.from(anchorNode.parentNode.childNodes);

        const innerNodesShift = Array.from(
            this.range.cloneContents().childNodes
        )
            .filter(node => parentNodes.some(child => node.isEqualNode(child)))
            .reduce((acc, node) => {
                acc += this.getNodeLength(node as Element);
                return acc;
            }, 0);

        const start = this.shift + startOffset;
        const end = start + selectedWords + innerNodesShift + endOffset;

        return [start, end] as WordsRange;
    };

    public mouseUpHandler = (selector: string): WordsRange | undefined => {
        this.selection = window.getSelection();
        this.page = document.querySelector(selector) as HTMLElement;
        const { anchorNode, focusNode, focusOffset } = this.selection;
        const anchorParent = anchorNode?.parentNode;
        const focusParent = focusNode?.parentNode;

        if (!anchorParent?.isEqualNode(focusParent)) {
            this.reset();
        }

        if (
            this.selection &&
            this.selection.modify &&
            !this.selection.isCollapsed
        ) {
            this.computeShift();
            this.createRange();
            this.collapseSelection();
            this.extendSelection(focusNode, focusOffset);
            this.crossBrowserModification();
            this.extendRange();

            if (!anchorNode.isEqualNode(focusNode)) {
                return this.handleWrapping();
            }

            this.selection.removeAllRanges();

            if (this.range.startOffset >= 0 && this.range.endOffset) {
                return [
                    this.range.startOffset + this.shift,
                    this.range.endOffset + this.shift,
                ] as WordsRange;
            } else {
                this.reset();
            }
        }
    };
}

export default new WordSelection();
