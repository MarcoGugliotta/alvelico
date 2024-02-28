import React, { useEffect, useState } from 'react';
import { Text, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Level, Movement } from '@/models/Models';
import { FIREBASE_AUTH } from '@/firebaseConfig';
import CareerItem from '@/components/CareerItem';
import fetchMovementsFromStorage from '@/hooks/fetchMovementsFromStorage';
import { ActivityIndicator } from 'react-native-paper';

const Pages = () => {
  const { item } = useLocalSearchParams<{ item: string }>();
  const [movements, setMovements] = useState<Movement[] | null>(null);
  const [loading, setLoading] = useState(false);

  const parsedItem = JSON.parse(item) as Level;

  useEffect(() => {
    const fetchLevelData = async () => {
      try {
        if (FIREBASE_AUTH.currentUser) {
          let movementsData = await fetchMovementsFromStorage(item);
          movementsData!.sort((a, b) => a.progressive - b.progressive);
          setMovements(movementsData!);
          setLoading(false);
        } else {
          console.error('Nessun utente autenticato.');
          setLoading(false);
        }
      } catch (error) {
        console.error('Errore durante il recupero dei dati dei movimenti dell\'utente:', error);
        setLoading(false);
      }
    };
  
    fetchLevelData();
  }, []);


  return (
    <>
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <FlatList
          data={movements}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={
            <Text style={{fontSize:24, fontWeight:'bold', marginBottom: 30, marginTop: 10}}>Movimenti per il livello {parsedItem.label}</Text>
          }
          ListEmptyComponent={<Text>Nessun movimento trovato.</Text>}
          renderItem={({ item }) => (
            <CareerItem
              prop={{
                type: 'submovements',
                hrefPath: 'submovements',
                itemRefPath: item.ref!
              }}
            />
          )}
        />
      )}
    </>
  );
  
}

export default Pages;