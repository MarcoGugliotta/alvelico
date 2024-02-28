import { collection, addDoc, doc, setDoc, updateDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from '@/firebaseConfig'; 
import { User } from 'firebase/auth';
import { Constants } from '@/constants/Strings';
import { Board, Sail, addBoards, addSails } from './generalGeneration';
import { Career, Level, Movement, SubMovement, SubSubMovement } from '@/models/Models';
import AsyncStorage from '@react-native-async-storage/async-storage';


const auth = FIREBASE_AUTH;

export default async function generateCareer(user: User, name: string, lastname: string): Promise<void>{
    try{
        const userId = auth.currentUser!.uid;

        await AsyncStorage.clear();
        const careerData: Career = {
            levels: [],
        };

        await setDoc(doc(FIREBASE_DB, Constants.Users, userId), {
            userName: 'Guglio89',
            name: name,
            lastname: lastname,
            email: user.email,
            avatarUrl: user.photoURL,
            points: 0
        });

        await addLevels(userId, beginnerLevel, careerData);
        await addLevels(userId, intermediateLevel, careerData);
        await addLevels(userId, advancedLevel, careerData);
        addBoards(boards);
        addSails(sails);

        console.log('fine generazione carriera');

        await AsyncStorage.setItem('careerData', JSON.stringify(careerData));
    } catch (error) {
        console.error('Errore durante la creazione della struttura del database:', error);
    }
}

const addLevels = async (userId: string, level: Level, careerData: Career) => {
    try{
        const levelRef = await addDoc(collection(FIREBASE_DB, Constants.Users, userId, Constants.Career), {
            label: level.label,
            activationDate: level.activationDate,
            completionDate: level.completionDate,
            completionPercentage: level.completionPercentage,
            progressive: level.progressive,
            points: level.points,
            hasSubItems: level.hasSubItems,
            numSubItems: level.numSubItems,
            numSubItemsCompleted: level.numSubItemsCompleted,
            numSubItemsInProgress: level.numSubItemsInProgress,
        });
        level.id = levelRef.id;
        level.ref = levelRef.path;

        const levelData: Level = {
            ...level,
            movements: [],
        };
                // Aggiungi il livello all'oggetto careerData solo se non è già presente
        const existingLevelIndex = careerData.levels.findIndex(existingLevel => existingLevel.id === level.id);
        if (existingLevelIndex === -1) {
            careerData.levels.push(levelData);
        }

        await updateDoc(doc(FIREBASE_DB, Constants.Users, userId, Constants.Career, levelRef.id), {
            ref: levelRef.path
        });

        await Promise.all(level.movements.map(async (movement) => {
            const movementRef = await addDoc(collection(FIREBASE_DB, Constants.Users, userId, Constants.Career, levelRef.id, Constants.Movements), {
                label: movement.label,
                status: movement.status,
                activationDate: movement.activationDate,
                completionDate: movement.completionDate,
                completionPercentage: movement.completionPercentage,
                relativeCompletionPercentage: movement.relativeCompletionPercentage,
                progressive: movement.progressive,
                board: movement.board || {},
                sail: movement.sail || {},
                points: movement.points,
                parentId: level.id,
                hasSubItems: movement.hasSubItems,
                numSubItems: movement.numSubItems,
                numSubItemsCompleted: movement.numSubItemsCompleted,
                numSubItemsInProgress: movement.numSubItemsInProgress,
            });
            movement.id = movementRef.id;
            movement.ref = movementRef.path;

            const movementData: Movement = {
                ...movement,
                subMovements: [],
            };

            // Aggiungi il movimento al livello solo se non è già presente
            const existingMovementIndex = levelData.movements.findIndex(existingMovement => existingMovement.id === movement.id);
            if (existingMovementIndex === -1) {
                levelData.movements.push(movementData);
            }

            // Aggiorna la referenza del movimento nel database
            await updateDoc(doc(FIREBASE_DB, Constants.Users, userId, Constants.Career, levelRef.id, Constants.Movements, movementRef.id), {
                ref: movementRef.path
            });

            if (movement.subMovements) {
                await Promise.all(movement.subMovements.map(async (subMovement) => {
                    const subMovementRef = await addDoc(collection(FIREBASE_DB, Constants.Users, userId, Constants.Career, levelRef.id, Constants.Movements, movementRef.id, Constants.SubMovements), {
                        label: subMovement.label,
                        status: subMovement.status,
                        activationDate: subMovement.activationDate,
                        completionDate: subMovement.completionDate,
                        completionPercentage: subMovement.completionPercentage,
                        relativeCompletionPercentage: subMovement.relativeCompletionPercentage,
                        progressive: subMovement.progressive,
                        points: subMovement.points,
                        parentId: movement.id,
                        hasSubItems: subMovement.hasSubItems,
                        numSubItems: subMovement.numSubItems,
                        numSubItemsCompleted: subMovement.numSubItemsCompleted,
                        numSubItemsInProgress: subMovement.numSubItemsInProgress,
                    });
                    subMovement.id = subMovementRef.id;
                    subMovement.ref = subMovementRef.path;

                    const subMovementData: SubMovement = {
                        ...subMovement,
                        subSubMovements: [],
                    };

                    // Aggiungi il sottomovimento al movimento solo se non è già presente
                    const existingSubMovementIndex = movementData.subMovements!.findIndex(existingSubMovement => existingSubMovement.id === subMovement.id);
                    if (existingSubMovementIndex === -1) {
                        movementData.subMovements!.push(subMovementData);
                    }

                    // Aggiorna la referenza del sottomovimento nel database
                    await updateDoc(doc(FIREBASE_DB, Constants.Users, userId, Constants.Career, levelRef.id, Constants.Movements, movementRef.id, Constants.SubMovements, subMovementRef.id), {
                        ref: subMovementRef.path
                    });

                    if (subMovement.subSubMovements) {
                        await Promise.all(subMovement.subSubMovements.map(async (subSubMovement) => {
                            const subSubMovementRef = await addDoc(collection(FIREBASE_DB, Constants.Users, userId, Constants.Career, levelRef.id, Constants.Movements, movementRef.id, Constants.SubMovements, subMovementRef.id, Constants.SubSubMovements), {
                                label: subSubMovement.label,
                                status: subSubMovement.status,
                                activationDate: subSubMovement.activationDate,
                                completionDate: subSubMovement.completionDate,
                                completionPercentage: subSubMovement.completionPercentage,
                                relativeCompletionPercentage: subSubMovement.relativeCompletionPercentage,
                                progressive: subSubMovement.progressive,
                                points: subSubMovement.points,
                                parentId: subMovement.id,
                                hasSubItems: subSubMovement.hasSubItems,
                                numSubItems: subSubMovement.numSubItems,
                                numSubItemsCompleted: subSubMovement.numSubItemsCompleted,
                                numSubItemsInProgress: subSubMovement.numSubItemsInProgress,
                            });
                            subSubMovement.id = subSubMovementRef.id;
                            subSubMovement.ref = subSubMovementRef.path;

                            const subSubMovementData: SubSubMovement = {
                                ...subSubMovement,
                            };

                            // Aggiungi il sottosottomovimento al sottomovimento solo se non è già presente
                            const existingSubSubMovementIndex = subMovementData.subSubMovements!.findIndex(existingSubSubMovement => existingSubSubMovement.id === subSubMovement.id);
                            if (existingSubSubMovementIndex === -1) {
                                subMovementData.subSubMovements!.push(subSubMovementData);
                            }

                            // Aggiorna la referenza del sottosottomovimento nel database
                            await updateDoc(doc(FIREBASE_DB, Constants.Users, userId, Constants.Career, levelRef.id, Constants.Movements, movementRef.id, Constants.SubMovements, subMovementRef.id, Constants.SubSubMovements, subSubMovementRef.id), {
                                ref: subSubMovementRef.path
                            });
                        }));
                    }
                }));
            }
        }));

        // Salva l'oggetto careerData aggiornato nell'Async Storage
        await AsyncStorage.setItem('careerData', JSON.stringify(careerData));
    } catch(error) {
        console.error('Errore durante l\'aggiunta dei livelli:', error);
    }
};

const beginnerLevel: Level = {
    id: '',
    label: 'Principiante',
    activationDate: null,
    completionDate: null,
    completionPercentage: 0,
    movements: [
        {
            id: '', label: 'Nomenclatura tavola e rig', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 4, progressive: 1, board: undefined, sail: undefined, points: 40,
            hasSubItems: false,
            numSubItems: 0,
            numSubItemsCompleted: 0,
            numSubItemsInProgress: 0,
            difficulty: 0
        },
        {
            id: '', label: 'Trasporto del materiale', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 6, progressive: 2, board: undefined, sail: undefined, points: 60,
            subMovements: [
                {
                    id: '', label: 'Trasportare il rig', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 2, progressive: 1, points: 15,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Trasportare tavola e rig', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 2, progressive: 2, points: 40,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Appoggiare il materiale per terra', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 2, progressive: 3, points: 5,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                }
            ],
            hasSubItems: true,
            numSubItems: 3,
            numSubItemsCompleted: 0,
            numSubItemsInProgress: 0,
            difficulty: 0
        },
        {
            id: '', label: 'Partenza', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 16, progressive: 3, board: undefined, sail: undefined, points: 160,
            subMovements: [
                {
                    id: '', label: 'Salire sulla tavola', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 4, progressive: 1, points: 10,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Posizione a T', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 4, progressive: 2, points: 30,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Posizione base', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 4, progressive: 3, points: 50,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Posizione d’andatura', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 4, progressive: 4, points: 70,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                }
            ],
            hasSubItems: true,
            numSubItems: 4,
            numSubItemsCompleted: 0,
            numSubItemsInProgress: 0,
            difficulty: 0
        },
        {
            id: '', label: 'Rotazione della tavola', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 12, progressive: 4, board: undefined, sail: undefined, points: 120,
            subMovements: [
                {
                    id: '', label: 'Rotazione di prua', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 6, progressive: 1, points: 40,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Rotazione di poppa', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 6, progressive: 2, points: 80,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                }
            ],
            hasSubItems: true,
            numSubItems: 2,
            numSubItemsCompleted: 0,
            numSubItemsInProgress: 0,
            difficulty: 0
        },
        {
            id: '', label: 'Controllo della velocità', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 9, progressive: 5, board: undefined, sail: undefined, points: 90,
            subMovements: [
                {
                    id: '', label: 'Accelerare', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 3, progressive: 1, points: 20,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Decelerare', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 3, progressive: 2, points: 20,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Frenare', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 3, progressive: 3, points: 50,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                }
            ],
            hasSubItems: true,
            numSubItems: 3,
            numSubItemsCompleted: 0,
            numSubItemsInProgress: 0,
            difficulty: 0
        },
        {
            id: '', label: 'Curvare', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 10, progressive: 6, board: undefined, sail: undefined, points: 100,
            subMovements: [
                {
                    id: '', label: 'Orzare', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 5, progressive: 1, points: 40,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Puggiare', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 5, progressive: 2, points: 60,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                }
            ],
            hasSubItems: true,
            numSubItems: 2,
            numSubItemsCompleted: 0,
            numSubItemsInProgress: 0,
            difficulty: 0
        },
        {
            id: '', label: 'Rientrare in situazioni di emergenza', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 4, progressive: 7, board: undefined, sail: undefined, points: 40,
            hasSubItems: false,
            numSubItems: 0,
            numSubItemsCompleted: 0,
            numSubItemsInProgress: 0,
            difficulty: 0
        },
        {
            id: '', label: 'Regole di precedenza', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 3, progressive: 8, board: undefined, sail: undefined, points: 30,
            hasSubItems: false,
            numSubItems: 0,
            numSubItemsCompleted: 0,
            numSubItemsInProgress: 0,
            difficulty: 0
        },
        {
            id: '', label: 'Teoria del vento', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 6, progressive: 9, board: undefined, sail: undefined, points: 60,
            subMovements: [
                {
                    id: '', label: 'Direzione vento', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 2, progressive: 1, points: 5,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Orientarsi correttamente', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 2, progressive: 2, points: 15,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Vento apparente', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 2, progressive: 3, points: 40,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                }
            ],
            hasSubItems: true,
            numSubItems: 3,
            numSubItemsCompleted: 0,
            numSubItemsInProgress: 0,
            difficulty: 0
        },
        {
            id: '', label: 'Andature', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 20, progressive: 10, board: undefined, sail: undefined, points: 200,
            subMovements: [
                {
                    id: '', label: 'Traverso', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 5, progressive: 1, points: 20,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Bolina', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 5, progressive: 2, points: 100,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Lasco', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 5, progressive: 3, points: 20,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Poppa', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 5, progressive: 4, points: 60,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                }
            ],
            hasSubItems: true,
            numSubItems: 4,
            numSubItemsCompleted: 0,
            numSubItemsInProgress: 0,
            difficulty: 0
        },
        {
            id: '', label: 'Abitudini fondamentali', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 6, progressive: 11, board: undefined, sail: undefined, points: 60,
            subMovements: [
                {
                    id: '', label: 'Muovere braccia indipendentemente', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 2, progressive: 1, points: 20,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Salvataggio appeso', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 2, progressive: 2, points: 20,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Salvataggio del tennista', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 2, progressive: 3, points: 20,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                }
            ],
            hasSubItems: true,
            numSubItems: 3,
            numSubItemsCompleted: 0,
            numSubItemsInProgress: 0,
            difficulty: 0
        },
        {
            id: '', label: 'Armare la vela', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 4, progressive: 12, board: undefined, sail: undefined, points: 40,
            hasSubItems: false,
            numSubItems: 0,
            numSubItemsCompleted: 0,
            numSubItemsInProgress: 0,
            difficulty: 0
        }
    ],
    progressive: 1,
    points: 1000,
    status: 'not_active',
    hasSubItems: true,
    numSubItems: 12,
    numSubItemsCompleted: 0,
    numSubItemsInProgress: 0,
    relativeCompletionPercentage: 0
};

const intermediateLevel: Level = {
    id: '',
    label: 'Intermedio',
    activationDate: null,
    completionDate: null,
    completionPercentage: 0,
    movements: [
        {
            id: '', label: 'Partenza dalla Spiaggia', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 10, progressive: 1, board: undefined, sail: undefined, points: 200,
            hasSubItems: false,
            numSubItems: 0,
            numSubItemsCompleted: 0,
            numSubItemsInProgress: 0,
            difficulty: 0
        },
        {
            id: '', label: 'Centro velico e centro di deriva', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 1, progressive: 2, board: undefined, sail: undefined, points: 20,
            hasSubItems: false,
            numSubItems: 0,
            numSubItemsCompleted: 0,
            numSubItemsInProgress: 0,
            difficulty: 0
        },
        {
            id: '', label: 'Strambata Pivot', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 16, progressive: 3, board: undefined, sail: undefined, points: 320,
            subMovements: [
                {
                    id: '', label: 'Curva sottovento', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 1, progressive: 1, points: 20,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Gira i piedi', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 3, progressive: 2, points: 60,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Gira la vela', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 4, progressive: 3, points: 80,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Curva sopravento', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 8, progressive: 4, points: 160,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                }
            ],
            hasSubItems: true,
            numSubItems: 4,
            numSubItemsCompleted: 0,
            numSubItemsInProgress: 0,
            difficulty: 0
        },
        {
            id: '', label: 'Virata Veloce', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 12, progressive: 4, board: undefined, sail: undefined, points: 240,
            subMovements: [
                {
                    id: '', label: 'Ingresso: curvare sopravento', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 2, progressive: 1, points: 40,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Passaggio', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 4, progressive: 2, points: 80,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Uscita: curvare sottovento', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 6, progressive: 3, points: 120,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                }
            ],
            hasSubItems: true,
            numSubItems: 3,
            numSubItemsCompleted: 0,
            numSubItemsInProgress: 0,
            difficulty: 0
        },
        {
            id: '', label: 'Trapezio', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 15, progressive: 5, board: undefined, sail: undefined, points: 300,
            hasSubItems: false,
            numSubItems: 0,
            numSubItemsCompleted: 0,
            numSubItemsInProgress: 0,
            difficulty: 0
        },
        {
            id: '', label: 'Planare', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 40, progressive: 6, board: undefined, sail: undefined, points: 800,
            subMovements: [
                {
                    id: '', label: 'Entrare in planata', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 8, progressive: 1, points: 160,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Mantenere la planata', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 8, progressive: 2, points: 160,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Pompare', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 8, progressive: 3, points: 160,
                    subSubMovements: [
                        {
                            id: '', label: 'Pompare agganciati al trapezio', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 4, progressive: 1, points: 80,
                            hasSubItems: false,
                            numSubItems: 0,
                            numSubItemsCompleted: 0,
                            numSubItemsInProgress: 0,
                            difficulty: 0
                        },
                        {
                            id: '', label: 'Pompa e saltella', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 4, progressive: 2, points: 80,
                            hasSubItems: false,
                            numSubItems: 0,
                            numSubItemsCompleted: 0,
                            numSubItemsInProgress: 0,
                            difficulty: 0
                        }
                    ],
                    hasSubItems: true,
                    numSubItems: 2,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Curvare', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 8, progressive: 4, points: 160,
                    subSubMovements: [
                        {
                            id: '', label: 'Carving', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 4, progressive: 1, points: 80,
                            hasSubItems: false,
                            numSubItems: 0,
                            numSubItemsCompleted: 0,
                            numSubItemsInProgress: 0,
                            difficulty: 0
                        },
                        {
                            id: '', label: 'Girare con imbardata', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 4, progressive: 2, points: 80,
                            hasSubItems: false,
                            numSubItems: 0,
                            numSubItemsCompleted: 0,
                            numSubItemsInProgress: 0,
                            difficulty: 0
                        }
                    ],
                    hasSubItems: true,
                    numSubItems: 2,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Piedi negli strap', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 8, progressive: 5, points: 160,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                }
            ],
            hasSubItems: true,
            numSubItems: 5,
            numSubItemsCompleted: 0,
            numSubItemsInProgress: 0,
            difficulty: 0
        },
        {
            id: '', label: 'Evitare le Catapulte', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 3, progressive: 7, board: undefined, sail: undefined, points: 60,
            hasSubItems: false,
            numSubItems: 0,
            numSubItemsCompleted: 0,
            numSubItemsInProgress: 0,
            difficulty: 0
        },
        {
            id: '', label: 'Evitare lo Spin Out', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 3, progressive: 8, board: undefined, sail: undefined, points: 60,
            hasSubItems: false,
            numSubItems: 0,
            numSubItemsCompleted: 0,
            numSubItemsInProgress: 0,
            difficulty: 0
        }
    ],
    progressive: 2,
    points: 2000,
    status: 'not_active',
    hasSubItems: true,
    numSubItems: 8,
    numSubItemsCompleted: 0,
    numSubItemsInProgress: 0,
    relativeCompletionPercentage: 0
};

const advancedLevel: Level = {
    id: '',
    label: 'Avanzato',
    activationDate: null,
    completionDate: null,
    completionPercentage: 0,
    movements: [
        {
            id: '', label: 'Partenza dall’acqua', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 10, progressive: 13, board: undefined, sail: undefined, points: 300,
            hasSubItems: false,
            numSubItems: 0,
            numSubItemsCompleted: 0,
            numSubItemsInProgress: 0,
            difficulty: 0
        },
        {
            id: '', label: 'Virata Power', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 15, progressive: 14, board: undefined, sail: undefined, points: 450,
            subMovements: [
                {
                    id: '', label: 'Entrata', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 3, progressive: 1, points: 90,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Rotazione', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 5, progressive: 2, points: 150,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Uscita', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 7, progressive: 3, points: 210,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                }
            ],
            hasSubItems: true,
            numSubItems: 3,
            numSubItemsCompleted: 0,
            numSubItemsInProgress: 0,
            difficulty: 0
        },
        {
            id: '', label: 'Power Jibe', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 45, progressive: 15, board: undefined, sail: undefined, points: 1350,
            subMovements: [
                {
                    id: '', label: 'Ingresso', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 5, progressive: 1, points: 150,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Transizione', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 15, progressive: 2, points: 450,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Uscita', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 25, progressive: 3, points: 750,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                }
            ],
            hasSubItems: true,
            numSubItems: 3,
            numSubItemsCompleted: 0,
            numSubItemsInProgress: 0,
            difficulty: 0
        },
        {
            id: '', label: 'Chop hop', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 30, progressive: 16, board: undefined, sail: undefined, points: 900,
            subMovements: [
                {
                    id: '', label: 'Take off', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 5, progressive: 1, points: 150,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Tempo di permanenza', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 10, progressive: 2, points: 300,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Atterraggio', status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 15, progressive: 3, points: 450,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                }
            ],
            hasSubItems: true,
            numSubItems: 3,
            numSubItemsCompleted: 0,
            numSubItemsInProgress: 0,
            difficulty: 0
        }
    ],
    progressive: 3,
    points: 3000,
    status: 'not_active',
    hasSubItems: true,
    numSubItems: 4,
    numSubItemsCompleted: 0,
    numSubItemsInProgress: 0,
    relativeCompletionPercentage: 0
};

const boards:  Board[] = [
    { id: '', literage: 225, points: 10 },
    { id: '', literage: 185, points: 30 },
    { id: '', literage: 160, points: 50 },
    { id: '', literage: 155, points: 70 },
    { id: '', literage: 150, points: 90 },
    { id: '', literage: 145, points: 110 },
    { id: '', literage: 135, points: 130 },
    { id: '', literage: 120, points: 150 },
    { id: '', literage: 115, points: 170 },
    { id: '', literage: 110, points: 190 },
    { id: '', literage: 107, points: 210 },
    { id: '', literage: 100, points: 230 },
];

const sails:  Sail[] = [
    { id: '', label: 'Scuola', points: 50 },
    { id: '', label: 'Pro', points: 150 },
]