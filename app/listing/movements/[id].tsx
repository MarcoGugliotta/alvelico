import React, { useEffect, useState } from 'react';
import { Text, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Level, Movement, SubMovement, SubSubMovement } from '@/models/Models';
import { FIREBASE_AUTH, FIREBASE_DB } from '@/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { Constants } from '@/constants/Strings';
import CareerItem from '@/components/CareerItem';
import { useRoute } from '@react-navigation/native';
import fetchMovementsFromStorage from '@/hooks/fetchMovementsFromStorage';

const Pages = () => {
  const { id, item } = useLocalSearchParams<{ id: string, item: string }>();
  const [movements, setMovements] = useState<Movement[] | null>(null);
  const [loading, setLoading] = useState(false);

  const parsedItem = JSON.parse(item) as Level;
  //setLevel(parsedItem);

  useEffect(() => {
    const fetchLevelData = async () => {
      try {
        setLoading(true);
        if (FIREBASE_AUTH.currentUser) {
          let movementsData = await fetchMovementsFromStorage(FIREBASE_AUTH.currentUser, item);
          movementsData!.sort((a, b) => a.progressive - b.progressive);
          setMovements(movementsData!);
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
  
    fetchLevelData();
  }, []);


  return (
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
  );
  
}

export default Pages;