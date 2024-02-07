import { FIREBASE_AUTH } from '@/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack, useRouter } from 'expo-router';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect, useCallback } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    'rale': require('../assets/fonts/Raleway-Regular.ttf'),
    'rale-sb': require('../assets/fonts/Raleway-SemiBold.ttf'),
    'rale-b': require('../assets/fonts/Raleway-Bold.ttf')
  });

  useEffect(() => {
    if(error) throw error;
  }, [error]);

  useEffect(() => {
    if(fontsLoaded){
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if(!fontsLoaded){
    return null;
  }

  return <RootLayoutNav/>;
}

function RootLayoutNav(){
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if(user != null){
        router.push('/(tabs)')
      }else{
        setUser(user);
        router.push('/(modals)/login')
      }
    })
  },[user])

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(modals)/login" options={{
        headerTitleStyle: {
          fontFamily: 'rale-sb'
        },
        title: 'Entra oppure registrati',
        presentation: 'modal',
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close-circle-outline" size={28} color="black" />
          </TouchableOpacity>
        ),
      }}/>
      <Stack.Screen name="listing/[id]" options={{
        headerTitle: ''
      }}/>
      <Stack.Screen name="listing/submovements" options={{
        headerTitle: ''
      }}/>
      <Stack.Screen name="listing/subsubmovements" options={{
        headerTitle: ''
      }}/>
    </Stack>
  );
}
