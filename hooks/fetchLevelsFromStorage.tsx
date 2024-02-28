import { FIREBASE_AUTH, FIREBASE_DB } from '@/firebaseConfig'; 
import { User } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDocs } from 'firebase/firestore';
import { Career, Level } from '@/models/Models';
import { Constants } from '@/constants/Strings';

const auth = FIREBASE_AUTH;

export default async function fetchLevelsFromStorage(user: User): Promise<Career | undefined>{
  try {
    const storedData = await AsyncStorage.getItem('careerData');
    if (storedData) {
      return JSON.parse(storedData) as Career;
    } else {
      const careerData = await fetchCareerDataFromFirebase(user.uid);
      await saveCareerDataToStorage(careerData);
      return careerData;
    }
  } catch (error) {
    console.error('Errore durante il recupero dei livelli della carriera:', error);
    return undefined;
  }
}

// Funzione per recuperare i dati della carriera da Firebase
async function fetchCareerDataFromFirebase(userId: string) {
  const careerRef = collection(FIREBASE_DB, Constants.Users, userId, Constants.Career);
  const careerSnapshot = await getDocs(careerRef);

  const levels: Level[] = [];

  for (const doc of careerSnapshot.docs) {
    const level = doc.data() as Level;
    levels.push(level);
  }

  const careerData: Career = { levels };
  return careerData;
}

// Funzione per salvare i dati della carriera in AsyncStorage
async function saveCareerDataToStorage(careerData: Career) {
  try {
    await AsyncStorage.setItem('careerData', JSON.stringify(careerData));
    console.log('Livelli della carriera salvati con successo in AsyncStorage.');
  } catch (error) {
    console.error('Errore durante il salvataggio dei livelli della carriera in AsyncStorage:', error);
  }
}
