import { FIREBASE_AUTH, FIREBASE_DB } from "@/firebaseConfig";
import { Level, Movement, SubMovement, SubSubMovement } from "@/models/Models";
import { collection, CollectionReference, doc, DocumentData, getDoc, getDocs, Timestamp, updateDoc } from "firebase/firestore";
import { Constants } from "@/constants/Strings";

interface Props {
    collectionRef: CollectionReference<DocumentData, DocumentData>,
    item: Level | Movement | SubMovement | SubSubMovement
}

export default async function completeItem({ collectionRef, item }: Props) {
    try {
        if (FIREBASE_AUTH.currentUser && collectionRef) {
            const querySnapshot = await getDocs(collectionRef);
            let totRelativeCompletionPercentage = 0;
            let relativeCompletionPercentageItem;

            /**
            * Questa stringa mi indica come si chiama la raccolta in cui è contenuto l'item
            * che sto per completare(es. completo un sottomovimento, il parentType sarà "movements")
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

            // Ciclo tutta la raccolta di item su cui sto completando uno di essi
            for (const docSnapshot of querySnapshot.docs) {
                const data = docSnapshot.data() as Level | Movement | SubMovement | SubSubMovement;
                if (item.id === docSnapshot.id) {

                    parentType = docSnapshot.ref.parent.id
                    parentId = data.parentId;
                    
                    const now = Timestamp.now();
                    data.completionDate = now;
                    data.status = Constants.Completed;
                    data.completionPercentage = 100;
                    // Aggiorno l'item che ho checkato per completarlo
                    await updateDoc(docSnapshot.ref, data as any);      

                    // Questo if mi permette di tipizzare "data" e avere il campo relativeCompletionPercentage, dato che in Level non c'è
                    if ('relativeCompletionPercentage' in data){
                        // Mi salvo la percentuale relativa dell'item completato. Mi servirà successivamente per calcolare la percentuale di completamento dell'item padre*
                        relativeCompletionPercentageItem = data.relativeCompletionPercentage

                        //Questo if forse è inutile, ma non rischio e lo lascio
                        if(data.completionDate && data.status === Constants.Completed){
                            totRelativeCompletionPercentage += data.relativeCompletionPercentage;
                        }
                    }
                }
            }

            // Caso in cui ho checkato un movimento, quindi si dovrà aggiornare il livello di riferimento tramite parentId
            if (parentType === Constants.Movements) {
                const parentRef = doc(FIREBASE_DB, Constants.Users, FIREBASE_AUTH.currentUser.uid, Constants.Career, parentId!);
                const levelData = (await getDoc(parentRef)).data() as Level;
                levelData.completionPercentage += totRelativeCompletionPercentage;
                await updateDoc(parentRef, levelData as any);   
            // Caso in cui ho checkato un sottomovimento, quindi si dovrà aggiornare il movimento di 
            // riferimento, sommando la percentuale assoluta del sottomovimento, e infine aggiornare il livello
            }else if (parentType === Constants.SubMovements){
                const levelRef = collection(FIREBASE_DB, Constants.Users, FIREBASE_AUTH.currentUser.uid, Constants.Career);
                const querySnapshotL = await getDocs(levelRef);
                for(const qsl of querySnapshotL.docs){
                    const movementsIntRef = collection(FIREBASE_DB, Constants.Users, FIREBASE_AUTH.currentUser!.uid, Constants.Career, qsl.id, Constants.Movements);
                    const querySnapshotM = await getDocs(movementsIntRef);
                    for(const qsm of querySnapshotM.docs){
                        if(qsm.id === parentId!){
                            const levelDataL = qsl.data() as Level;
                            const movementData = qsm.data() as Movement;
                            // *Semplice proporzione per trasformare la percentuale relativa dell'item figlia in perentuale assoluta, così da poter visualizzare la percentale corretta per item
                            movementData.completionPercentage += Math.round((100 * relativeCompletionPercentageItem!) / movementData.relativeCompletionPercentage);

                            // Controlla se il completamento del movimento è 100 con un margine di tolleranza. A volte ci sono movimenti che hanno tre sottomovimenti e non avrò mai il 100%
                            if (Math.abs(movementData.completionPercentage - 100) <= 1) {   
                                // Caso in cui il sottomovimento prima checkato ha incrementato la percentuale del movimento di riferimento portandolo al 100% -> quindi completato!
                                movementData.completionPercentage = 100;
                                movementData.completionDate = Timestamp.now();
                                movementData.status = Constants.Completed;

                                //Aggiorno Anche il livello di riferimento al movimento appena completato
                                levelDataL.completionPercentage += movementData.relativeCompletionPercentage;
                                await updateDoc(doc(FIREBASE_DB, Constants.Users, FIREBASE_AUTH.currentUser!.uid, Constants.Career, qsl.id!), levelDataL as any); 
                            }
                            //Aggiorno il movimento appena completato
                            await updateDoc(doc(FIREBASE_DB, Constants.Users, FIREBASE_AUTH.currentUser!.uid, Constants.Career, qsl.id!, Constants.Movements, qsm.id), movementData as any);  
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
                                submovementData.completionPercentage += Math.round((100 * relativeCompletionPercentageItem!) / submovementData.relativeCompletionPercentage);
    
                                // Controlla se il completamento del sottomovimento è 100 con un margine di tolleranza. A volte ci sono sottomovimenti che hanno tre sottosottomovimenti e non avrò mai il 100%
                                if (Math.abs(submovementData.completionPercentage - 100) <= 1) {   
                                    submovementData.completionPercentage = 100;
                                    submovementData.completionDate = Timestamp.now();
                                    submovementData.status = Constants.Completed;

                                    movementData.completionPercentage += Math.round((100 * submovementData.relativeCompletionPercentage!) / movementData.relativeCompletionPercentage);

                                    // Controlla se il completamento del movimento è 100 con un margine di tolleranza. A volte ci sono movimenti che hanno tre sottomovimenti e non avrò mai il 100%
                                    if (Math.abs(movementData.completionPercentage - 100) <= 1) {   
                                        // Caso in cui il sottomovimento prima checkato ha incrementato la percentuale del movimento di riferimento portandolo al 100% -> quindi completato!
                                        movementData.completionPercentage = 100;
                                        movementData.completionDate = Timestamp.now();
                                        movementData.status = Constants.Completed;

                                        //Aggiorno anche il livello di riferimento al movimento appena completato
                                        levelDataL.completionPercentage += movementData.relativeCompletionPercentage;
                                        await updateDoc(doc(FIREBASE_DB, Constants.Users, FIREBASE_AUTH.currentUser!.uid, Constants.Career, qsl.id!), levelDataL as any); 
                                    }
                                    //Aggiorno il movimento appena completato
                                    await updateDoc(doc(FIREBASE_DB, Constants.Users, FIREBASE_AUTH.currentUser!.uid, Constants.Career, qsl.id!, Constants.Movements, qsm.id), movementData as any);   
                                }
                                //Aggiorno il sottomovimento appena completato
                                await updateDoc(doc(FIREBASE_DB, Constants.Users, FIREBASE_AUTH.currentUser!.uid, Constants.Career, qsl.id!, Constants.Movements, qsm.id, Constants.SubMovements, qss.id), submovementData as any);   
                                break;
                            }
                        }
                        
                    }
                }
            }
        }
    } catch (error) {
        console.error('Errore durante l\'aggiornamento dello stato dell\'item:', error);
    }
}