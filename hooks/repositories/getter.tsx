import { collection, query, where, onSnapshot, DocumentData, DocumentReference, Unsubscribe, QuerySnapshot, doc } from 'firebase/firestore';
import { FIREBASE_DB } from '@/firebaseConfig';
import { Constants } from '@/constants/Strings';
import { Level, Movement, SubMovement, SubSubMovement } from '@/models/Models';

// Funzione per recuperare un elemento della gerarchia tramite ID
export default function getItemById(itemId: string, userId: string | undefined, label?: string | ''): Promise<Level | Movement | SubMovement | SubSubMovement | Unsubscribe> {
    return new Promise((resolve, reject) => {
        let unsubscribe: Unsubscribe | null = null;

        try {
            // Cicla tra i livelli
            if (label === 'level') {
                const levels = [Constants.Beginner, Constants.Intermediate, Constants.Advanced];
                const unsubscribeList: Unsubscribe[] = []; // Array per memorizzare gli unsubscribe
                for (const level of levels) {
                    const levelRef = doc(FIREBASE_DB, Constants.Users, userId!, Constants.Career, level);
                    const unsubscribe = onSnapshot(levelRef, (snapshot) => {
                        if (snapshot.exists()) {
                            // Il documento esiste, puoi accedere ai dati
                            resolve(snapshot.data() as Level);
                            if (unsubscribe) unsubscribe();
                        } else {
                            // Il documento non esiste
                            reject('Elemento non trovato');
                        }
                    });
                }
                // Chiamare tutti gli unsubscribe alla fine del ciclo
                return Promise.resolve(unsubscribeList);
            }

            // Cerca nei movimenti
            if (label === 'movement') {
                const movementsRef = collection(FIREBASE_DB, Constants.Movements);
                const movementsQuery = query(movementsRef, where('id', '==', itemId));
                unsubscribe = onSnapshot(movementsQuery, (snapshot) => {
                    if (!snapshot.empty) {
                        resolve(snapshot.docs[0].data() as Movement);
                        if (unsubscribe) unsubscribe();
                    } else {
                        reject('Elemento non trovato');
                    }
                });
            }

            // Cerca nei sotto-movimenti
            if (label === 'submovement') {
                const subMovementsRef = collection(FIREBASE_DB, Constants.SubMovements);
                const subMovementsQuery = query(subMovementsRef, where('id', '==', itemId));
                unsubscribe = onSnapshot(subMovementsQuery, (snapshot) => {
                    if (!snapshot.empty) {
                        resolve(snapshot.docs[0].data() as SubMovement);
                        if (unsubscribe) unsubscribe();
                    } else {
                        reject('Elemento non trovato');
                    }
                });
            }

            // Cerca nei sotto-sotto-movimenti
            if (label === 'subsubmovement') {
                const subSubMovementsRef = collection(FIREBASE_DB, Constants.SubSubMovements);
                const subSubMovementsQuery = query(subSubMovementsRef, where('id', '==', itemId));
                unsubscribe = onSnapshot(subSubMovementsQuery, (snapshot) => {
                    if (!snapshot.empty) {
                        resolve(snapshot.docs[0].data() as SubSubMovement);
                        if (unsubscribe) unsubscribe();
                    } else {
                        reject('Elemento non trovato');
                    }
                });
            }
        } catch (error) {
            console.error('Errore durante il recupero dell\'elemento:', error);
            reject(error);
        }
        
        // Se non si è riusciti a trovare l'elemento, restituisci la funzione di disconnessione
        if (unsubscribe) {
            resolve(unsubscribe);
        } else {
            reject('Elemento non trovato');
        }
    });
}
