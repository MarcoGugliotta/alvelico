import { FIREBASE_AUTH, FIREBASE_DB } from '@/firebaseConfig'; 
import { User } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDocs } from 'firebase/firestore';
import { Career, Movement } from '@/models/Models';
import { Constants } from '@/constants/Strings';

const auth = FIREBASE_AUTH;

export default async function fetchMovementsFromStorage(user: User, levelPath: string): Promise<Movement[] | undefined>{
  try {
    const storedData = await AsyncStorage.getItem('careerData');
    if (storedData) {
        const career = JSON.parse(storedData) as Career;
        if (career) {
            let movements: Movement[] = [];
            career.levels.forEach(level => {
                if (level.ref === levelPath.replace(/"/g, '')) {
                    movements = level.movements;
                }
            });
            return movements;
        }
    } else {
      console.log('storedData not-found')
      const movementsData = await fetchMovementsDataFromFirebase(levelPath);
      await saveMovementsDataToStorage(movementsData, levelPath);
      return movementsData;
    }
  } catch (error) {
    console.error('Errore durante il recupero dei livelli della carriera:', error);
    return undefined;
  }
}

// Funzione per recuperare i movimenti del livello da Firebase
async function fetchMovementsDataFromFirebase(levelRef: string) {
  const movementsRef = collection(FIREBASE_DB, levelRef, Constants.Movements);
  const movementsSnapshot = await getDocs(movementsRef);

  const movements: Movement[] = [];

  for (const doc of movementsSnapshot.docs) {
    const movement = doc.data() as Movement;
    movements.push(movement);
  }

  return movements;
}

async function saveMovementsDataToStorage(movementsData: Movement[], levelPath: string) {
    try {
      // Passo 1: Ottenere l'oggetto careerData dall'AsyncStorage
      const careerDataString = await AsyncStorage.getItem('careerData');
      if (!careerDataString) {
        throw new Error('Nessun dato della carriera trovato nell\'AsyncStorage');
      }
      const careerData: Career = JSON.parse(careerDataString);
  
      // Passo 2: Aggiornare l'array levels con i nuovi dati dei movimenti
      const updatedCareerData: Career = {
        ...careerData,
        levels: careerData.levels.map(level => {
          if (level.ref === levelPath) {
            return {
              ...level,
              movements: movementsData // Aggiorna l'array dei movimenti con i nuovi dati
            };
          }
          return level;
        })
      };
  
      // Passo 3: Salvare l'oggetto careerData aggiornato nell'AsyncStorage
      await AsyncStorage.setItem('careerData', JSON.stringify(updatedCareerData));
      console.log('Livelli della carriera salvati con successo in AsyncStorage.');
    } catch (error) {
      console.error('Errore durante il salvataggio dei livelli della carriera in AsyncStorage:', error);
    }
  }