import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';
import { FIREBASE_AUTH } from '@/firebaseConfig';
import { Level } from '@/models/Models';
import CareerItem from '@/components/CareerItem';
import fetchLevelsFromStorage from '@/hooks/fetchLevelsFromStorage';
import { ActivityIndicator } from 'react-native-paper';

export default function TabCarrieraScreen() {
  const [levels, setLevels] = useState<Level[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserCareerData = async () => {
      try {
        if (FIREBASE_AUTH.currentUser) {
          let careerData = await fetchLevelsFromStorage(FIREBASE_AUTH.currentUser);
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
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <FlatList
          data={levels}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={
            <Text style={styles.header}>Carriera Windsurf</Text>
          }
          renderItem={({ item }) => (
            <CareerItem
              prop={{
                type: 'movements',
                hrefPath: 'movements',
                itemRefPath: item.ref! // Assicurati che item.ref sia definito in base ai tuoi dati
              }}
            />
          )}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    marginTop: 10,
    textAlign: 'center'
  },
});
