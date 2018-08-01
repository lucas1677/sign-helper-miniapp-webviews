import {push} from 'react-router-redux';

import * as userApi from '@src/app/lib/userService';
import {showMessage} from '@src/app/reducers/message';
import {handleErrors} from '@src/app/util/fetchUtils';
import {LOGIN_PHONE_NUMBER, TOKEN_KEY} from '@src/commons/const';
import {SecurityLogicState} from '@src/types/application';

const LOGIN_PHONE_NUMBER_CHANGE = 'LOGIN_PHONE_NUMBER_CHANGE';
const LOGIN_CAPTCHA_CHANGE = 'LOGIN_CAPTCHA_CHANGE';
const SHOW_WAIT_CAPTCHA_MESSAGE = 'SHOW_WAIT_CAPTCHA_MESSAGE';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const SHOW_SMS_COUNT_DOWN_NUMBER_ACTION = 'SHOW_SMS_COUNT_DOWN_NUMBER_ACTION';
const SMS_SEND_RECOVERY = 'SMS_SEND_RECOVERY';

export const loginPhoneNC = (txt) => ({type: LOGIN_PHONE_NUMBER_CHANGE, payload: txt});
export const loginCaptchaC = (txt) => ({type: LOGIN_CAPTCHA_CHANGE, payload: txt});
const showWaitCaptchaMessage = () => ({type: SHOW_WAIT_CAPTCHA_MESSAGE});
const loginSuccess = (token) => ({type: LOGIN_SUCCESS, payload: token});
const showSmsCountDownNumber = (n) => ({type: SHOW_SMS_COUNT_DOWN_NUMBER_ACTION, payload: n});
const smsSendRecovery = () => ({type: SMS_SEND_RECOVERY});

export const getCaptcha = () => {
  return (dispatch, getState) => {
    const {loginPhoneNumber} = getState().securityLogic;
    dispatch(showMessage('发送获取验证码请求..'));
    userApi.requestCaptcha(loginPhoneNumber)
      .then(res => handleErrors(res, dispatch, () => {
        dispatch(showWaitCaptchaMessage());
        dispatch(showMessage('验证码获取成功!'));
        // show count down message.
        smsSendCountDown(dispatch, showSmsCountDownNumber, smsSendRecovery);
      }));
  };
};

// 递归 实现发送验证码倒计时
export const smsSendCountDown = (dispatch, showSmsCountDownNumberAction, recoveryAction, countNumber = 60) => {
  if (countNumber === 0) {
    countNumber = 60;
    dispatch(recoveryAction());
    return;
  } else {
    countNumber--;
    dispatch(showSmsCountDownNumberAction(countNumber));
  }
  setTimeout(
    () => {
      smsSendCountDown(dispatch, showSmsCountDownNumberAction, recoveryAction, countNumber);
    },
    1000
  );
};

export const loginSubmit = () => {
  return (dispatch, getState) => {
    const {loginPhoneNumber, loginCaptcha} = getState().securityLogic;
    userApi.loginSubmit(loginPhoneNumber, loginCaptcha)
      .then(res => handleErrors(res, dispatch, (filterRes) => {
        localStorage.setItem(TOKEN_KEY, filterRes.data.data);
        localStorage.setItem(LOGIN_PHONE_NUMBER, loginPhoneNumber);
        dispatch(loginSuccess(filterRes.data.data));
        dispatch(showMessage('登陆成功!'));
        dispatch(push('application'));
      }));
  };
};

export const verifyToken = () => {
  return (dispatch) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token === null) {
      dispatch(push('/auth'));
    }
  };
};

export const logout = () => {
  return (dispatch) => {
    localStorage.removeItem(TOKEN_KEY);
    dispatch(push('/auth'));
  };
};

export default (
  state: SecurityLogicState = {
    loginPhoneNumber: '',
    loginCaptcha: '',
    getCaptchaAvailable: true,
    smsSendCountDownNumber: 20,
  },
  action
) => {
  switch (action.type) {
    case LOGIN_PHONE_NUMBER_CHANGE:
      return {
        ...state,
        loginPhoneNumber: action.payload,
      };
    case LOGIN_CAPTCHA_CHANGE:
      return {
        ...state,
        loginCaptcha: action.payload,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        loginCaptcha: '',
        token: action.payload,
      };
    case SMS_SEND_RECOVERY:
      return {
        ...state,
        getCaptchaAvailable: true,
      };
    case SHOW_WAIT_CAPTCHA_MESSAGE:
      return {
        ...state,
        getCaptchaAvailable: false,
      };
    case SHOW_SMS_COUNT_DOWN_NUMBER_ACTION:
      return {
        ...state,
        smsSendCountDownNumber: action.payload,
      };
    default:
      return state;
  }
};
