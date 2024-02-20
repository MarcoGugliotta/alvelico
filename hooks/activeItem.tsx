import { FIREBASE_AUTH, FIREBASE_DB } from "@/firebaseConfig";
import { Level, Movement, SubMovement, SubSubMovement, User } from "@/models/Models";
import { collection, CollectionReference, doc, DocumentData, DocumentReference, getDoc, getDocs, Timestamp, updateDoc } from "firebase/firestore";
import { Constants } from "@/constants/Strings";

interface Props {
    collectionRef: CollectionReference<DocumentData, DocumentData>,
    item: Level | Movement | SubMovement | SubSubMovement
}

export default async function activeItem({ collectionRef, item }: Props) {
    try {
        if (FIREBASE_AUTH.currentUser && collectionRef) {
            const querySnapshot = await getDocs(collectionRef);
            /**
            * Questa stringa mi indica come si chiama la raccolta in cui è contenuto l'item
            * che sto per attivare(es. attivo un sottomovimento, il parentType sarà "movements")
            * Uso: Serve per capire qual è il tipo di item padre da aggiornare (es. completo un sottomovimento, so che dovrò 
            * aggiornare un item di timo "movimento")
            */
            let parentType = '';


            /**
             * Referenza del padre
             * Uso: 1) Ricavare il document da firebase tramite get secca
             *      2) Filtrare solo l'item padre di riferimento(es. seleziono un sottomovimento, 
             *         ricavo il parentId, lo uso come filtro tra tutti i movements )
             */
            let parentId;

            for (const docSnapshot of querySnapshot.docs) {
                const data = docSnapshot.data() as Level | Movement | SubMovement | SubSubMovement;
                if (item.id === docSnapshot.id) {
                    parentType = docSnapshot.ref.parent.id
                    parentId = data.parentId;
                    
                    const now = Timestamp.now();
                    data.activationDate = now;
                    data.status = Constants.InProgres;
                    // Aggiorno l'item che ho checkato per attivarlo
                    await updateDoc(docSnapshot.ref, data as any);      
                }
            }


            // Caso in cui ho checkato un movimento, quindi si dovrà aggiornare il livello di riferimento tramite parentId
            if (parentType === Constants.Movements) {
                const parentRef = doc(FIREBASE_DB, Constants.Users, FIREBASE_AUTH.currentUser.uid, Constants.Career, parentId!);
                const levelData = (await getDoc(parentRef)).data() as Level;
                levelData.status = Constants.InProgres;
                await updateDoc(parentRef, levelData as any);   
            // Caso in cui ho checkato un sottomovimento, quindi si dovrà aggiornare il movimento di 
            // riferimento
            }else if (parentType === Constants.SubMovements){
                const levelRef = collection(FIREBASE_DB, Constants.Users, FIREBASE_AUTH.currentUser.uid, Constants.Career);
                const querySnapshotL = await getDocs(levelRef);
                for(const qsl of querySnapshotL.docs){
                    const movementsIntRef = collection(FIREBASE_DB, Constants.Users, FIREBASE_AUTH.currentUser!.uid, Constants.Career, qsl.id, Constants.Movements);
                    const querySnapshotM = await getDocs(movementsIntRef);
                    for(const qsm of querySnapshotM.docs){
                        const levelDataL = qsl.data() as Level;
                        const movementData = qsm.data() as Movement;
                        if(qsm.id === parentId!){
                            movementData.status = Constants.InProgres;
                            //Aggiorno il movimento appena attivato
                            await updateDoc(doc(FIREBASE_DB, Constants.Users, FIREBASE_AUTH.currentUser!.uid, Constants.Career, qsl.id!, Constants.Movements, qsm.id), movementData as any);  
                            
                            levelDataL.status = Constants.InProgres;
                            //Aggiorno il livello appena attivato
                            await updateDoc(doc(FIREBASE_DB, Constants.Users, FIREBASE_AUTH.currentUser!.uid, Constants.Career, qsl.id!), levelDataL as any); 
                            break; 
                        }
                    }
                }
            // Di seguito le operazioni di aggiornamento dei sottomovimenti una volta checkato un sottosottomovimento
            // Le operazioni saranno praticamente uguali al caso precedente, chiaramente verranno aggiornati in più anche i sottomovimenti, oltre
            // i movimenti e livello
            }else if (parentType === Constants.SubSubMovements){
                const levelRef = collection(FIREBASE_DB, Constants.Users, FIREBASE_AUTH.currentUser.uid, Constants.Career);
                const querySnapshotL = await getDocs(levelRef);
                for(const qsl of querySnapshotL.docs){
                    const movementsIntRef = collection(FIREBASE_DB, Constants.Users, FIREBASE_AUTH.currentUser!.uid, Constants.Career, qsl.id, Constants.Movements);
                    const querySnapshotM = await getDocs(movementsIntRef);
                    for(const qsm of querySnapshotM.docs){
                        const submovementsIntRef = collection(FIREBASE_DB, Constants.Users, FIREBASE_AUTH.currentUser!.uid, Constants.Career, qsl.id, Constants.Movements, qsm.id, Constants.SubMovements);
                        const querySnapshotSM = await getDocs(submovementsIntRef);
                        for(const qss of querySnapshotSM.docs){
                            if(qss.id === parentId!){
                                
                                const levelDataL = qsl.data() as Level;
                                const movementData = qsm.data() as Movement;
                                const submovementData = qss.data() as SubMovement;
                                
                                //Semplice proporzione per trasformare la percentuale relativa dell'item figlia in perentuale assoluta, così da poter visualizzare la percentale corretta per item
                                submovementData.status = Constants.InProgres;
                                await updateDoc(doc(FIREBASE_DB, Constants.Users, FIREBASE_AUTH.currentUser!.uid, Constants.Career, qsl.id!, Constants.Movements, qsm.id, Constants.SubMovements, qss.id), submovementData as any);   
                                
                                movementData.status = Constants.InProgres;
                                await updateDoc(doc(FIREBASE_DB, Constants.Users, FIREBASE_AUTH.currentUser!.uid, Constants.Career, qsl.id!, Constants.Movements, qsm.id), movementData as any);   
                                
                                levelDataL.status = Constants.InProgres;
                                await updateDoc(doc(FIREBASE_DB, Constants.Users, FIREBASE_AUTH.currentUser!.uid, Constants.Career, qsl.id!), levelDataL as any); 

                                break;
                            }
                        }
                        
                    }
                }
            }
        }
    } catch (error) {
        console.error('Errore durante l\'attivazione dell\'item:', error);
    }
}