import { router, useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';

const { height: screenHeight } = Dimensions.get('window');
const topPercentage = 8; // Imposta il valore percentuale desiderato

export default function BackButton(goBack: any) {
  return (
    <TouchableOpacity onPress={goBack} style={[styles.container, { top: 10 }]}>
      <Image
        style={styles.image}
        source={require('assets/icons/arrow_back.png')}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 5,
  },
  image: {
    width: 24,
    height: 24,
  },
});
