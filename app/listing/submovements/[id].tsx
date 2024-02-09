import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import { Level, Movement, SubMovement, SubSubMovement } from '@/models/Models';
import { countCompletedItems, countInProgressItems, formatTimestampToString } from '@/hooks/utils';
import { FIREBASE_AUTH, FIREBASE_DB } from '@/firebaseConfig';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { Constants } from '@/constants/Strings';
import CareerItem from '@/components/CareerItem';

const Pages = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [movement, setMovement] = useState<Movement | null>(null);
  const [submovements, setSubMovements] = useState<SubMovement[] | null>(null);
  const [subsubmovements, setSubSubMovements] = useState<SubSubMovement[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLevelData = async () => {
      try {
        setLoading(true);
        if (FIREBASE_AUTH.currentUser) {
          const userId = FIREBASE_AUTH.currentUser.uid;
          const q = collection(FIREBASE_DB, Constants.Users, userId, Constants.Career);
          const levelsDoc: Level[] = [];
          const unsubscribeMovements: (() => void)[] = [];
          const querySnapshot = await getDocs(q);

          querySnapshot.forEach(async (doc) => {
            const levelData = doc.data() as Level;
            const levelId = doc.id;
            levelData.id = levelId;
            const movementsIntRef = collection(FIREBASE_DB, Constants.Users, userId, Constants.Career, levelId, Constants.Movements);
            const querySnapshotM = await getDocs(movementsIntRef);
            const movements: Movement[] = [];

            querySnapshotM.forEach(async (doc) => {
              const movementData = doc.data() as Movement;
              const movementId = doc.id;
              movementData.id = movementId;
              movements.push(movementData);
              
              if(movementId === id){
                setMovement(movementData);
                const submovementsIntRef = collection(FIREBASE_DB, Constants.Users, userId, Constants.Career, levelId, Constants.Movements, movementId, Constants.SubMovements);
                const querySnapshotSM = await getDocs(submovementsIntRef);
  
                if(querySnapshotSM.size > 0){
                  const unsubscribe = onSnapshot(submovementsIntRef, async (querySnapshotSM) => {
                    const submovements: SubMovement[] = [];
                    querySnapshotSM.forEach(async (doc) => {
                      const submovementData = doc.data() as SubMovement;
                      const submovementId = doc.id;
                      submovementData.id = submovementId;
                      submovements.push(submovementData);
  
                      const subsubmovementsIntRef = collection(FIREBASE_DB, Constants.Users, userId, Constants.Career, levelId, Constants.Movements, movementId, Constants.SubMovements, submovementId, Constants.SubSubMovements);
                      const querySnapshotSSM = await getDocs(subsubmovementsIntRef);
  
                      if(querySnapshotSSM.size > 0){
                        const unsubscribeSSM = onSnapshot(subsubmovementsIntRef, async (querySnapshotSSM) => {
                          const subsubmovements: SubSubMovement[] = [];
                          querySnapshotSSM.forEach(async (doc) => {
                            const subsubmovementData = doc.data() as SubSubMovement;
                            const subsubmovementId = doc.id;
                            subsubmovementData.id = subsubmovementId;
                            subsubmovements.push(subsubmovementData);
                          });
                          const index = submovements.findIndex((submovement) => submovement.id === submovementId);
                          if (index !== -1) {
                            submovements[index].subSubMovements = subsubmovements;
                          }
                          setSubSubMovements(subsubmovements);
                        });
                        unsubscribeMovements.push(unsubscribeSSM);
                      }
                    });
                    const index = movements.findIndex((movement) => movement.id === movementId);
                    if (index !== -1) {
                      movements[index].subMovements = submovements;
                    }
                    submovements.sort((a, b) => a.progressive - b.progressive);
                    setSubMovements(submovements);
                  });
                  unsubscribeMovements.push(unsubscribe);
                }
              }
          });
        });
        
        await Promise.all(unsubscribeMovements);

        setLoading(false);
        return () => {
            unsubscribeMovements.forEach((unsubscribe: () => any) => unsubscribe()); // Correzione della chiamata a forEach
          }
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
    <ScrollView>
      <Text style={{fontSize:24, fontWeight:'bold', marginBottom: 30, marginTop: 10}}>Sequenze per il movimento {movement?.label}</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : submovements && FIREBASE_AUTH.currentUser ? (
        <View style={{ flex: 1, gap: 15 }}>
          {submovements.map((submovement, index) => (
            <CareerItem key={index} prop={{
              type: 'subsubmovements',
              item: submovement,
              hrefPath: 'subsubmovements',
              subItems: submovement.subSubMovements
            }}></CareerItem>
          ))}
        </View>
      ) : (
        <Text>Nessuna sequenza trovata.</Text>
      )}
    </ScrollView>
  );
}

export default Pages;