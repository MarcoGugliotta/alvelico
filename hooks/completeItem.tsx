import { FIREBASE_AUTH, FIREBASE_DB } from "@/firebaseConfig";
import { Level, Movement, SubMovement, SubSubMovement, User } from "@/models/Models";
import { doc, DocumentData, DocumentReference, getDoc, Timestamp, updateDoc } from "firebase/firestore";
import { Constants } from "@/constants/Strings";
import { getParentDocumentsByRefPath } from "./utils";

interface Props {
    itemRef: DocumentReference<DocumentData, DocumentData>,
}

export default async function completeItem({ itemRef }: Props): Promise<void> {
    try {
        if (FIREBASE_AUTH.currentUser && itemRef) {
            const now = Timestamp.now();
            const itemData = (await getDoc(itemRef)).data() as Level | Movement | SubMovement | SubSubMovement;
            if (itemData) {
                const newData = { ...itemData, completionDate: now, status: Constants.Completed, completionPercentage: 100 };
                await updateDoc(itemRef, newData);

                const segments = itemRef.path.split('/');
                let refPath = segments[0] + '/' + segments[1];
                const userRef = doc(FIREBASE_DB, refPath);
                const user = (await getDoc(userRef)).data() as User;
                user.points += newData.points!;
                await updateDoc(userRef, user as any);  
        
                const documentsRef = await getParentDocumentsByRefPath(itemRef.path);
                documentsRef.pop();
                let relativeCompletionPercentage = newData.relativeCompletionPercentage;
        

                for (let i = documentsRef.length - 1; i >= 0; i--) {
                    const itemParentRef = documentsRef[i];
                    const itemParentData = (await getDoc(itemParentRef)).data()  as Level | Movement | SubMovement | SubSubMovement;
                    
                    const parentCompletionPercentage = itemParentData?.relativeCompletionPercentage ? itemParentData?.relativeCompletionPercentage : relativeCompletionPercentage;
                    const parentNewCompletionPercentage = itemParentData?.relativeCompletionPercentage ? Math.round((100 * relativeCompletionPercentage) / parentCompletionPercentage) : parentCompletionPercentage;
        
                    itemParentData!.completionPercentage += parentNewCompletionPercentage;

                    if (Math.abs(itemParentData!.completionPercentage - 100) <= 1) {
                        const newDataParent = { ...itemParentData, completionDate: now, status: Constants.Completed, completionPercentage: 100 };
                        await updateDoc(itemParentRef, newDataParent);
                    }else{
                        const newDataParent = { ...itemParentData, completionPercentage: itemParentData!.completionPercentage};
                        await updateDoc(itemParentRef, newDataParent);
                    }
                }
            }
        }
    } catch (error) {
        console.error('Errore durante l\'aggiornamento dello stato dell\'item:', error);
    }
}
