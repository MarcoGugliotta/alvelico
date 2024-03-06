import { FIREBASE_AUTH } from '@/firebaseConfig'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Career, Movement } from '@/models/Models';
import { Board } from './generalGeneration';

const auth = FIREBASE_AUTH;

export default async function fetchBoardsFromStorage(): Promise<Board[] | undefined>{
  try {
    const boardsData = await AsyncStorage.getItem('boardsData');
    if (boardsData) {
      const boards = JSON.parse(boardsData!) as Board[];
      return boards;
    } else {
      //const movementsData = await fetchMovementsDataFromFirebase(levelPath);
      //await saveMovementsDataToStorage(movementsData, levelPath);
      return undefined;
    }
  } catch (error) {
    console.error('Errore durante il recupero delle tavole e vele:', error);
    return undefined;
  }
}