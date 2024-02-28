import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Level, Movement, SubMovement, SubSubMovement } from '@/models/Models';
import { FIREBASE_AUTH, FIREBASE_DB } from '@/firebaseConfig';
import { CollectionReference, DocumentData, collection, getDocs, onSnapshot } from 'firebase/firestore';
import { Constants } from '@/constants/Strings';
import CareerItem from '@/components/CareerItem';
import fetchSubSubMovementsFromStorage from '@/hooks/fetchSubSubMovementsFromStorage';
import { ActivityIndicator } from 'react-native-paper';

const Pages = () => {
  const { item } = useLocalSearchParams<{ item: string }>();
  const [subsubmovements, setSubSubMovements] = useState<SubSubMovement[] | null>(null);
  const [loading, setLoading] = useState(false);

  const parsedItem = JSON.parse(item) as SubMovement;

  useEffect(() => {
    const fetchLevelData = async () => {
      try {
        if (FIREBASE_AUTH.currentUser) {
          let subsubmovementsData = await fetchSubSubMovementsFromStorage(item);
          subsubmovementsData!.sort((a, b) => a.progressive - b.progressive);
          setSubSubMovements(subsubmovementsData!);
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
          data={subsubmovements}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={
            <Text style={{fontSize:24, fontWeight:'bold', marginBottom: 30, marginTop: 10}}>Sotto Sequenze per la sequenza {parsedItem?.label}</Text>
          }
          ListEmptyComponent={<Text>Nessuna sotto sequenza trovata.</Text>}
          renderItem={({ item }) => (
            <CareerItem
              prop={{
                type: 'subsubmovements',
                hrefPath: undefined,
                itemRefPath: item.ref!,
              }}
            />
          )}
        />
      )}
    </>
  );
  
}

export default Pages;