import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Dimensions, Platform } from 'react-native';
import { theme } from '../core/theme';

export default function Background({ children }) {
  return (
    <View style={styles.background}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {children}
      </KeyboardAvoidingView>
    </View>
  );
}

const { width: screenWidth } = Dimensions.get('window');
const maxWidthPercentage = 80;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    backgroundColor: theme.colors.surface,
  },
  container: {
    flex: 1,
    padding: 20,
    width: '100%',
    maxWidth: (screenWidth * maxWidthPercentage) / 100,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
