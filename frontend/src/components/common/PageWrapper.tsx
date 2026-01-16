import React from 'react';

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="page-wrapper">{children}</div>;
};

export default PageWrapper;
