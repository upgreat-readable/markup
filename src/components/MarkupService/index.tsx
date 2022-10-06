import './style.sass';
import React, { FC, Fragment, useState } from 'react';
import { observer } from 'mobx-react';
import { useMarkupStore } from 'hooks/useMarkupStore';
import Page from 'components/MarkupService/Page';
import MarkupEstimate from 'components/MarkupEstimate';
import BottomPanel from 'components/BottomServicePanel';
import Logo from 'assets/img/svg/service/logo-light.svg';

type MarkupService = {
    handleClose: () => void;
};

const MarkupService: FC<MarkupService> = observer(({ handleClose }) => {
    const { repository } = useMarkupStore();
    const [mode, switchMode] = useState<boolean>(true);

    return (
        <div className="markup-layout">
            <div className="markup-layout__logo">
                <img src={Logo} alt="" />
            </div>
            <div className="main-block">
                <Fragment>
                    <Page mode={mode} meta={repository.meta} />

                    <div className="markup-layout__bottomPanel">
                        <div className="markup-layout__bottomPanel-wrapper">
                            <MarkupEstimate />

                            <BottomPanel
                                mode={mode}
                                switchMode={switchMode}
                                download={repository.downloadJson}
                                handleClose={handleClose}
                            />
                        </div>
                    </div>
                </Fragment>

            </div>
        </div>
    );
});
export default MarkupService;
