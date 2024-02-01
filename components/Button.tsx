import React from 'react';
import { ColorValue, StyleSheet, TextStyle } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';
import { theme } from '@/theme/theme';

interface Props {
  mode?: "text" | "outlined" | "contained" | "elevated" | "contained-tonal" | undefined,
  style?: string,
  buttonColor?: string, 
  textColor?: ColorValue | undefined;
  children?: string | undefined;
  onPress?: () => Promise<void>;
}

export default function Button({ mode, style, buttonColor, textColor, ...props }: Props) {
  return (
    <PaperButton
      children={''}
      style={[
        styles.button,
        mode === 'outlined' && { backgroundColor: theme.colors.surface },
        buttonColor && { backgroundColor: buttonColor }, // Imposta il colore di sfondo se è stato fornito
        style,
      ]}
      labelStyle={[
        styles.text,
        { color: textColor ?? theme.colors.primary }, // Imposta il colore del testo se è stato fornito
      ]}
      mode={mode}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    marginVertical: 10,
    paddingVertical: 2,
  },
  text: {
    fontSize: 18,
    lineHeight: 26,
    fontFamily:'rale-sb'
  },
});
