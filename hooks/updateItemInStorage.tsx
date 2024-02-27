import { Level, Movement, SubMovement, SubSubMovement, Career } from "@/models/Models";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default async function updateItemInStorage(dataToSave: Level | Movement | SubMovement | SubSubMovement) {
    try {
        const careerData = await AsyncStorage.getItem('careerData');
        if (careerData) {
            const updatedCareerData = JSON.parse(careerData) as Career;
            if (updatedCareerData) {
                updatedCareerData.levels.forEach((level, indexL) => {
                    if (level.id === dataToSave.id) {
                        console.log('level-updates', level.label)
                        updatedCareerData.levels[indexL] = { ...level, ...dataToSave };
                        console.log('level-status', updatedCareerData.levels[indexL].status)
                        //console.log({ ...level, ...dataToSave })
                        return;
                    }
                    if (level.movements.length > 0) {
                        level.movements.forEach((movement, indexM) => {
                            if (movement.id === dataToSave.id) {
                                console.log('movement-updated', movement.label)
                                updatedCareerData.levels[indexL].movements[indexM] = { ...movement, ...dataToSave };
                                console.log('movement-status', updatedCareerData.levels[indexL].movements[indexM].status)
                                //console.log({ ...movement, ...dataToSave })
                                return;
                            }
                            if (movement.subMovements && movement.subMovements.length > 0) {
                                movement.subMovements.forEach((subMovement, indexSM) => {
                                    if (subMovement.id === dataToSave.id) {
                                        //console.log('eccalla5')
                                        updatedCareerData.levels[indexL].movements[indexM].subMovements![indexSM] = { ...subMovement, ...dataToSave };
                                        return;
                                    }
                                    if (subMovement.subSubMovements && subMovement.subSubMovements.length > 0) {
                                        subMovement.subSubMovements.forEach((subSubMovement, indexSSM) => {
                                            if (subSubMovement.id === dataToSave.id) {
                                                updatedCareerData.levels[indexL].movements[indexM].subMovements![indexSM].subSubMovements![indexSSM] = { ...subSubMovement, ...dataToSave };
                                                return;
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            
                // Salva l'oggetto careerData aggiornato nell'Async Storage
                await AsyncStorage.setItem('careerData', JSON.stringify(updatedCareerData));
            }
        }
    } catch (error) {
        console.error('Errore salvataggio storage', error)
    }
}