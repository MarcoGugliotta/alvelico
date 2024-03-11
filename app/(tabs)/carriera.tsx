import { useEffect, useState } from 'react';
import { FlatList, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { FIREBASE_AUTH } from '@/firebaseConfig';
import { Level } from '@/models/Models';
import CareerItem from '@/components/CareerItem';
import fetchLevelsFromStorage from '@/hooks/fetchLevelsFromStorage';
import { ActivityIndicator } from 'react-native-paper';
import { StatusBar, StatusBarProps } from 'expo-status-bar';

export default function TabCarrieraScreen(props: StatusBarProps) {
  const [levels, setLevels] = useState<Level[] | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUserCareerData = async () => {
      try {
        if (FIREBASE_AUTH.currentUser) {
          let careerData = await fetchLevelsFromStorage(FIREBASE_AUTH.currentUser);
          console.log(careerData?.levels[0].ref)
          careerData!.levels.sort((a, b) => a.progressive - b.progressive);
          setLevels(careerData!.levels);
          setLoading(false);
        } else {
          console.error('Nessun utente autenticato.');
          setLoading(false);
        }
      } catch (error) {
        console.error('Errore durante il recupero dei dati della carriera dell\'utente:', error);
        setLoading(false);
      }
    };
    fetchUserCareerData();
  }, []);

  return (
    <>
    <StatusBar style='light'></StatusBar>
      <ImageBackground source={require('@/assets/bg_img2.png')} style={styles.image}>  
        {loading ? (
          <ActivityIndicator size="large" color="blue" />
        ) : (
          <FlatList
            data={levels}
            keyExtractor={(item, index) => index.toString()}
            ListHeaderComponent={
              <View style={styles.headerContainer}>
                <Text style={styles.header}>Carriera</Text>
                <Text style={styles.headerParagraph}>Benvenuto nella tua carriera</Text>
                <Text style={styles.headerParagraph}>Completa tutti i livelli per diventare un PRO!</Text>
              </View>
            }
            renderItem={({ item }) => (
              <CareerItem
                prop={{
                  type: 'movements',
                  hrefPath: 'movements',
                  itemRefPath: item.ref!,
                  onOpenBottomSheet: () => {}
                }}
              />
            )}
          />
        )}
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flex:1,
    alignItems:'center',
    marginVertical:70,
    marginHorizontal:20
  },
  header: {
    fontSize: 32,
    textAlign: 'center',
    fontFamily:'rale-b',
    color:'white',
    padding: 20
  },
  headerParagraph: {
    fontSize: 18,
    textAlign: 'center',
    fontFamily:'rale-sb',
    color:'white',
    padding: 4
  },
  image: {
    flex: 1,
    justifyContent:'center',
    resizeMode:'contain'
  }
});
