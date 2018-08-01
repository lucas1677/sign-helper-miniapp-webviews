import * as React from 'react';

import UserAuthList from '@src/app/components/UserAuthList';
import {focusActivity} from '@src/app/reducers/activity';
import {USER_AUTH_STATE} from '@src/commons/const';
import {Activity, AppState} from '@src/types/application';
import {connect} from 'react-redux';

type Props = {
  activity: Activity;
  focusActivityHandler: any;
  match: any;
  history: any;
};

class ActivityDetail extends React.Component<Props> {

  constructor(props: Props) {
    super(props);
    this.goBack = this.goBack.bind(this); // i think you are missing this
  }

  componentDidMount() {
    this.props.focusActivityHandler(this.props.match.params.activityId);
  }

  goBack() {
    this.props.history.goBack();
  }

  render() {
    const {activity} = this.props;
    return (
      <div>
        {activity !== null ?
          <div>
            <div className="table-row content-row flex-d-column">
              <a className="nav-back-link" onClick={this.goBack}>&lt;返回用户列表</a>
              <div className="display-flex flex-d-row activity-detail-header-content">
                <div className="table-row-part flex-d-row">
                  <div className="float-left">
                    <div className="flex-1 activity-text-row-thin">{activity.title}</div>
                    <div className="flex-1 activity-text-row-thin">发布人: {activity.createUser.fullName}</div>
                  </div>
                </div>
                <div className="table-row-part">
                  <div className="float-right">
                    <div className="flex-1 activity-text-row-thin text-align-right">{activity.showTime}</div>
                    <div className="flex-1 activity-text-row-thin text-align-right">签到人数: {activity.signinNumber}</div>
                  </div>
                </div>
              </div>
            </div>
            <UserAuthList
              pageable={true}
              authState={USER_AUTH_STATE.NONE}
              autoLoad={false}
              signinCountNavAvailable={false}
            />
          </div>
          : ''}
      </div>
    );
  }
}

export default connect(
  (state: AppState, ownProps: any) => ({
    activity: state.activityLogic.focusActivity,
  }),
  {
    focusActivityHandler: focusActivity,
  }
)(ActivityDetail);
