import React from 'react';

const Layout: React.FC<{}> = (props) => {
  const { children } = props;

  return (
    <div>
      <h1>我是设计器导航</h1>
      {children}
    </div>
  )
};
export default Layout;
