import * as React from 'react';

import {GLOBAL_PAGE_SHOW_FLOAT_RANGE} from '@src/commons/config';
import {Page} from '@src/types/application';

type Props = {
  page: Page;
  clickHandler: any;
  style?: any;
  className?: string;
};

class Pagination extends React.Component<Props> {

  render() {
    const {page, clickHandler} = this.props;
    const clickHandlerWrapper = (evt) => clickHandler(evt.target.value);

    return (
      <div style={...this.props.style} className={this.props.className}>
        <button
          key={'-1'}
          className={'btn' + (page.prevPageAvailable ? ' btn-default' : ' btn-disable')}
          disabled={!page.prevPageAvailable}
          onClick={clickHandlerWrapper}
          value={'-1'}
        >
          {'<'}
        </button>
        {this.props.page.pages.map(p =>
          (p > this.props.page.currentPageIndex - GLOBAL_PAGE_SHOW_FLOAT_RANGE)
          && (p < this.props.page.currentPageIndex + GLOBAL_PAGE_SHOW_FLOAT_RANGE)
            ? (
              <button
                key={p}
                className={'btn' + (p === this.props.page.currentPageIndex ? ' btn-info' : ' btn-default')}
                disabled={p === this.props.page.currentPageIndex}
                onClick={clickHandlerWrapper}
                value={p}
              >
                {p}
              </button>
            )
            : ''
        )
        }
        <button
          key={'+1'}
          className={'btn' + (page.nextPageAvailable ? ' btn-default' : ' btn-disable')}
          disabled={!page.nextPageAvailable}
          onClick={clickHandlerWrapper}
          value={'+1'}
        >
          {'>'}
        </button>
      </div>
    );
  }
}

export default Pagination;
