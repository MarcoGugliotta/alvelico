import React, { useEffect, useState } from 'react';
import { Text, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Level, Movement, SubMovement, SubSubMovement } from '@/models/Models';
import { FIREBASE_AUTH, FIREBASE_DB } from '@/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { Constants } from '@/constants/Strings';
import CareerItem from '@/components/CareerItem';
import fetchSubMovementsFromStorage from '@/hooks/fetchSubMovementsFromStorage';
import { ActivityIndicator } from 'react-native-paper';

const Pages = () => {
  const { item } = useLocalSearchParams<{ item: string }>();
  const [submovements, setSubMovements] = useState<SubMovement[] | null>(null);
  const [loading, setLoading] = useState(false);

  const parsedItem = JSON.parse(item) as Movement;

  useEffect(() => {
    const fetchLevelData = async () => {
      try {
        if (FIREBASE_AUTH.currentUser) {
          let submovementsData = await fetchSubMovementsFromStorage(item);
          submovementsData!.sort((a, b) => a.progressive - b.progressive);
          setSubMovements(submovementsData!);
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
          data={submovements}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={
            <Text style={{fontSize:24, fontWeight:'bold', marginBottom: 30, marginTop: 10}}>Sequenze per il movimento {parsedItem?.label}</Text>
          }
          ListEmptyComponent={<Text>Nessuna sequenza trovata.</Text>}
          renderItem={({ item }) => (
            <CareerItem
              prop={{
                type: 'subsubmovements',
                hrefPath: 'subsubmovements',
                itemRefPath: item.ref!,
                onOpenBottomSheet: () => {}
              }}
            />
          )}
        />
      )}
    </>
  );
  
}

export default Pages;