import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FIREBASE_DB, FIREBASE_AUTH } from '@/firebaseConfig';
import { getDocs, collection, onSnapshot, setDoc, doc, Timestamp } from 'firebase/firestore';
import { ScrollView } from 'react-native-gesture-handler';
import { Level, Movement } from '@/models/Models';
import { Link } from 'expo-router';
import { countCompletedItems, countInProgressItems, formatTimestampToString } from '@/hooks/utils';
import { Constants } from '@/constants/Strings';

export default function TabCarrieraScreen() {
  const [levels, setLevels] = useState<Level[] | null>(null);
  const [movements, setMovements] = useState<Movement[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserCareerData = async () => {
      try {
        setLoading(true);
        if (FIREBASE_AUTH.currentUser) {
          const userId = FIREBASE_AUTH.currentUser.uid;
          const q = collection(FIREBASE_DB, Constants.Users, userId, Constants.Career);
          const unsubscribe = onSnapshot(q, async (querySnapshot) => {
            console.log('Entra 1')
            const levelsDoc: Level[] = [];
            const unsubscribeMovements: (() => void)[] = []; // Correzione del nome dell'array
            querySnapshot.forEach((doc) => {
              const levelData = doc.data() as Level;
              const levelId = doc.id;
              levelData.id = levelId;
              levelsDoc.push(levelData);
  
              const movementsIntRef = collection(FIREBASE_DB, Constants.Users, userId, Constants.Career, levelId, Constants.Movements);
              const unsubscribeM = onSnapshot(movementsIntRef, async (querySnapshotM) => {
                console.log('Entra 2')
                const movements: Movement[] = [];
                querySnapshotM.forEach((doc) => {
                  const movementData = doc.data() as Movement;
                  const movementId = doc.id;
                  movementData.id = movementId;
                  movements.push(movementData);
                });
                const index = levelsDoc.findIndex((level) => level.id === levelId);
                if (index !== -1) {
                  levelsDoc[index].movements = movements;
                }
                setMovements(movements);
              });
              unsubscribeMovements.push(unsubscribeM);
            });
            // Wait for all movements subscriptions to be set up
            await Promise.all(unsubscribeMovements);
            // Sort levelsDoc by progressive
            levelsDoc.sort((a, b) => a.progressive - b.progressive);
            setLevels(levelsDoc);
            setLoading(false);
            return () => {
              unsubscribeMovements.forEach((unsubscribeM: () => any) => unsubscribeM()); // Correzione della chiamata a forEach
            }
          });
          return () => {
            unsubscribe();
          };
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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Carriera</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : levels && FIREBASE_AUTH.currentUser ? (
        <View style={{ flex: 1, gap: 15 }}>
          {levels.map((level, index) => (
            <View key={index}>
              <Link href={`/listing/levels/${level.id}`}>{level.label}{level.movements ? ' >' : ''}</Link>
              {/* Visualizza i dettagli del livello se disponibili */}
              {level.movements && (
                <View style={{ marginLeft: 20 }}>
                  <Text>Dettagli del livello:</Text>
                  <Text>- Data Attivazione: {level.activationDate ? formatTimestampToString(level.activationDate) : '--/--/----'}</Text>
                  <Text>- Data Completamento: {level.completionDate ? formatTimestampToString(level.completionDate) : '--/--/----'}</Text>
                  <Text>- Percentuale Progresso: {level.completionPercentage}</Text>
                  <Text>- Movimenti completati: {countCompletedItems(level.movements)}/{level.movements.length}</Text>
                  <Text>- Movimenti in progress: {countInProgressItems(level.movements)}/{level.movements.length}</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
