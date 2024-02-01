import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { Logo as LogoImage }  from '../../Images';

export default function Logo() {
  return <Image source={LogoImage} style={styles.image} />;
}

const styles = StyleSheet.create({
  image: {
    width: 230,
    height: 230,
    marginBottom: 8,
  },
});