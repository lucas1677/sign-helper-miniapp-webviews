import axios from 'axios';

import {convertToParams, headerWithToken} from '@src/app/util/fetchUtils';
import {HOST} from '@src/commons/config';

export const requestCaptcha = (loginPhoneNumber: string) => {
  return axios.post(`${HOST}/sms/send-captcha`, {
    mobile: loginPhoneNumber,
    action: 2,
  });
};

export const loginSubmit = (loginPhoneNumber, loginCaptcha) => {
  return axios.post(`${HOST}/admin/login`, {
    phoneNumber: loginPhoneNumber,
    verifyCode: loginCaptcha,
  });
};

export const getUsers = (authState: number, pageIndex) => {
  return axios.get(`${HOST}/admin/user/list-auth-user?${convertToParams({
    authState,
    pageIndex,
  })}`, {
    headers: headerWithToken({}),
  });
};

export function getUserById(userId: number) {
  return axios.get(`${HOST}/admin/user/get-user?${convertToParams({
    id: userId,
  })}`, {
    headers: headerWithToken({}),
  });
}

export const authUserFetch = (userId, authState, userCategory, denyReason) => {
  return axios.post(`${HOST}/admin/user/auth`, {
    userId,
    authState,
    userCategory,
    denyReason,
  }, {
    headers: headerWithToken({}),
  });
};
