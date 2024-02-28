import { FIREBASE_AUTH, FIREBASE_DB } from '@/firebaseConfig'; 
import { User } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDocs } from 'firebase/firestore';
import { Career, Movement, SubMovement, SubSubMovement } from '@/models/Models';
import { Constants } from '@/constants/Strings';

const auth = FIREBASE_AUTH;

export default async function fetchSubMovementsFromStorage(submovementPath: string): Promise<SubSubMovement[] | undefined>{
  try {
    const storedData = await AsyncStorage.getItem('careerData');
    if (storedData) {
      const career = JSON.parse(storedData) as Career;
      if (career) {
        let subsubmovements: SubSubMovement[] = [];
        const segments = submovementPath.split('/');
        career.levels.forEach(level => {
          if (level.id === segments[3]) {
            level.movements.forEach((movement) => {
              if(movement.id === segments[5]){
                movement.subMovements?.forEach((submovement) => {
                  if(submovement.id === segments[segments.length - 1].replace(/"/g, '')){
                    subsubmovements = submovement.subSubMovements!;
                  }
                })
              }
            })
          }
        });
        return subsubmovements;
      }
    } else {
      console.log('storedData not-found')
      const subsubmovementsData = await fetchSubSubMovementsDataFromFirebase(submovementPath);
      await saveSubSubMovementsDataToStorage(subsubmovementsData, submovementPath);
      return subsubmovementsData;
    }
  } catch (error) {
    console.error('Errore durante il recupero dei livelli della carriera:', error);
    return undefined;
  }
}

// Funzione per recuperare i movimenti del livello da Firebase
async function fetchSubSubMovementsDataFromFirebase(submovementPath: string) {
  const submovementsRef = collection(FIREBASE_DB, submovementPath, Constants.SubMovements);
  const submovementsSnapshot = await getDocs(submovementsRef);

  const submovements: SubMovement[] = [];

  for (const doc of submovementsSnapshot.docs) {
    const submovement = doc.data() as SubMovement;
    submovements.push(submovement);
  }

  return submovements;
}

async function saveSubSubMovementsDataToStorage(subSubMovementsData: SubSubMovement[], submovementPath: string) {
  try {
      // Passo 1: Ottenere l'oggetto careerData dall'AsyncStorage
      const careerDataString = await AsyncStorage.getItem('careerData');
      if (!careerDataString) {
          throw new Error('Nessun dato della carriera trovato nell\'AsyncStorage');
      }
      const careerData: Career = JSON.parse(careerDataString);

      // Passo 2: Aggiornare l'array levels con i nuovi dati dei subsubmovimenti
      const updatedCareerData: Career = {
          ...careerData,
          levels: careerData.levels.map(level => {
              // Cerca il livello che contiene il submovimento
              const updatedMovements = level.movements.map(movement => {
                  // Cerca il movimento che contiene il submovimento
                  const updatedSubMovements = movement.subMovements?.map(subMovement => {
                      if (subMovement.ref === submovementPath) {
                          // Aggiorna l'array dei subsubmovimenti con i nuovi dati
                          return {
                              ...subMovement,
                              subSubMovements: subSubMovementsData
                          };
                      }
                      return subMovement;
                  });
                  // Ritorna il movimento aggiornato
                  return {
                      ...movement,
                      subMovements: updatedSubMovements
                  };
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
      console.log('Subsubmovimenti salvati con successo in AsyncStorage.');
  } catch (error) {
      console.error('Errore durante il salvataggio dei subsubmovimenti in AsyncStorage:', error);
  }
}