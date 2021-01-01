import React from 'react';
import styles from './BaseLayout.less';

const Layout: React.FC<{}> = (props) => {
  const { children } = props;

  return (
    <div className={styles.index}>{children}</div>
  )
};
export default Layout;
