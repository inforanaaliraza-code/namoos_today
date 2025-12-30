/**
 * Mock for react-native-pdf on web
 * PDF viewing is not supported on web platform
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Pdf = React.forwardRef((props, ref) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        PDF viewing is not available on web platform.
        Please use the mobile app to view PDF documents.
      </Text>
    </View>
  );
});

Pdf.displayName = 'Pdf';

export default Pdf;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  text: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
  },
});

