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
  const [submovement, setSubMovement] = useState<SubMovement | null>(null);
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

                const submovementsIntRef = collection(FIREBASE_DB, Constants.Users, userId, Constants.Career, levelId, Constants.Movements, movementId, Constants.SubMovements);
                const querySnapshotSM = await getDocs(submovementsIntRef);

                if(querySnapshotSM.size > 0){
                    const submovements: SubMovement[] = [];
                    querySnapshotSM.forEach(async (doc) => {
                        const submovementData = doc.data() as SubMovement;
                        const submovementId = doc.id;
                        submovementData.id = submovementId;
                        submovements.push(submovementData);

                        if(submovementId === id){
                            setSubMovement(submovementData);
                            const subsubmovementsIntRef = collection(FIREBASE_DB, Constants.Users, userId, Constants.Career, levelId, Constants.Movements, movementId, Constants.SubMovements, submovementId, Constants.SubSubMovements);
                            const querySnapshotSSM = await getDocs(subsubmovementsIntRef);
    
                            if(querySnapshotSSM.size > 0){
                                const unsubscribe = onSnapshot(subsubmovementsIntRef, async (querySnapshotSSM) => {
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
                                unsubscribeMovements.push(unsubscribe);
                            }
                        }
                    });
                    const index = movements.findIndex((movement) => movement.id === movementId);
                    if (index !== -1) {
                        movements[index].subMovements = submovements;
                    }
                    
                }
            });
        });
        await Promise.all(unsubscribeMovements);
        setLoading(false);
        return () => {
            unsubscribeMovements.forEach((unsubscribe: () => any) => unsubscribe());
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
      <Text style={{fontSize:24, fontWeight:'bold', marginBottom: 30, marginTop: 10}}>Sotto Sequenze per la sequenza {submovement?.label}</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : subsubmovements && FIREBASE_AUTH.currentUser ? (
        <View style={{ flex: 1, gap: 15 }}>
          {subsubmovements.map((subsubmovement, index) => (
            <CareerItem key={index} prop={{
              type: 'subsubmovements',
              item: subsubmovement,
              hrefPath: undefined,
              subItems: undefined
            }}></CareerItem>
          ))}
        </View>
      ) : (
        <Text>Nessuna sotto sequenza trovat.</Text>
      )}
    </ScrollView>
  );
}

export default Pages;