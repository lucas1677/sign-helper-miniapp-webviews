import * as React from 'react';
import {connect} from 'react-redux';

import ActivityList from '@src/app/components/ActivityList';
import {fetchUserSigninActivityUrl} from '@src/app/lib/activityService';
import {focusUser} from '@src/app/reducers/activity';
import {AppState, User} from '@src/types/application';

type Props = {
  user: User;
  match: any;
  focusUserHandler: any;
  history: any;
};

class UserSingInActivityList extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.goBack = this.goBack.bind(this); // i think you are missing this
  }

  componentDidMount() {
    this.props.focusUserHandler(this.props.match.params.userId);
  }

  goBack() {
    this.props.history.goBack();
  }

  render() {
    const {user} = this.props;
    return (
      <div>
        {user !== null ?
          <div>
            <div className="table-row content-row user-sign-in-activities-header">
              <div className="table-row-part flex-d-row">
                <div className="float-left">
                  <div className="flex-1"><a className="nav-back-link" onClick={this.goBack}>&lt;返回用户列表</a>
                  </div>
                  <div className="flex-1">
                    <div className="nav-back-username">{user.fullName}&nbsp;签到过的会议:</div>
                  </div>
                </div>
              </div>
            </div>
            <ActivityList dataFetchUrl={fetchUserSigninActivityUrl} pageable={true}/>
          </div>
          : ''}
      </div>
    );
  }
}

export default connect(
  (state: AppState, ownProps: any) => ({
    user: state.activityLogic.focusUser,
  }),
  {
    focusUserHandler: focusUser,
  }
)(UserSingInActivityList);
