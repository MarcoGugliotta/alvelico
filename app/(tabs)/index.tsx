import { StyleSheet, Text, View } from 'react-native';
import { Link, Stack } from 'expo-router';
import HomeHeader from '@/components/HomeHeader';
import Listings from '@/components/Listings';

export default function TabHomeScreen() {
  return (
    <View style={{flex: 1}}>
        <Stack.Screen options={{
          header: () => <HomeHeader/>,
        }} 
      />
      <Listings />
    </View>
  );
}

const styles = StyleSheet.create({

});
