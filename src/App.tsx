import React, { FC } from 'react';
import MarkupServicePage from './pages/MarkupService';

import Notification from './components/ui/Notification/Notification';
import { isChrome } from 'react-device-detect';
import 'core-js';
import 'mobx-react-lite/batchingForReactDom';

const App: FC = () => {
    const notifyCount = sessionStorage.getItem('browserNotification');
    const isLimitReached = notifyCount && +notifyCount >= 3;

    return (
        <React.Fragment>
            {!isChrome && !isLimitReached && <Notification />}
            <MarkupServicePage />
        </React.Fragment>
    );
};

export default App;
