import * as React from 'react';

import {ConnectedRouter} from 'connected-react-router';
import {History} from 'history';
import {connect} from 'react-redux';
import {Redirect, Route, Switch} from 'react-router';

import Application from '@src/app/components/Application';
import Login from '@src/app/components/Login';
import Message from '@src/app/components/Message';
import Root from '@src/app/components/Root';
import {verifyToken} from '@src/app/reducers/security';
import {MESSAGE_TYPE} from '@src/commons/const';
import {AppState} from '@src/types/application';

type Props = {
  history: History;
  verifyTokenHandler: any;
  message: string;
};

class RootRouterApp extends React.Component<Props> {
  componentDidMount() {
    this.props.verifyTokenHandler();
  }

  render() {
    const {message} = this.props;
    return (
      <ConnectedRouter history={this.props.history}>
        <Root>
          <Switch>
            <Redirect exact={true} from="/" to="/application"/>
            <Redirect exact={true} from="/application" to="/application/auth-wait/users"/>
            <Redirect exact={true} from="/application/auth-wait" to="/application/auth-wait/users"/>
            <Redirect exact={true} from="/application/auth-finish" to="/application/auth-finish/pass"/>
            <Route path="/auth" component={Login}/>
            <Route path="/application" component={Application}/>
          </Switch>
          <Message message={message} type={MESSAGE_TYPE.DEBUG}/>
        </Root>
      </ConnectedRouter>
    );
  }
}

export default connect(
  (state: AppState) => ({
    message: state.message,
  }),
  {
    verifyTokenHandler: verifyToken,
  }
)(RootRouterApp);
