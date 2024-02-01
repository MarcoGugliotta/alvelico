import { StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';

export default function TabHomeScreen() {
  return (
    <View>
      <Link href={"/(modals)/login"}>Login</Link>
      <Link href={"/listing/123"}>Listing details</Link>
    </View>
  );
}

const styles = StyleSheet.create({

});
