import { FIREBASE_AUTH, FIREBASE_DB } from "@/firebaseConfig";
import { Career, Level, Movement, SubMovement, SubSubMovement, User } from "@/models/Models";
import { doc, DocumentData, DocumentReference, getDoc, Timestamp, updateDoc } from "firebase/firestore";
import { Constants } from "@/constants/Strings";
import { getParentDocumentsByRefPath } from "./utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import updateItemInStorage from "./updateItemInStorage";

interface Props {
    ref: string,
}

export default async function completeItem({ ref }: Props): Promise<void> {
    try {
        if (FIREBASE_AUTH.currentUser && ref) {
            const now = Timestamp.now();
            const itemRef = doc(FIREBASE_DB, ref);
            const itemData = (await getDoc(itemRef)).data() as Level | Movement | SubMovement | SubSubMovement;
            if (itemData) {
                const newData = { ...itemData, id: itemRef.id, completionDate: now, status: Constants.Completed, completionPercentage: 100 };
                await updateDoc(itemRef, newData);

                updateItemInStorage(newData);

                const segments = itemRef.path.split('/');
                let refPath = segments[0] + '/' + segments[1];
                const userRef = doc(FIREBASE_DB, refPath);
                const user = (await getDoc(userRef)).data() as User;
                user.points += newData.points!;
                await updateDoc(userRef, user as any);  
        
                const documentsRef = await getParentDocumentsByRefPath(itemRef.path);
                documentsRef.pop();
                let relativeCompletionPercentage = newData.relativeCompletionPercentage;
        
///users/1HIU38k2rcPzX4VqZu5xLajttk93/career/75wp7S5gtMFtERbCadST/movements/WZMkYVFlXxhlnuVQWrHZ/subMovements/fECElRImcr8YdVkvRYBi/subSubMovements
                for (let i = documentsRef.length - 1; i >= 0; i--) {
                    const itemParentRef = documentsRef[i];
                    const itemParentData = (await getDoc(itemParentRef)).data()  as Level | Movement | SubMovement | SubSubMovement;
                    
                    const parentCompletionPercentage = itemParentData?.relativeCompletionPercentage ? itemParentData?.relativeCompletionPercentage : relativeCompletionPercentage;
                    const parentNewCompletionPercentage = itemParentData?.relativeCompletionPercentage ? Math.round((100 * relativeCompletionPercentage) / parentCompletionPercentage) : parentCompletionPercentage;
        
                    itemParentData!.completionPercentage += parentNewCompletionPercentage;

                    if (Math.abs(itemParentData!.completionPercentage - 100) <= 1) {
                        const addedItem = itemParentData.numSubItemsCompleted! + 1;
                        const newDataParent = { ...itemParentData, id: itemParentRef.id, completionDate: now, status: Constants.Completed, completionPercentage: 100, numSubItemsCompleted: addedItem };
                        updateItemInStorage(newDataParent);
                        await updateDoc(itemParentRef, newDataParent);
                        if(documentsRef[i - 1]){
                            const itemParentParentRef = documentsRef[i - 1];
                            const itemParentParentData = (await getDoc(itemParentParentRef)).data()  as Level | Movement | SubMovement | SubSubMovement;
                            const addedParentItem = itemParentParentData.numSubItemsCompleted! + 1;
                            const newDataParentParent = { ...itemParentParentData, id: itemParentParentRef.id, numSubItemsCompleted: addedParentItem };
                            updateItemInStorage(newDataParentParent);
                            await updateDoc(itemParentParentRef, newDataParentParent);
                        }
                    }else{
                        let newDataParent = {} as Level | Movement | SubMovement | SubSubMovement | any;
                        if(i === documentsRef.length - 1){
                            const addedItem = itemParentData.numSubItemsCompleted! + 1;
                            newDataParent = { ...itemParentData, id: itemParentRef.id, completionPercentage: itemParentData!.completionPercentage, numSubItemsCompleted: addedItem};
                        }else{
                            newDataParent = { ...itemParentData, id: itemParentRef.id, completionPercentage: itemParentData!.completionPercentage};
                        }
                        updateItemInStorage(newDataParent);
                        await updateDoc(itemParentRef, newDataParent);
                    }
                }
            }
        }
    } catch (error) {
        console.error('Errore durante l\'aggiornamento dello stato dell\'item:', error);
    }
}

