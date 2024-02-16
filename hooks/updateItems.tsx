import { Constants } from "@/constants/Strings";
import { FIREBASE_AUTH, FIREBASE_DB } from "@/firebaseConfig";
import { Level, Movement, SubMovement, SubSubMovement } from "@/models/Models";
import { addDoc, collection, getDocs } from "firebase/firestore";



const updateParentItemsAfterCompletion = async ({ collectionRef }: any) => {
    try{
        if(collectionRef){
            console.log('collectionRef')
        }

    } catch(err){
        console.error('Errore updateItems', err)
    }
}

export { updateParentItemsAfterCompletion };