import * as React from 'react';
import {connect} from 'react-redux';

import {getCaptcha, loginCaptchaC, loginPhoneNC, loginSubmit} from '@src/app/reducers/security';
import {AppState} from '@src/types/application';

type Props = {
  loginPhoneNumber: string;
  loginCaptcha: string;
  getCaptchaAvailable: boolean;
  smsSendCountDownNumber: number;
  loginPhoneNCHandler: any;
  loginCaptchaCHandler: any;
  getCaptchaHandler: any;
  loginSubmitHandler: any;
};

class Login extends React.Component<Props> {
  render() {
    const {
      loginPhoneNumber,
      loginCaptcha,
      smsSendCountDownNumber,
      getCaptchaHandler,
      loginSubmitHandler,
      loginPhoneNCHandler,
      loginCaptchaCHandler,
      getCaptchaAvailable,
    } = this.props;

    const handleLoginPhoneNumberChange = (evt) => {
      const val = evt.target.value;
      loginPhoneNCHandler(val);
    };

    const handleLoginCaptchaChange = (evt) => {
      const val = evt.target.value;
      loginCaptchaCHandler(val);
    };

    return (
      <div className="loginBg">
        <div className="login-dialog">
          <div className="login-dialog-header">
            登录小程序审核后台
          </div>
          <div className="login-dialog-content">
            <input
              type="text"
              className="login-phone-number"
              placeholder="手机号"
              value={loginPhoneNumber}
              onChange={handleLoginPhoneNumberChange}
            />
            <input
              type="text"
              className="login-captcha"
              placeholder="验证码"
              value={loginCaptcha}
              onChange={handleLoginCaptchaChange}
            />
            <button
              className={'login-get-captcha' + (getCaptchaAvailable ? '' : ' btn-disable')}
              onClick={getCaptchaHandler}
              disabled={!getCaptchaAvailable}
            >
              {getCaptchaAvailable ? '获取验证码' : `重新获取(${smsSendCountDownNumber})`}
            </button>
            <button className="operate-btn btn-success login-confirm-btn" onClick={loginSubmitHandler}>登录</button>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  (state: AppState) => ({
    loginPhoneNumber: state.securityLogic.loginPhoneNumber,
    loginCaptcha: state.securityLogic.loginCaptcha,
    getCaptchaAvailable: state.securityLogic.getCaptchaAvailable,
    smsSendCountDownNumber: state.securityLogic.smsSendCountDownNumber,
  }),
  {
    loginPhoneNCHandler: loginPhoneNC,
    loginCaptchaCHandler: loginCaptchaC,
    getCaptchaHandler: getCaptcha,
    loginSubmitHandler: loginSubmit,
  }
)(Login);
