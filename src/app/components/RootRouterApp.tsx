import * as React from 'react';

import {ConnectedRouter} from 'connected-react-router';
import {History} from 'history';
import {connect} from 'react-redux';
import {Redirect, Route, Switch} from 'react-router';

import ParticipationAwardList from '@src/app/components/ParticipationAwardList';
import SignInActivityRuleDetail from '@src/app/components/SignInActivityRuleDetail';
import {AppState} from '@src/types/application';

type Props = {
    history: History;
};

class RootRouterApp extends React.Component<Props> {

    render() {
        return (
            <ConnectedRouter history={this.props.history}>
                <SignInActivityRuleDetail>
                    <Switch>
                        <Redirect exact={true} from="/" to="/sign-in-activity-rule-detail"/>
                        <Route path="/sign-in-activity-rule-detail" component={SignInActivityRuleDetail}/>
                        <Route path="/participation-award-list" component={ParticipationAwardList}/>
                    </Switch>
                </SignInActivityRuleDetail>
            </ConnectedRouter>
        );
    }
}

export default connect(
    (state: AppState) => ({}),
    {}
)(RootRouterApp);
