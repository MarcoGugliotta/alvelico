import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { Link, Stack } from 'expo-router';
import HomeHeader from '@/components/HomeHeader';
import Listings from '@/components/Listings';
import { StatusBar } from 'expo-status-bar';

export default function TabHomeScreen() {
  return (
    <View style={{flex: 1}}>
        <Stack.Screen options={{
          header: () => <HomeHeader/>,
        }} 
      />
      <StatusBar style='dark'></StatusBar>
      <ImageBackground source={require('@/assets/bg_img2.png')} style={styles.image}>
        <Listings />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  image: {
    flex: 1,
    justifyContent:'center',
    resizeMode:'contain'
  }
});
