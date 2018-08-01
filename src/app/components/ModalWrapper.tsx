import * as React from 'react';

type Props = {
  show: boolean;
};

class ModalWrapper extends React.Component<Props> {
  render() {

    const {show} = this.props;

    return (
      <div className={'modal-hover' + (show ? '' : ' hidden')}>
        <div className="modal-content">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default ModalWrapper;
