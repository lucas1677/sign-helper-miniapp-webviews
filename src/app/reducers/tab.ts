import {AppState, TabItem, TabLogicState} from '@src/types/application';
import {push} from 'connected-react-router';

const initState = {
  currentRelContent: null,
  lastRelContent: null,
  tabs: [{
    id: 0,
    title: '待审核',
    isActive: true,
    parentId: null,
    navPath: '/application/auth-wait',
  }, {
    id: 1,
    title: '已审核',
    isActive: false,
    parentId: null,
    navPath: '/application/auth-finish',
  }, {
    id: 2,
    title: '待审核用户',
    isActive: true,
    parentId: 0,
    navPath: '/application/auth-wait/users',
  }, {
    id: 3,
    title: '活动列表',
    isActive: false,
    parentId: 0,
    navPath: '/application/auth-wait/activities',
  }, {
    id: 4,
    title: '通过',
    isActive: true,
    parentId: 1,
    navPath: '/application/auth-finish/pass',
  }, {
    id: 5,
    title: '不通过',
    isActive: false,
    parentId: 1,
    navPath: '/application/auth-finish/deny',
  }],
};

export const REACT_ROUTER_PUSH_ACTION = '@@router/LOCATION_CHANGE';
const TAB_NAV_CHECK_PATH = 'TAB_NAV_CHECK_PATH';

export const checkPath = (path) => ({type: TAB_NAV_CHECK_PATH, payload: path});

export const navPath = (tab: TabItem) => {
  return (dispatch) => {
    dispatch(push(tab.navPath));
  };
};

export const pushPath = (path) => {
  return (dispatch) => {
    dispatch(push(path));
  };
};

export const getVisibleTabs = (state: AppState, tabLevel: number) => {
  const {tabs} = state.tabLogic;
  let activeParentTabId = 0;
  const tmpTab = tabs.find(t => t.parentId === null && t.isActive === true);
  if (tmpTab.id >= 0) {
    activeParentTabId = tmpTab.id;
  }
  if (tabLevel === 1) {
    return tabs.filter(t => t.parentId === null);
  } else if (tabLevel === 2) {
    return tabs.filter(t => t.parentId !== null && t.parentId === activeParentTabId);
  }
  return [];
};

export default (state: TabLogicState = initState, action) => {
  switch (action.type) {
    case REACT_ROUTER_PUSH_ACTION:
      return {
        ...state,
        tabs: state.tabs.map(
          t => {
            if (action.payload.location.pathname.includes(t.navPath)) {
              return {...t, isActive: true};
            } else {
              return {...t, isActive: false};
            }
          }
        ),
      };
    case TAB_NAV_CHECK_PATH:
      return {
        ...state,
        tabs: state.tabs.map(
          t => {
            if (action.payload.includes(t.navPath)) {
              return {...t, isActive: true};
            } else {
              return {...t, isActive: false};
            }
          }
        ),
      };
    default:
      return state;
  }
};
