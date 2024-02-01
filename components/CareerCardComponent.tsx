import React from 'react';
import { TouchableOpacity, StyleSheet, View} from 'react-native';
import { Card, Text } from 'react-native-paper';

interface Props {
  img: any;
  width: number;
  height: number;
  title: string;
  subTitle: string;
  topTitleOverLay: number;
  onPress: () => void;
}

export default function CareerCardComponent({
  img,
  width,
  height,
  title,
  subTitle,
  topTitleOverLay,
  onPress
}: Props) {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.7} onPress={onPress}>
      <Card>
        <Card.Cover source={img} style={[styles.career, { width, height }]} />
        <View style={[styles.textOverlay, { top: topTitleOverLay }]}>
          <Text variant='displaySmall' style={styles.textTitle}>{title}</Text>
          <Text variant='labelLarge' style={styles.textSubTitle}>{subTitle}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  career: {},
  textOverlay: {
    position: 'absolute',
    marginLeft: 20,
  },
  textTitle: {
    fontFamily:'rale-sb',
    color:'white'
  },
  textSubTitle: {
    fontFamily:'rale-r',
    color:'white'
  },
});
