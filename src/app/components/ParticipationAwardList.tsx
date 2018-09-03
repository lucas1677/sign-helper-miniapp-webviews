import * as React from 'react';
import {connect} from 'react-redux';

import {loadParticipateAwardDetail} from '@src/app/reducers/appData';
import {AppState, RankItem} from '@src/types/application';

type Props = {
  rankItems: RankItem[];
  loadParticipateAwardDetailHandler: any;
};

class ParticipationAwardList extends React.Component<Props> {
  componentWillMount() {
    document.title = '中报酷赏-参与奖获奖名单';
    this.props.loadParticipateAwardDetailHandler();
  }

  render() {
    return (
      <div className="participation-award-list-page">
        <div className="award-page-top-title">
          <div className="mini-title">调研签到助手中报酷赏</div>
          <div className="big-title">参与奖获奖名单</div>
        </div>
        <div className="payload-content">
          <div className="award-l2-title">
            - 参与奖获奖名单 -
          </div>
          <div className="common-content scroll-box">
            {this.props.rankItems.map((i, index) => (
              <div className="award-item" key={index}>
                <div className="award-item-company">
                  {i.companyName}
                </div>
                <div className="award-item-personName">
                  {i.fullName}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  (
    state: AppState
  ) => ({
    rankItems: state.appData.rankItems,
  }),
  {
    loadParticipateAwardDetailHandler: loadParticipateAwardDetail,
  }
)(ParticipationAwardList);
