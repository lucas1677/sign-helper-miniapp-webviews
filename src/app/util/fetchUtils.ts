import axios from 'axios';

import {showMessage} from '@src/app/reducers/message';
import {pushPath} from '@src/app/reducers/tab';
import {HTTP_METHOD, SYS_CODE, TOKEN_KEY} from '@src/commons/const';
import {AxiosResponse} from 'axios';

export const headerWithToken = (otherHeader) => ({
  ...otherHeader,
  token: localStorage.getItem(TOKEN_KEY),
});

/**
 * 处理axios以及确定状态码的错误.
 * 程序员只需关注正确获取数据后的逻辑问题即可
 * @param {AxiosResponse} axiosData
 * @param dispatch
 * @param callback
 */
export const handleErrors = (axiosData: AxiosResponse, dispatch, callback) => {

  if (axiosData.status === 500) {
    dispatch(showMessage('SERVER 500 ERROR!'));
    return;
  }
  if (axiosData.data.data === SYS_CODE.NOT_LOGIN) {
    dispatch(pushPath('/auth'));
    return;
  }
  if (axiosData.data.success === false) {
    dispatch(showMessage(axiosData.data.msg));
    return;
  }
  // Make sure the callback is a function
  if (typeof callback === 'function') {
    // Call it, since we have confirmed it is callable
    callback(axiosData);
  }
};

export const convertToParams = (obj: object) => {
  let str = '';
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (str !== '') {
        str += '&';
      }
      str += `${key}=${obj[key]}`;
    }
  }
  return str;
};

export const httpTemplate = (method, fetchUrl, data, header, token) => {
  let tmpMethod = null;
  let urlParam = {};
  switch (method) {
    case HTTP_METHOD.GET:
      tmpMethod = axios.get;
      urlParam = {...data};
      data = {};
      break;
    case HTTP_METHOD.POST:
      tmpMethod = axios.post;
      break;
    case HTTP_METHOD.DELETE:
      tmpMethod = axios.post;
      break;
    case HTTP_METHOD.PATCH:
      tmpMethod = axios.post;
      break;
    case HTTP_METHOD.PUT:
      tmpMethod = axios.post;
      break;
  }

  return tmpMethod(`${fetchUrl}${urlParam}`, data, {
    headers: headerWithToken({
      ...header,
    }),
  });
};
