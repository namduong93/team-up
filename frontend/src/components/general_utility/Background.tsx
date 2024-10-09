import React, { FC } from 'react';

export const FlexBackground: FC<React.HTMLAttributes<HTMLDivElement>> = ({
  style,
  ...props
}) => {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        ...style,
      }}
      {...props}
    />
  );
};
