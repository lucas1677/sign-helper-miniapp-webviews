import * as React from 'react';
import * as ReactDom from 'react-dom';

// history type
import {createBrowserHistory as createHistory} from 'history';
import {throttle} from 'lodash';
import {Provider} from 'react-redux';

import RootRouterApp from '@src/app/components/RootRouterApp';
import store from '@src/store';

import {APP_CONTEXT_PATH} from '@src/commons/config';
import {saveState} from '@src/localStorage';
import appStyle from '@src/resource/css/app.scss';
import globalStyle from '@src/resource/css/global.scss';
import normalizeStyle from '@src/resource/css/normalize.css';
import {cssRaw} from 'typestyle';

// import global css style: normalize & global style sheet.
cssRaw(`
${normalizeStyle}
${globalStyle}
${appStyle}
`);

const history = createHistory({basename: APP_CONTEXT_PATH});

const storeImp = store(history);

storeImp.subscribe(throttle(() => {
  saveState({
    ...storeImp.getState(),
  });
}, 1000));

ReactDom.render(
  <Provider store={storeImp}>
    <RootRouterApp history={history}/>
  </Provider>,
  document.getElementById('root') as HTMLElement
);
