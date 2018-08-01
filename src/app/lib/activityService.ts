import axios from 'axios';

import {convertToParams, headerWithToken} from '@src/app/util/fetchUtils';
import {HOST} from '@src/commons/config';

export const fetchActivityUrl = `${HOST}/admin/meeting/list-meeting`;
export const fetchUserSigninActivityUrl = `${HOST}/admin/user/list-signin-meeting`;

export const getActivityDetailById = (activityId) => {
  return axios.get(`${HOST}/admin/meeting/get-auth-meeting-detail?${convertToParams({
    meetingId: activityId,
  })}`, {
    headers: headerWithToken({}),
  });
};

export const getActivities = (fetchUrl, userId, pageIndex) => {
  let paramsObject;
  if (userId !== null) {
    paramsObject = {
      userId,
      pageIndex,
    };
  } else {
    paramsObject = {
      pageIndex,
    };
  }
  return axios.get(`${fetchUrl}?${convertToParams(paramsObject)}`, {
    headers: headerWithToken({}),
  });
};

export const getSigninMeeting = (userId, pageIndex) => {
  return axios.get(`${HOST}/admin/meeting/list-meeting?${convertToParams({
    userId: userId,
    pageIndex: pageIndex,
  })}`, {
    headers: headerWithToken({}),
  });
};
