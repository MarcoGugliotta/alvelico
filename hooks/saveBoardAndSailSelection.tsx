import { FIREBASE_AUTH, FIREBASE_DB } from "@/firebaseConfig";
import { Board, Level, Movement, Sail, SubMovement, SubSubMovement, User } from "@/models/Models";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import updateItemInStorage from "./updateItemInStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default async function saveBoardAndSailSelection(movement: Movement): Promise<void> {
    try {
        if (FIREBASE_AUTH.currentUser && movement) {
            const itemRef = doc(FIREBASE_DB, movement.ref!);
            const itemData = (await getDoc(itemRef)).data() as Movement;
            const newMovement = { ...itemData, board: movement.board, sail: movement.sail };
            await updateDoc(itemRef, newMovement);

            updateItemInStorage(newMovement);

            const segments = itemRef.path.split('/');
            let refPath = segments[0] + '/' + segments[1];
            const userRef = doc(FIREBASE_DB, refPath);
            const user = (await getDoc(userRef)).data() as User;

            const boardsData = await AsyncStorage.getItem('boardsData');
            const sailsData = await AsyncStorage.getItem('sailsData');
            const boards = JSON.parse(boardsData!) as Board[];
            const sails = JSON.parse(sailsData!) as Sail[];

            boards.forEach(b => {
                if(movement.board === b.literage.toString()){
                    user.points += b.points;
                }
                if(itemData.board !== '' && itemData.board === b.literage.toString()){
                    user.points -= b.points;
                }
            });
            
            sails.forEach(s => {
                if(movement.sail === s.label.toString()){
                    user.points += s.points;
                }
                if(itemData.sail !== '' && itemData.sail === s.label.toString()){
                    user.points -= s.points;
                }
            })

            await updateDoc(userRef, user as any);  
        }
    } catch (error) {
        console.error('Errore durante l\'aggiornamento il salvataggio della tavola e della vela:', error);
    }
}

