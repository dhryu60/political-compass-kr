import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';

export default function RootLayout() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#05070F' }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#05070F',
  }
});
