import React from 'react';
import { View } from 'react-native';

export const ViewShotWrapper = React.forwardRef(({ children, style, ...props }: any, ref: any) => {
  return (
    <View style={style}>
      {children}
    </View>
  );
});
