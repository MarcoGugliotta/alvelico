import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import { Level, Movement, SubMovement } from '@/models/Models';
import { countCompletedItems, countInProgressItems, formatTimestampToString } from '@/hooks/utils';
import { FIREBASE_AUTH, FIREBASE_DB } from '@/firebaseConfig';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { Constants } from '@/constants/Strings';

const Pages = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
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
          console.log('Entra 3')
          const levelsDoc: Level[] = [];
          const unsubscribeMovements: (() => void)[] = [];
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach(async (doc) => {
            const levelData = doc.data() as Level;
            const levelId = doc.id;
            levelData.id = levelId;
            if(id === levelId){
              const movementsIntRef = collection(FIREBASE_DB, Constants.Users, userId, Constants.Career, levelId, Constants.Movements);
              const unsubscribe = onSnapshot(movementsIntRef, async (querySnapshotM) => {
                console.log('Entra 4')
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
                      console.log('Entra 5')
                      const submovements: SubMovement[] = [];
                      querySnapshotSM.forEach((doc) => {
                        console.log('Entra 6')
                        const submovementData = doc.data() as SubMovement;
                        const submovementId = doc.id;
                        submovementData.id = submovementId;
                        submovements.push(submovementData);
                      });
                      const index = movements.findIndex((movement) => movement.id === movementId);
                      console.log('movementId', movementId)
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
          // Wait for all movements subscriptions to be set up
          await Promise.all(unsubscribeMovements);
          // Sort levelsDoc by progressive
          levelsDoc.sort((a, b) => a.progressive - b.progressive);
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
      <Text>Movimenti per il livello {id}</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : movements && FIREBASE_AUTH.currentUser ? (
        <View style={{ flex: 1, gap: 15 }}>
          {movements.map((movement, index) => (
            <View key={index}>
              <Link href={`/listing/movements/${movement.id}`}>{movement.label}{movement.subMovements ? ' >' : ''}</Link>
              {/* Visualizza i dettagli del livello se disponibili */}
              {movement.subMovements && (
                <View style={{ marginLeft: 20 }}>
                  <Text>Dettagli del Movimento:</Text>
                  <Text>- Data Attivazione: {movement.activationDate ? formatTimestampToString(movement.activationDate) : '--/--/----'}</Text>
                  <Text>- Data Completamento: {movement.completionDate ? formatTimestampToString(movement.completionDate) : '--/--/----'}</Text>
                  <Text>- Percentuale Progresso: {movement.completionPercentage}</Text>
                  <Text>- Sequenze completate: {countCompletedItems(movement.subMovements)}/{movement.subMovements.length}</Text>
                  <Text>- Sequenze in progress: {countInProgressItems(movement.subMovements)}/{movement.subMovements.length}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      ) : (
        <Text>Nessun livello trovato.</Text>
      )}
    </ScrollView>
  );
}

export default Pages;