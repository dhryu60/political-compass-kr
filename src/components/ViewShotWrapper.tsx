import React from 'react';
import ViewShot from 'react-native-view-shot';

export const ViewShotWrapper = React.forwardRef(({ children, style, ...props }: any, ref: any) => {
  return (
    <ViewShot ref={ref} style={style} {...props}>
      {children}
    </ViewShot>
  );
});
