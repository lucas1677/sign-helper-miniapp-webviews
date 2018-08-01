import * as React from 'react';

import {MESSAGE_TYPE} from '@src/commons/const';

type Props = {
  message: string;
  type: number;
};

class Message extends React.Component<Props> {
  render() {
    return (
      this.props.type === MESSAGE_TYPE.DEBUG
        ? (
          <div className="message-wrapper">
            <div className="message-default">
              DEBUG INFO: <i className="icon-icons8-ok"/>
              <hr/>
              {this.props.message}
            </div>
          </div>
        )
        : (
          <div>
            <i className="icon-icons8-ok"/>
          </div>
        )
    );
  }
}

export default Message;
