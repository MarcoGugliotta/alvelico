import { FIREBASE_AUTH, FIREBASE_DB } from '@/firebaseConfig'; 
import { User } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDocs } from 'firebase/firestore';
import { Career, Level, Movement, SubMovement, SubSubMovement } from '@/models/Models';
import { Constants } from '@/constants/Strings';

const auth = FIREBASE_AUTH;

async function fetchAndSaveCareerData(user: User): Promise<void>{
    try{
        const careerData = await fetchCareerDataFromFirebase(user.uid);
        await saveCareerDataToStorage(careerData);
    } catch (error) {
        console.error('Errore durante la creazione della struttura del database:', error);
    }
}

// Funzione per recuperare i dati della carriera da Firebase
async function fetchCareerDataFromFirebase(userId: string) {
    const careerRef = collection(FIREBASE_DB, Constants.Users, userId, Constants.Career);
    const careerSnapshot = await getDocs(careerRef);
  
    const levels: Level[] = [];

    for (const doc of careerSnapshot.docs) {
        const level = doc.data() as Level;
        level.movements = [];
    
        const movementRef = collection(FIREBASE_DB, Constants.Users, userId, Constants.Career, doc.id, Constants.Movements);
        const movementSnapshot = await getDocs(movementRef);
    
        if (movementSnapshot.size > 0) {
            for (const docM of movementSnapshot.docs) {
                const movement = docM.data() as Movement;
                movement.subMovements = [];
        
                const subMovementRef = collection(FIREBASE_DB, Constants.Users, userId, Constants.Career, doc.id, Constants.Movements, docM.id, Constants.SubMovements);
                const subMovementSnapshot = await getDocs(subMovementRef);
        
                if (subMovementSnapshot.size > 0) {
                    for (const docS of subMovementSnapshot.docs) {
                        const subMovement = docS.data() as SubMovement;
                        subMovement.subSubMovements = [];
                
                        const subSubMovementRef = collection(FIREBASE_DB, Constants.Users, userId, Constants.Career, doc.id, Constants.Movements, docM.id!, Constants.SubMovements, docS.id!, Constants.SubSubMovements);
                        const subSubMovementSnapshot = await getDocs(subSubMovementRef);
                
                        if (subSubMovementSnapshot.size > 0) {
                            for (const docSS of subSubMovementSnapshot.docs) {
                                const subSubMovement = docSS.data() as SubSubMovement;
                                subMovement.subSubMovements.push(subSubMovement);
                            }
                        }
                        movement.subMovements.push(subMovement);
                    }
                }
                level.movements.push(movement);
            }
        }
        levels.push(level);
    }
  
    const careerData: Career = { levels };
    return careerData;
}

// Funzione per salvare i dati della carriera in AsyncStorage
async function saveCareerDataToStorage(careerData: Career) {
  try {
    await AsyncStorage.setItem('careerData', JSON.stringify(careerData));
    console.log('Dati della carriera salvati con successo in AsyncStorage.');
  } catch (error) {
    console.error('Errore durante il salvataggio dei dati della carriera in AsyncStorage:', error);
  }
}

export{ saveCareerDataToStorage }