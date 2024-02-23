import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';
import { FIREBASE_DB, FIREBASE_AUTH } from '@/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { Career, Level, Movement } from '@/models/Models';
import { Constants } from '@/constants/Strings';
import CareerItem from '@/components/CareerItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native-paper';

export default function TabCarrieraScreen() {
  const [levels, setLevels] = useState<Level[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserCareerData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('careerData');
        const parsed = JSON.parse(storedData!) as Career;
        setLoading(true);
        if (FIREBASE_AUTH.currentUser) {
          const userId = FIREBASE_AUTH.currentUser.uid;
          const q = collection(FIREBASE_DB, Constants.Users, userId, Constants.Career);
          const querySnapshot = await getDocs(q);
          console.log('1')
          const levelsDoc: Level[] = [];
          querySnapshot.forEach(async (doc) => {
            const levelData = doc.data() as Level;
            const levelId = doc.id;
            levelData.ref = doc.ref;
            levelData.id = levelId;
            levelsDoc.push(levelData);
          });
          levelsDoc.sort((a, b) => a.progressive - b.progressive);
          setLevels(levelsDoc);
          setTimeout(() => {
            setLoading(false);
          }, 2000)
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
      {!loading ? (
        <FlatList
          data={levels}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 30, marginTop: 10 }}>Carriera Windsurf</Text>
          }
          renderItem={({ item }) => (
            <CareerItem
              prop={{
                type: 'movements',
                hrefPath: 'movements',
                itemRef: item.ref!
              }}
            />
          )}
        />
      ) : (
        <ActivityIndicator size="large" color="blue" />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
