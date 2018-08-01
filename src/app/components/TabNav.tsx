import * as React from 'react';

import {TabItem} from '@src/types/application';

type Props = {
  tabs: TabItem[];
  toggleTabHandler: any;
  second: boolean;
  checkPathHandler: any;
};

class TabNav extends React.Component<Props> {
  componentDidMount() {
    this.props.checkPathHandler(window.location.href);
  }

  render() {

    const {toggleTabHandler, second, tabs} = this.props;

    // we can get customized param & event object in this way
    const clickHandler = (tabItem) => (evt) => {
      if (tabItem.isActive === false) {
        toggleTabHandler(tabItem);
      }
    };

    return (
      <div className={second ? 'switch-item-group' : 'tab-nav'}>
        {
          tabs.map(
            t => (
              <div
                key={t.id}
                className={second ? 'switch-item' + (t.isActive ? ' active' : '') : 'tab-nav-item' + (t.isActive ? ' active' : '')}
                onClick={clickHandler(t)}
              >
                {t.title}
              </div>
            )
          )
        }
      </div>
    );
  }
}

export default TabNav;
