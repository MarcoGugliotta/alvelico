import { collection, query, where, onSnapshot, doc, Unsubscribe, getDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '@/firebaseConfig';
import { Constants } from '@/constants/Strings';
import { Level, Movement, SubMovement, SubSubMovement } from '@/models/Models';

export default function getItemById(itemId: string, userId: string | undefined, label?: string | ''): Promise<Level | Movement[] | SubMovement | SubSubMovement | Unsubscribe> {
    return new Promise((resolve, reject) => {
        try {
            if (label === 'level') {
                const levelRef = collection(FIREBASE_DB, Constants.Users, userId!, Constants.Career, itemId, Constants.Movements);
                onSnapshot(levelRef, (snapshot) => {
                    if (!snapshot.empty) {
                        const movements: Movement[] = snapshot.docs.map(doc => doc.data() as Movement);
                        resolve(movements); // Assuming only one level is fetched
                    } else {
                        console.error('Elemento non trovato');
                        reject('Elemento non trovato');
                    }
                });
            }

            if (label === 'movement') {
                const movementsRef = collection(FIREBASE_DB, Constants.Movements);
                const movementsQuery = query(movementsRef, where('id', '==', itemId));
                onSnapshot(movementsQuery, (snapshot) => {
                    if (!snapshot.empty) {
                        resolve(snapshot.docs[0].data() as Movement);
                    } else {
                        console.error('Elemento non trovato');
                        reject('Elemento non trovato');
                    }
                });
            }

            if (label === 'submovement') {
                const subMovementsRef = collection(FIREBASE_DB, Constants.SubMovements);
                const subMovementsQuery = query(subMovementsRef, where('id', '==', itemId));
                onSnapshot(subMovementsQuery, (snapshot) => {
                    if (!snapshot.empty) {
                        resolve(snapshot.docs[0].data() as SubMovement);
                    } else {
                        console.error('Elemento non trovato');
                        reject('Elemento non trovato');
                    }
                });
            }

            if (label === 'subsubmovement') {
                const subSubMovementsRef = collection(FIREBASE_DB, Constants.SubSubMovements);
                const subSubMovementsQuery = query(subSubMovementsRef, where('id', '==', itemId));
                onSnapshot(subSubMovementsQuery, (snapshot) => {
                    if (!snapshot.empty) {
                        resolve(snapshot.docs[0].data() as SubMovement);
                    } else {
                        console.error('Elemento non trovato');
                        reject('Elemento non trovato');
                    }
                });
            }
        } catch (error) {
            console.error('Errore durante il recupero dell\'elemento:', error);
            reject(error);
        }
    });
}
