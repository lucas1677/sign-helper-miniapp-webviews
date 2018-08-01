import {getActivities, getActivityDetailById} from '@src/app/lib/activityService';
import * as userApi from '@src/app/lib/userService';
import {showMessage} from '@src/app/reducers/message';
import {pushPath, REACT_ROUTER_PUSH_ACTION} from '@src/app/reducers/tab';
import {getPagesByPageSizeAndTotalNumber} from '@src/app/reducers/user';
import {handleErrors} from '@src/app/util/fetchUtils';
import {GLOBAL_PAGE_SIZE} from '@src/commons/config';
import {ActivityLogicState} from '@src/types/application';

const LOAD_MEETING = 'LOAD_MEETING';
const ACTIVITY_FOCUS_USER = 'ACTIVITY_FOCUS_USER';
export const FETCH_ACTIVITY_DETAIL = 'FETCH_ACTIVITY_DETAIL';
const ACTIVITY_LIST_GO_TO_PAGE = 'ACTIVITY_LIST_GO_TO_PAGE';
const ACTIVITY_LIST_PAGE_DISABLE_PREV = 'ACTIVITY_LIST_PAGE_DISABLE_PREV';
const ACTIVITY_LIST_PAGE_DISABLE_NEXT = 'ACTIVITY_LIST_PAGE_DISABLE_NEXT';

const loadMeeting = (meetings) => ({type: LOAD_MEETING, payload: meetings});
export const activePage = (id) => ({type: ACTIVITY_LIST_GO_TO_PAGE, payload: id});

export const focusUser = (userId) => {
  return (dispatch) => {
    dispatch(showMessage('开始载入选择用户的信息...'));
    userApi.getUserById(userId).then(
      res => handleErrors(res, dispatch, (filterRes) => {
        dispatch({type: ACTIVITY_FOCUS_USER, payload: filterRes.data.data});
        dispatch(showMessage('载入选择用户的信息完成'));
      })
    );
  };
};

export const fetchActivity = (fetchUrl, userId, pageIndex) => {
  return (dispatch) => {
    dispatch(showMessage('开始载入会议信息...'));
    getActivities(fetchUrl, userId, pageIndex)
      .then(
        res => handleErrors(res, dispatch, (filterRes) => {
          if (filterRes.data.data.list != null && filterRes.data.data.list.length > 0) {
            dispatch(loadMeeting(filterRes.data.data));
            dispatch(showMessage('载入会议信息完成'));
          } else {
            dispatch(showMessage('暂无会议数据'));
          }
        })
      );
  };
};

export const pageNav = (fetchUrl, pageIndex) => {
  return (dispatch, getState) => {
    const {activityLogic} = getState();
    let currentPageIndex = activityLogic.page.currentPageIndex;
    switch (pageIndex) {
      case '-1':
        if (currentPageIndex === 1) {
          dispatch({type: ACTIVITY_LIST_PAGE_DISABLE_PREV});
          return;
        }
        currentPageIndex = currentPageIndex - 1;
        break;
      case '+1':
        currentPageIndex = currentPageIndex + 1;
        break;
      default:
        currentPageIndex = Number(pageIndex);
    }

    getActivities(fetchUrl, activityLogic.focusUserId, currentPageIndex)
      .then(res => handleErrors(res, dispatch, (filterRes) => {
        if (filterRes.data.data.list.length === 0) {
          if (pageIndex === '-1') {
            dispatch({type: ACTIVITY_LIST_PAGE_DISABLE_PREV});
          } else if (pageIndex === '+1') {
            dispatch({type: ACTIVITY_LIST_PAGE_DISABLE_NEXT});
          }
          return;
        } else {
          dispatch(activePage(currentPageIndex));
          dispatch(loadMeeting(filterRes.data.data));
        }
      }));
  };
};

export const showActivityDetail = (meetingId) => {
  return (dispatch) => {
    dispatch(pushPath(`/application/auth-wait/activities/activity-detail/${meetingId}`));
  };
};

export const focusActivity = (activityId) => {
  return (dispatch) => {
    dispatch(showMessage('开始载入会议详情信息...'));
    getActivityDetailById(activityId).then(
      res => handleErrors(res, dispatch, (filterRes) => {
        dispatch({
          type: FETCH_ACTIVITY_DETAIL,
          payload: filterRes.data.data,
        });
        dispatch(showMessage('会议详情载入完成!'));
      })
    );
  };
};

export default (
  state: ActivityLogicState = {
    page: {
      pages: [1, 2],
      currentPageIndex: 1,
      pageSize: GLOBAL_PAGE_SIZE,
      prevPageAvailable: true,
      nextPageAvailable: true,
    },
    focusUserId: null,
    focusUser: null,
    focusActivity: null,
    activities: [],
  },
  action
) => {
  switch (action.type) {
    case LOAD_MEETING:
      return {
        ...state,
        activities: action.payload.list,
        page: {
          ...state.page,
          pages: getPagesByPageSizeAndTotalNumber(action.payload.count, GLOBAL_PAGE_SIZE),
        },
      };
    case ACTIVITY_FOCUS_USER:
      return {
        ...state,
        focusUserId: action.payload.id,
        focusUser: action.payload,
      };
    case REACT_ROUTER_PUSH_ACTION:
      return {
        ...state,
        focusUserId: action.payload.location.pathname.includes('user-sign-in-activities')
          ? state.focusUserId
          : null,
        focusUser: action.payload.location.pathname.includes('user-sign-in-activities')
          ? state.focusUser
          : null,
      };
    case FETCH_ACTIVITY_DETAIL:
      return {
        ...state,
        focusActivity: action.payload,
      };
    case ACTIVITY_LIST_GO_TO_PAGE:
      return {
        ...state,
        page: {
          ...state.page,
          currentPageIndex: action.payload,
          prevPageAvailable: true,
          nextPageAvailable: true,
        },
      };
    case ACTIVITY_LIST_PAGE_DISABLE_PREV:
      return {
        ...state,
        page: {
          ...state.page,
          prevPageAvailable: false,
          nextPageAvailable: true,
        },
      };
    case ACTIVITY_LIST_PAGE_DISABLE_NEXT:
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
