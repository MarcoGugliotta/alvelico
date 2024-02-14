import { FIREBASE_AUTH } from "@/firebaseConfig";
import { Level, Movement, SubMovement, SubSubMovement } from "@/models/Models";
import { getDocs, Timestamp, updateDoc } from "firebase/firestore";

export default async function completeItem({ collectionRef, item }: any) {
    try {
        if (FIREBASE_AUTH.currentUser && collectionRef) {
            const querySnapshot = await getDocs(collectionRef);
            querySnapshot.forEach(async (doc) => {
                const data = doc.data() as Level | Movement | SubMovement | SubSubMovement;
                if (item.id === doc.id) {
                    const now = Timestamp.now();
                    data.completionDate = now;

                    data.status = 'completed';
                    await updateDoc(doc.ref, data as any);       
                }
            });
        }
    } catch (error) {
        console.error('Errore durante l\'aggiornamento dello stato dell\'item:', error);
    }
}