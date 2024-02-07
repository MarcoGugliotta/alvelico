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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserCareerData = async () => {
      try {
        setLoading(true);
        const q = collection(FIREBASE_DB, Constants.Users, FIREBASE_AUTH.currentUser!.uid, Constants.Career);
        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
          const levelsDoc: Level[] = [];
          querySnapshot.forEach((doc) => {
            
            const levelData = doc.data() as Level;
            levelsDoc.push(levelData);
          });
          // Ordina i livelli in base al progressivo
          levelsDoc.sort((a, b) => a.progressive - b.progressive);
          // Array di Promise per le chiamate asincrone a getDocs
          const promises = levelsDoc.map(async (level) => {
            const levelLabel: string = level.label === "Principiante" ? "beginner" :  level.label === "Intermedio" ? "intermediate" : level.label === "Avanzato" ? "advanced" : '';
            const movementsIntRef = collection(FIREBASE_DB, Constants.Users, FIREBASE_AUTH.currentUser!.uid, Constants.Career, levelLabel, Constants.Movements);
            const querySnapshotM = await getDocs(movementsIntRef);
            level.movements = [];
            querySnapshotM.forEach((doc) => {
              const movementsData = doc.data() as Movement;
              level.movements.push(movementsData);
            });
            if (level.movements) {
              level.movements.sort((a, b) => a.progressive - b.progressive);
              level.movements.forEach((movement) => {
                if (movement.subMovements) {
                  movement.subMovements.sort((a, b) => a.progressive - b.progressive);
                  movement.subMovements.forEach((subMovement) => {
                    if (subMovement.subSubMovements) {
                      subMovement.subSubMovements.sort((a, b) => a.progressive - b.progressive);
                    }
                  });
                }
              });
            }
          });
          // Aspetta che tutte le chiamate asincrone siano complete prima di impostare i livelli
          await Promise.all(promises);
          setLevels(levelsDoc);
        });
        return () => unsubscribe();
      } catch (error) {
        console.error('Errore durante il recupero dei dati della carriera dell\'utente:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserCareerData();
  }, [levels]);

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
