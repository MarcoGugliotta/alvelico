import { FIREBASE_AUTH, FIREBASE_DB } from "@/firebaseConfig";
import { Level, Movement, SubMovement, SubSubMovement, User } from "@/models/Models";
import { collection, CollectionReference, doc, DocumentData, DocumentReference, getDoc, getDocs, Timestamp, updateDoc } from "firebase/firestore";
import { Constants } from "@/constants/Strings";
import { getParentDocumentsByRefPath } from "./utils";

interface Props {
    itemRef: DocumentReference<DocumentData, DocumentData>,
}

export default async function activeItem({ itemRef }: Props): Promise<void>  {
    try {
        if (FIREBASE_AUTH.currentUser && itemRef) {
            const now = Timestamp.now();
            const itemData = (await getDoc(itemRef)).data() as Level | Movement | SubMovement | SubSubMovement;
            if (itemData) {
                const newData = { ...itemData, activationDate: now, status: Constants.InProgress };
                await updateDoc(itemRef, newData);
        
                const documentsRef = await getParentDocumentsByRefPath(itemRef.path);
                documentsRef.pop();

                for (let i = documentsRef.length - 1; i >= 0; i--) {
                    const itemParentRef = documentsRef[i];
                    const itemParentData = (await getDoc(itemParentRef)).data()  as Level | Movement | SubMovement | SubSubMovement;

                    const newDataParent = { ...itemParentData, activationDate: now, status: Constants.InProgress};
                    await updateDoc(itemParentRef, newDataParent);
                }
            }
        }
    } catch (error) {
        console.error('Errore durante l\'aggiornamento dello stato dell\'item:', error);
    }
}