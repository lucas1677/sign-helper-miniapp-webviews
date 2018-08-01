import * as React from 'react';
import {connect} from 'react-redux';

import Pagination from '@src/app/components/Pagination';
import {fetchActivity, pageNav, showActivityDetail} from '@src/app/reducers/activity';
import {Activity, AppState, Page} from '@src/types/application';

type Props = {
  dataFetchUrl: string;
  page: Page;
  focusUserId: number;
  pageable: boolean;
  activities: Activity[];
  fetchActivityHandler: (dataFetchUrl: string, userId: number, pageIndex: number) => any;
  pageNavHandler: any;
  showActivityDetailHandler: any;
};

class ActivityList extends React.Component<Props> {

  componentDidMount() {
    if (this.props.focusUserId !== null) {
      this.props.fetchActivityHandler(this.props.dataFetchUrl, this.props.focusUserId, 1);
    } else {
      this.props.fetchActivityHandler(this.props.dataFetchUrl, null, 1);
    }
  }

  render() {
    const {
      dataFetchUrl,
      page,
      pageable,
      activities,
      pageNavHandler,
      showActivityDetailHandler,
    } = this.props;

    const pageNavHandlerWrapper = (pageIndex) => {
      return pageNavHandler(dataFetchUrl, pageIndex);
    };

    return (
      <div>
        {activities.length === 0
          ? (
            <div className="table-content">
              <div className="table-content-placeholder">
                - 暂无数据 -
              </div>
            </div>
          )
          : activities.map(meeting => (
            <div
              key={meeting.id}
              className="table-row content-row"
              onClick={() => showActivityDetailHandler(meeting.id)}
            >
              <div className="table-row-part flex-d-row">
                <div className="float-left">
                  <div className="flex-1 activity-text-row">
                    {meeting.title.substring(0, 20)}
                  </div>
                  <div className="flex-1 activity-text-row">
                    发布人: {meeting.position} {meeting.fullName}
                  </div>
                </div>
              </div>
              <div className="table-row-part">
                <div className="float-right">
                  <div className="flex-1 activity-text-row text-align-right">
                    {meeting.showTime}
                  </div>
                  <div className="flex-1 activity-text-row text-align-right">
                    签到人数: {meeting.signinNumber}
                  </div>
                </div>
              </div>
            </div>
          ))}
        {pageable ?
          <Pagination className="normal-list-pagination" page={page} clickHandler={pageNavHandlerWrapper}/>
          : ''
        }
      </div>
    );
  }
}

export default connect(
  (state: AppState) => ({
    page: state.activityLogic.page,
    activities: state.activityLogic.activities,
    focusUserId: state.activityLogic.focusUserId,
  }),
  {
    fetchActivityHandler: fetchActivity,
    pageNavHandler: pageNav,
    showActivityDetailHandler: showActivityDetail,
  }
)(ActivityList);
