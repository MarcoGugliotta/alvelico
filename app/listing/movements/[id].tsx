import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import { Level, Movement, SubMovement } from '@/models/Models';
import { countCompletedItems, countInProgressItems, formatTimestampToString } from '@/hooks/utils';
import { FIREBASE_AUTH, FIREBASE_DB } from '@/firebaseConfig';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { Constants } from '@/constants/Strings';
import { defaultStyles } from '@/constants/Styles';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import CareerItem from '@/components/CareerItem';

const Pages = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [level, setLevel] = useState<Level | null>(null);
  const [movements, setMovements] = useState<Movement[] | null>(null);
  const [submovements, setSubMovements] = useState<SubMovement[] | null>(null);
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
            if(id === levelId){
              setLevel(levelData);
              const movementsIntRef = collection(FIREBASE_DB, Constants.Users, userId, Constants.Career, levelId, Constants.Movements);
              const unsubscribe = onSnapshot(movementsIntRef, async (querySnapshotM) => {
                const movements: Movement[] = [];
                querySnapshotM.forEach(async (doc) => {
                  const movementData = doc.data() as Movement;
                  const movementId = doc.id;
                  movementData.id = movementId;
                  movements.push(movementData);
                  const submovementsIntRef = collection(FIREBASE_DB, Constants.Users, userId, Constants.Career, levelId, Constants.Movements, movementId, Constants.SubMovements);
                  const querySnapshot = await getDocs(submovementsIntRef);
                  if(querySnapshot.size > 0){
                    const unsubscribeSM = onSnapshot(submovementsIntRef, async (querySnapshotSM) => {
                      const submovements: SubMovement[] = [];
                      querySnapshotSM.forEach((doc) => {
                        const submovementData = doc.data() as SubMovement;
                        const submovementId = doc.id;
                        submovementData.id = submovementId;
                        submovements.push(submovementData);
                      });
                      const index = movements.findIndex((movement) => movement.id === movementId);
                      if (index !== -1) {
                        movements[index].subMovements = submovements;
                      }
                      setSubMovements(submovements);
                    });
                    unsubscribeMovements.push(unsubscribeSM);
                  }
                });
                const index = movements.findIndex((level) => level.id === levelId);
                if (index !== -1) {
                  levelsDoc[index].movements = movements;
                }
                movements.sort((a, b) => a.progressive - b.progressive);
                setMovements(movements);
              });
              unsubscribeMovements.push(unsubscribe);
            }
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
      <Text style={{fontSize:24, fontWeight:'bold', marginBottom: 30, marginTop: 10}}>Movimenti per il livello {level?.label}</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : movements && FIREBASE_AUTH.currentUser ? (
        <View style={{ flex: 1, gap: 15 }}>
          {movements.map((movement, index) => (
            <CareerItem key={index} prop={{
              type: 'submovements',
              item: movement,
              hrefPath: 'submovements',
              subItems: movement.subMovements
            }}></CareerItem>
          ))}
        </View>
      ) : (
        <Text>Nessun movimento trovato.</Text>
      )}
    </ScrollView>
  );
}

export default Pages;