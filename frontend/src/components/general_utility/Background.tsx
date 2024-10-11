import React, { FC } from 'react';

export const FlexBackground: FC<React.HTMLAttributes<HTMLDivElement>> = ({
  style,
  ...props
}) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        ...style,
      }}
      {...props}
    />
  );
};
