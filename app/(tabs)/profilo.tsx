import { FIREBASE_AUTH } from '@/firebaseConfig';
import { MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';

export default function TabProfiloScreen() {
  const handleLogout = () => {
    FIREBASE_AUTH.signOut(); // Chiama la funzione di logout di Firebase
  };

  const user = FIREBASE_AUTH.currentUser;

  return (
    <View>
      <Button onPress={() => handleLogout()}>
        Log out
      </Button>
      {user == null && (
        <Link href={'/(modals)/login'}>
          <Text>Login</Text>
        </Link>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  separator: {
    height: 1,
    marginVertical: 30,
    width: '80%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
