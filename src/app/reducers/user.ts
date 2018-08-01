import * as userApi from '@src/app/lib/userService';
import {FETCH_ACTIVITY_DETAIL} from '@src/app/reducers/activity';
import {showMessage} from '@src/app/reducers/message';
import {pushPath} from '@src/app/reducers/tab';
import {handleErrors} from '@src/app/util/fetchUtils';
import {GLOBAL_PAGE_SIZE} from '@src/commons/config';
import {USER_AUTH_STATE} from '@src/commons/const';
import {User, UserLogicState} from '@src/types/application';

const LOAD_USERS = 'LOAD_USERS';
const REPLACE_USER = 'REPLACE_USER';
const USER_AUTH_UNPASS_REASON_CHANGE = 'USER_AUTH_UNPASS_REASON_CHANGE';
const USER_AUTH_UNPASS_CANCEL = 'USER_AUTH_UNPASS_CANCEL';
const SHOW_AUTH_UNPASS_DIALOG = 'SHOW_AUTH_UNPASS_DIALOG';
const USER_LIST_GO_TO_PAGE = 'USER_LIST_GO_TO_PAGE';
const USER_LIST_PAGE_DISABLE_PREV = 'USER_LIST_PAGE_DISABLE_PREV';
const USER_LIST_PAGE_DISABLE_NEXT = 'USER_LIST_PAGE_DISABLE_NEXT';

const loadUsers = (data) => ({type: LOAD_USERS, payload: data});
const replaceUser = (user) => ({type: REPLACE_USER, payload: user});
export const userAuthUnpassReasonChange = (txt) => ({type: USER_AUTH_UNPASS_REASON_CHANGE, payload: txt});
export const userAuthUnpassOpeCancel = () => ({type: USER_AUTH_UNPASS_CANCEL});
export const showAuthUnpassDialog = (id) => ({type: SHOW_AUTH_UNPASS_DIALOG, payload: id});
export const activePage = (id) => ({type: USER_LIST_GO_TO_PAGE, payload: id});

export const fetchUsers = (authState: number, pageIndex) => {
  return (dispatch) => {
    dispatch(showMessage('加载用户数据...'));
    userApi.getUsers(authState, pageIndex)
      .then(res => handleErrors(res, dispatch, (filterRes) => {
        if (filterRes.data.data.list != null && filterRes.data.data.list.length > 0) {
          dispatch(loadUsers(filterRes.data.data));
          dispatch(showMessage('用户数据加载完成!'));
        } else {
          dispatch(showMessage('暂时没有用户数据!'));
        }
      }));
  };
};

export const authUser = (id, authState, userCategory) => {
  return (dispatch, getState) => {
    const {users, authUnpassInfo} = getState().userLogic;
    const user: User = users.find(t => t.id === id);
    const tmpUser: User = {
      ...user,
      authenticateState: authState,
      userCategory: userCategory,
      authenticateDenyReason: authUnpassInfo.authUnPassReason,
    };
    userApi.authUserFetch(
      tmpUser.id,
      tmpUser.authenticateState,
      tmpUser.userCategory,
      tmpUser.authenticateDenyReason
    )
      .then(res => handleErrors(res, dispatch, (filterRes) => {
        dispatch(replaceUser(tmpUser));
      }));
  };
};

export const unpassOpeConfirm = () => {
  return (dispatch, getState) => {
    const {users, authUnpassInfo} = getState().userLogic;
    const user: User = users.find(t => t.id === authUnpassInfo.userId);
    const tmpUser: User = {
      ...user,
      authenticateState: USER_AUTH_STATE.DENY,
      userCategory: null,
      authenticateDenyReason: authUnpassInfo.authUnPassReason,
    };
    userApi.authUserFetch(
      tmpUser.id,
      tmpUser.authenticateState,
      tmpUser.userCategory,
      tmpUser.authenticateDenyReason
    )
      .then(res => handleErrors(res, dispatch, (filterRes) => {
        dispatch(replaceUser(tmpUser));
      }));
  };
};

export const userPageNav = (authState, id) => {
  return (dispatch, getState) => {
    const {userLogic} = getState();
    let currentPageIndex = userLogic.page.currentPageIndex;
    switch (id) {
      case '-1':
        if (currentPageIndex === 1) {
          dispatch({type: USER_LIST_PAGE_DISABLE_PREV});
          return;
        }
        currentPageIndex = currentPageIndex - 1;
        break;
      case '+1':
        currentPageIndex = currentPageIndex + 1;
        break;
      default:
        currentPageIndex = Number(id);
    }

    userApi.getUsers(authState, currentPageIndex)
      .then(res => handleErrors(res, dispatch, (filterRes) => {
        if (filterRes.data.data.list.length === 0) {
          if (id === '-1') {
            dispatch({type: USER_LIST_PAGE_DISABLE_PREV});
          } else if (id === '+1') {
            dispatch({type: USER_LIST_PAGE_DISABLE_NEXT});
          }
          return;
        } else {
          dispatch(activePage(currentPageIndex));
          dispatch(loadUsers(filterRes.data.data));
        }
      }));
  };
};

export const filterUserBuyAuthState = (users: User[], authState: number) => {
  return users.filter(u => u.authenticateState === authState);
};

export const showSignedActivity = (userId) => {
  return (dispatch, getState) => {
    dispatch(pushPath(`/application/auth-wait/users/user-sign-in-activities/${userId}`));
  };
};

export const getPagesByPageSizeAndTotalNumber = (totalNumber, pageSize = GLOBAL_PAGE_SIZE) => {
  const pageCount = Math.floor(totalNumber / pageSize)
    + Math.ceil((totalNumber % pageSize) / pageSize);
  const pages = [];
  for (let i = 0; i < pageCount; i++) {
    pages[i] = i + 1;
  }
  return pages;
};

export default (
  state: UserLogicState = {
    page: {
      pages: [1, 2],
      currentPageIndex: 1,
      pageSize: GLOBAL_PAGE_SIZE,
      prevPageAvailable: true,
      nextPageAvailable: true,
    },
    users: [],
    authUnpassInfo: {
      userId: '',
      authUnPassReason: '',
      unpassDialogShow: false,
    },
  },
  action
) => {
  switch (action.type) {
    case LOAD_USERS:
      return {
        ...state,
        users: action.payload.list,
        page: {
          ...state.page,
          pages: getPagesByPageSizeAndTotalNumber(action.payload.count, GLOBAL_PAGE_SIZE),
        },
      };
    case REPLACE_USER:
      return {
        ...state,
        users: state.users.map(u => u.id === action.payload.id ? action.payload : u),
        authUnpassInfo: {
          ...state.authUnpassInfo,
          userId: '',
          authUnPassReason: '',
          unpassDialogShow: false,
        },
      };
    case USER_AUTH_UNPASS_REASON_CHANGE:
      return {
        ...state,
        authUnpassInfo: {
          ...state.authUnpassInfo,
          authUnPassReason: action.payload,
        },
      };
    case SHOW_AUTH_UNPASS_DIALOG:
      return {
        ...state,
        authUnpassInfo: {
          ...state.authUnpassInfo,
          userId: action.payload,
          unpassDialogShow: true,
        },
      };
    case USER_AUTH_UNPASS_CANCEL:
      return {
        ...state,
        authUnpassInfo: {
          ...state.authUnpassInfo,
          userId: '',
          authUnPassReason: '',
          unpassDialogShow: false,
        },
      };
    case FETCH_ACTIVITY_DETAIL:
      return {
        ...state,
        users: action.payload.signinUsers,
      };
    case USER_LIST_GO_TO_PAGE:
      return {
        ...state,
        page: {
          ...state.page,
          currentPageIndex: action.payload,
          prevPageAvailable: true,
          nextPageAvailable: true,
        },
      };
    case USER_LIST_PAGE_DISABLE_PREV:
      return {
        ...state,
        page: {
          ...state.page,
          prevPageAvailable: false,
          nextPageAvailable: true,
        },
      };
    case USER_LIST_PAGE_DISABLE_NEXT:
      return {
        ...state,
        page: {
          ...state.page,
          prevPageAvailable: true,
          nextPageAvailable: false,
        },
      };
    default:
      return state;
  }
};
