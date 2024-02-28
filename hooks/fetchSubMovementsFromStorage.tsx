import { FIREBASE_AUTH, FIREBASE_DB } from '@/firebaseConfig'; 
import { User } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDocs } from 'firebase/firestore';
import { Career, Movement, SubMovement } from '@/models/Models';
import { Constants } from '@/constants/Strings';

const auth = FIREBASE_AUTH;

export default async function fetchSubMovementsFromStorage(movementPath: string): Promise<SubMovement[] | undefined>{
  try {
    const storedData = await AsyncStorage.getItem('careerData');
    if (storedData) {
      const career = JSON.parse(storedData) as Career;
      if (career) {
        let submovements: SubMovement[] = [];
        const segments = movementPath.split('/');
        career.levels.forEach(level => {
          if (level.id === segments[3]) {
            level.movements.forEach((movement) => {
              if(movement.id === segments[segments.length - 1].replace(/"/g, '')){
                submovements = movement.subMovements!;
              }
            })
          }
        });
        return submovements;
      }
    } else {
      console.log('storedData not-found')
      const movementsData = await fetchSubMovementsDataFromFirebase(movementPath);
      await saveSubMovementsDataToStorage(movementsData, movementPath);
      return movementsData;
    }
  } catch (error) {
    console.error('Errore durante il recupero dei livelli della carriera:', error);
    return undefined;
  }
}

// Funzione per recuperare i movimenti del livello da Firebase
async function fetchSubMovementsDataFromFirebase(movementPath: string) {
  const submovementsRef = collection(FIREBASE_DB, movementPath, Constants.SubMovements);
  const submovementsSnapshot = await getDocs(submovementsRef);

  const submovements: SubMovement[] = [];

  for (const doc of submovementsSnapshot.docs) {
    const submovement = doc.data() as SubMovement;
    submovements.push(submovement);
  }

  return submovements;
}

async function saveSubMovementsDataToStorage(subMovementsData: SubMovement[], movementPath: string) {
  try {
    // Passo 1: Ottenere l'oggetto careerData dall'AsyncStorage
    const careerDataString = await AsyncStorage.getItem('careerData');
    if (!careerDataString) {
      throw new Error('Nessun dato della carriera trovato nell\'AsyncStorage');
    }
    const careerData: Career = JSON.parse(careerDataString);

    // Passo 2: Aggiornare l'array levels con i nuovi dati dei submovimenti
    const updatedCareerData: Career = {
      ...careerData,
      levels: careerData.levels.map(level => {
        // Cerca il livello che contiene il movimento
        const updatedMovements = level.movements.map(movement => {
          if (movement.ref === movementPath) {
            // Aggiorna l'array dei submovimenti con i nuovi dati
            return {
              ...movement,
              subMovements: subMovementsData
            };
          }
          return movement;
        });
        // Ritorna il livello aggiornato
        return {
          ...level,
          movements: updatedMovements
        };
      })
    };

    // Passo 3: Salvare l'oggetto careerData aggiornato nell'AsyncStorage
    await AsyncStorage.setItem('careerData', JSON.stringify(updatedCareerData));
    console.log('Submovimenti salvati con successo in AsyncStorage.');
  } catch (error) {
    console.error('Errore durante il salvataggio dei submovimenti in AsyncStorage:', error);
  }
}