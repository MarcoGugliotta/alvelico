import React from 'react'
import { StyleSheet, KeyboardAvoidingView } from 'react-native'
import { Text } from 'react-native-paper'
import { theme } from '../core/theme'

export default function Header(props) {
  return (
    <KeyboardAvoidingView behavior="padding">
      <Text style={styles.header} {...props} />
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 21,
    color: theme.colors.primary,
    fontWeight: 'bold',
    paddingVertical: 12,
    fontFamily:'rale-b'
  },
})
