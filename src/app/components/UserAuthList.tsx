import * as React from 'react';
import {connect} from 'react-redux';

import Pagination from '@src/app/components/Pagination';
import {COMPANY_TYPE, USER_AUTH_STATE, USER_CATEGORY} from '@src/commons/const';
import noBusinessCardImg from '@src/resource/image/no-bussiness-card.png';
import {AppState, Page, User} from '@src/types/application';
import {
  authUser,
  fetchUsers, filterUserBuyAuthState,
  showAuthUnpassDialog, showSignedActivity, userPageNav
} from '../reducers/user';

type Props = {
  autoLoad: boolean;
  signinCountNavAvailable: boolean;
  pageable: boolean;
  authState: number;
  page: Page;
  pageSize: number;
  users: User[];
  pageNavHandler: any;
  fetchUserHandler: any;
  authUserHandler: (id: number, authState: number, userCategory: number) => any;
  showAuthUnpassDialogHandler: any;
  showSignedActivityHandler: any;
  match: any;
};

class UserAuthList extends React.Component<Props> {

  componentDidMount() {
    if (this.props.autoLoad) {
      this.props.fetchUserHandler(this.props.authState, 1);
    }
  }

  render() {
    const {
      signinCountNavAvailable,
      pageable,
      users,
      page,
      authUserHandler,
      showAuthUnpassDialogHandler,
      showSignedActivityHandler,
      pageNavHandler,
    } = this.props;

    const genUserOpBtns = (user: User) => {

      const authFailBtn = (tmpUser: User) => {
        return (tmpUser.authenticateState !== USER_AUTH_STATE.DENY ? (
          <button
            className="operate-btn btn-warn"
            onClick={() => showAuthUnpassDialogHandler(tmpUser.id)}
          >
            不通过
          </button>) : <button className="operate-btn  btn-disable" disabled={true}>不通过</button>);
      };

      const authSuccessBtn = (tmpUser: User) => {
        if (tmpUser.companyType === COMPANY_TYPE.Insti) {
          return (
            <button
              className={'operate-btn' + (tmpUser.authenticateState !== USER_AUTH_STATE.PASS ? ' btn-info' : ' btn-disable')}
              disabled={tmpUser.authenticateState === USER_AUTH_STATE.PASS}
              onClick={() => authUserHandler(tmpUser.id, USER_AUTH_STATE.PASS, null)}
            >
              通过
            </button>
          );
        } else {
          return (
            <div>
              <button
                className={'operate-btn' + (tmpUser.userCategory === USER_CATEGORY.Company.IR && tmpUser.authenticateState === USER_AUTH_STATE.PASS ? ' btn-disable' : ' btn-info')}
                disabled={tmpUser.userCategory === USER_CATEGORY.Company.IR && tmpUser.authenticateState === USER_AUTH_STATE.PASS}
                onClick={() => authUserHandler(tmpUser.id, USER_AUTH_STATE.PASS, USER_CATEGORY.Company.IR)}
              >
                IR
              </button>
              <button
                className={'operate-btn' + (tmpUser.userCategory !== USER_CATEGORY.Company.IR && tmpUser.authenticateState === USER_AUTH_STATE.PASS ? ' btn-disable' : ' btn-info')}
                disabled={tmpUser.userCategory !== USER_CATEGORY.Company.IR && tmpUser.authenticateState === USER_AUTH_STATE.PASS}
                onClick={() => authUserHandler(tmpUser.id, USER_AUTH_STATE.PASS, USER_CATEGORY.Company.NONE_IR)}
              >
                非IR
              </button>
            </div>
          );
        }
      };

      return (
        <div className="button-group-wrapper">
          {authFailBtn(user)}
          {authSuccessBtn(user)}
        </div>
      );

    };

    const pageNavClickHandler = () => {
      return (id) => pageNavHandler(this.props.authState, id);
    };

    return (
      <div>
        <div className="table-header content-row">
          <span className="table-header-item text-align-left">用户个人资料 | 来源</span>
          <span className="table-header-item">审核结果</span>
        </div>
        {users.length === 0
          ? (
            <div className="table-content">
              <div className="table-content-placeholder">
                - 暂无数据 -
              </div>
            </div>
          )
          : users.map(user => (
            <div key={user.id} className="table-row content-row">
              <div className="table-row-part flex-d-row">
                <img
                  className="company-card-img-holder float-left"
                  src={user.businessCard !== null ? user.businessCard : noBusinessCardImg}
                />
                {noBusinessCardImg}
                <div className="custom-info float-left">
                  <div className="flex-1">
                    {user.companyType === COMPANY_TYPE.Insti ? user.companySubTypeName : '上市公司'}
                    {!(user.signinCount > 0) ?
                      '' :
                      <div
                        className="activity-sign-count"
                        onClick={
                          signinCountNavAvailable
                            ? () => showSignedActivityHandler(user.id)
                            : () => ({})
                        }
                      >
                        签到过{user.signinCount}场会议
                      </div>
                    }
                  </div>
                  <div className="flex-1">
                    {user.fullName ? user.fullName + ' ' : ''}{user.position}
                  </div>
                  <div className="flex-1">
                    {user.mobile}
                  </div>
                  <div className="flex-1">
                    {user.companyName}
                  </div>
                </div>
              </div>
              <div className="table-row-part">
                {genUserOpBtns(user)}
              </div>
            </div>
          ))}
        {pageable ?
          <Pagination className="normal-list-pagination" page={page} clickHandler={pageNavClickHandler()}/>
          : ''
        }
      </div>
    );
  }
}

export default connect((
  state: AppState,
  props: any
  ) => ({
    page: state.userLogic.page,
    users: filterUserBuyAuthState(state.userLogic.users, props.authState),
  }),
  {
    fetchUserHandler: fetchUsers,
    authUserHandler: authUser,
    showAuthUnpassDialogHandler: showAuthUnpassDialog,
    pageNavHandler: userPageNav,
    showSignedActivityHandler: showSignedActivity,
  }
)
(UserAuthList);
