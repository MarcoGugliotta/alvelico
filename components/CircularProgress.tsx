import React, { useCallback, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedProps,
  useDerivedValue,
  interpolateColor,
} from 'react-native-reanimated';
import { ReText } from 'react-native-redash';

import Svg, { Circle } from 'react-native-svg';
import { theme } from '../core/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedText = Animated.createAnimatedComponent(TextInput)

const radius = 45;
const circumference = radius * Math.PI * 2;
const duration = 6000;

export default function CircularProgress() {

  const strokeOffset = useSharedValue(circumference);

  const percentage = useDerivedValue(() => {
    const number = ((circumference - strokeOffset.value) / circumference ) * 100;
    return withTiming(number, {duration: duration});
  })

  const strokeColor = useDerivedValue(() => {
    return interpolateColor(
      percentage.value,
      [0, 50, 100],
      [theme.colors.primary, theme.colors.secondary, theme.colors.primary ]
    )
  });

  const animatedCircleProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: withTiming(strokeOffset.value, {duration: duration}),
      stroke: strokeColor.value,
    }
  })

  const animatedTextProps = useAnimatedProps(() => {
    return { text: `${Math.round(percentage.value)}%`, defaultValue: '0%' };
  });

  useEffect(() => {
    strokeOffset.value = 0;
  })

  return (
    <View style={styles.container}>
      <AnimatedText 
        style={styles.animatedText}
        animatedProps={animatedTextProps}
      />
      <Svg height="50" width="50" viewBox="0 0 100 100">
        <Circle 
        cx="50"
        cy="50"
        r="45"
        stroke={theme.colors.secondary}
        strokeWidth="10"
        fill="transparent"
        />
        <AnimatedCircle 
        animatedProps={animatedCircleProps}
        cx="50"
        cy="50"
        r="45"
        strokeDasharray={`${radius * Math.PI * 2}`}
        strokeWidth="10"
        fill="transparent"
        />
        <Circle 
        cx="50"
        cy="50"
        r="45"
        fill="transparent"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding:15
  },
  animatedText: {
    fontSize: 12,
    color: theme.colors.primary,
    position: 'absolute',
    fontWeight: 'bold'
  },
  svg: {
    height: '25%',
    width: '25%',
  }
});