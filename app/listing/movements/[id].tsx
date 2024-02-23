import React, { useEffect, useState } from 'react';
import { Text, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Level, Movement, SubMovement, SubSubMovement } from '@/models/Models';
import { FIREBASE_AUTH, FIREBASE_DB } from '@/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { Constants } from '@/constants/Strings';
import CareerItem from '@/components/CareerItem';
import { useRoute } from '@react-navigation/native';

const Pages = () => {
  const { id, item } = useLocalSearchParams<{ id: string, item: string }>();
  const [level, setLevel] = useState<Level | null>(null);
  const [movements, setMovements] = useState<Movement[] | null>(null);
  const [loading, setLoading] = useState(false);

  const parsedItem = JSON.parse(item) as Level;
  //setLevel(parsedItem);

  useEffect(() => {
    const fetchLevelData = async () => {
      try {
        setLoading(true);
        if (FIREBASE_AUTH.currentUser && parsedItem?.id) {
          const movementsIntRef = collection(FIREBASE_DB, Constants.Users, FIREBASE_AUTH.currentUser.uid, Constants.Career, parsedItem.id, Constants.Movements);
          const querySnapshotM = await getDocs(movementsIntRef);
            console.log('2')
            setLoading(true);
            const movements: Movement[] = [];
            querySnapshotM.forEach(async (doc) => {
              const movementData = doc.data() as Movement;
              const movementId = doc.id;
              movementData.ref = doc.ref;
              movementData.id = movementId;
              movements.push(movementData);
            });
            movements.sort((a, b) => a.progressive - b.progressive);
            setMovements(movements);
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
            itemRef: item.ref!
          }}
        />
      )}
    />
  );
  
}

export default Pages;