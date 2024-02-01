import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FIREBASE_DB, FIREBASE_AUTH } from '@/firebaseConfig';
import { getDocs, query, collection, doc, Timestamp } from 'firebase/firestore';
import { ScrollView } from 'react-native-gesture-handler';
import { Level } from '@/models/Models';
import { Link } from 'expo-router';
import formatTimestampToString from '@/hooks/utils';

export default function TabCarrieraScreen() {
  const [levels, setLevels] = useState<Level[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserCareerData = async () => {
      try {
        setLoading(true);
        const q = collection(FIREBASE_DB, "users", FIREBASE_AUTH.currentUser!.uid, "career");
        const querySnapshot = await getDocs(q);
        const levelsDoc: Level[] = [];
        querySnapshot.forEach((doc) => {
          const levelData = doc.data() as Level;
          levelsDoc.push(levelData);
        });
        // Ordina i livelli in base al progressivo
        levelsDoc.sort((a, b) => a.progressive - b.progressive);
        // Ordina i movimenti all'interno di ciascun livello in base al progressivo
        levelsDoc.forEach((level) => {
          if (level.movements) {
            level.movements.sort((a, b) => a.progressive - b.progressive);
          }
        });
        setLevels(levelsDoc);

        // Salva i dati dell'utente nello storage locale
        await AsyncStorage.setItem('userData', JSON.stringify(levelsDoc));
      } catch (error) {
        console.error('Errore durante il recupero dei dati della carriera dell\'utente:', error);
      } finally {
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
              <Link href={{ pathname: "/listing/movements", params: { level: level.label }}}>
                <Text>{level.label}{level.movements ? ' >' : ''}</Text>
              </Link>
              {/* Visualizza i dettagli del livello se disponibili */}
              {level.movements && (
                <View style={{ marginLeft: 20 }}>
                <Text>Dettagli del livello:</Text>
                <Text>- Data Attivazione: {level.activationDate ? formatTimestampToString(level.activationDate) : 'Non disponibile'}</Text>
                <Text>- Percentuale Progresso: {level.completionPercentage}</Text>
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
