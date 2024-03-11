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
            userName: '',
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
        await AsyncStorage.setItem('boardsData', JSON.stringify(boards));
        await AsyncStorage.setItem('sailsData', JSON.stringify(sails));

    } catch (error) {
        console.error('Errore durante la creazione della struttura del database:', error);
    }
}

const addLevels = async (userId: string, level: Level, careerData: Career) => {
    try{
        const levelRef = await addDoc(collection(FIREBASE_DB, Constants.Users, userId, Constants.Career), {
            label: level.label,
            status: level.status,
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
                board: movement.board,
                sail: movement.sail,
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
            id: '', label: 'Nomenclatura tavola e rig', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 4, progressive: 1, board: '', sail: '', points: 40,
            hasSubItems: false,
            numSubItems: 0,
            numSubItemsCompleted: 0,
            numSubItemsInProgress: 0,
            difficulty: 0
        },
        {
            id: '', label: 'Trasporto del materiale', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 6, progressive: 2, board: '', sail: '', points: 60,
            subMovements: [
                {
                    id: '', label: 'Trasportare il rig', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 2, progressive: 1, points: 15,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Trasportare tavola e rig', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 2, progressive: 2, points: 40,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Appoggiare il materiale per terra', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 2, progressive: 3, points: 5,
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
            id: '', label: 'Partenza', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 16, progressive: 3, board: '', sail: '', points: 160,
            subMovements: [
                {
                    id: '', label: 'Salire sulla tavola', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 4, progressive: 1, points: 10,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Posizione a T', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 4, progressive: 2, points: 30,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Posizione base', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 4, progressive: 3, points: 50,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Posizione d’andatura', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 4, progressive: 4, points: 70,
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
            id: '', label: 'Rotazione della tavola', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 12, progressive: 4, board: '', sail: '', points: 120,
            subMovements: [
                {
                    id: '', label: 'Rotazione di prua', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 6, progressive: 1, points: 40,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Rotazione di poppa', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 6, progressive: 2, points: 80,
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
            id: '', label: 'Controllo della velocità', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 9, progressive: 5, board: '', sail: '', points: 90,
            subMovements: [
                {
                    id: '', label: 'Accelerare', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 3, progressive: 1, points: 20,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Decelerare', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 3, progressive: 2, points: 20,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Frenare', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 3, progressive: 3, points: 50,
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
            id: '', label: 'Curvare', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 10, progressive: 6, board: '', sail: '', points: 100,
            subMovements: [
                {
                    id: '', label: 'Orzare', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 5, progressive: 1, points: 40,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Puggiare', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 5, progressive: 2, points: 60,
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
            id: '', label: 'Rientrare in situazioni di emergenza', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 4, progressive: 7, board: '', sail: '', points: 40,
            hasSubItems: false,
            numSubItems: 0,
            numSubItemsCompleted: 0,
            numSubItemsInProgress: 0,
            difficulty: 0
        },
        {
            id: '', label: 'Regole di precedenza', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 3, progressive: 8, board: '', sail: '', points: 30,
            hasSubItems: false,
            numSubItems: 0,
            numSubItemsCompleted: 0,
            numSubItemsInProgress: 0,
            difficulty: 0
        },
        {
            id: '', label: 'Teoria del vento', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 6, progressive: 9, board: '', sail: '', points: 60,
            subMovements: [
                {
                    id: '', label: 'Direzione vento', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 2, progressive: 1, points: 5,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Orientarsi correttamente', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 2, progressive: 2, points: 15,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Vento apparente', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 2, progressive: 3, points: 40,
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
            id: '', label: 'Andature', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 20, progressive: 10, board: '', sail: '', points: 200,
            subMovements: [
                {
                    id: '', label: 'Traverso', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 5, progressive: 1, points: 20,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Bolina', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 5, progressive: 2, points: 100,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Lasco', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 5, progressive: 3, points: 20,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Poppa', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 5, progressive: 4, points: 60,
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
            id: '', label: 'Abitudini fondamentali', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 6, progressive: 11, board: '', sail: '', points: 60,
            subMovements: [
                {
                    id: '', label: 'Muovere braccia indipendentemente', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 2, progressive: 1, points: 20,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Salvataggio appeso', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 2, progressive: 2, points: 20,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Salvataggio del tennista', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 2, progressive: 3, points: 20,
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
            id: '', label: 'Armare la vela', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 4, progressive: 12, board: '', sail: '', points: 40,
            hasSubItems: false,
            numSubItems: 0,
            numSubItemsCompleted: 0,
            numSubItemsInProgress: 0,
            difficulty: 0
        }
    ],
    progressive: 1,
    points: 1000,
    status: Constants.NotActive,
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
            id: '', label: 'Partenza dalla Spiaggia', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 10, progressive: 1, board: '', sail: '', points: 200,
            hasSubItems: false,
            numSubItems: 0,
            numSubItemsCompleted: 0,
            numSubItemsInProgress: 0,
            difficulty: 0
        },
        {
            id: '', label: 'Centro velico e centro di deriva', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 1, progressive: 2, board: '', sail: '', points: 20,
            hasSubItems: false,
            numSubItems: 0,
            numSubItemsCompleted: 0,
            numSubItemsInProgress: 0,
            difficulty: 0
        },
        {
            id: '', label: 'Strambata Pivot', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 16, progressive: 3, board: '', sail: '', points: 320,
            subMovements: [
                {
                    id: '', label: 'Curva sottovento', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 1, progressive: 1, points: 20,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Gira i piedi', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 3, progressive: 2, points: 60,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Gira la vela', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 4, progressive: 3, points: 80,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Curva sopravento', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 8, progressive: 4, points: 160,
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
            id: '', label: 'Virata Veloce', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 12, progressive: 4, board: '', sail: '', points: 240,
            subMovements: [
                {
                    id: '', label: 'Ingresso: curvare sopravento', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 2, progressive: 1, points: 40,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Passaggio', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 4, progressive: 2, points: 80,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Uscita: curvare sottovento', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 6, progressive: 3, points: 120,
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
            id: '', label: 'Trapezio', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 15, progressive: 5, board: '', sail: '', points: 300,
            hasSubItems: false,
            numSubItems: 0,
            numSubItemsCompleted: 0,
            numSubItemsInProgress: 0,
            difficulty: 0
        },
        {
            id: '', label: 'Planare', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 40, progressive: 6, board: '', sail: '', points: 800,
            subMovements: [
                {
                    id: '', label: 'Entrare in planata', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 8, progressive: 1, points: 160,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Mantenere la planata', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 8, progressive: 2, points: 160,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Pompare', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 8, progressive: 3, points: 160,
                    subSubMovements: [
                        {
                            id: '', label: 'Pompare agganciati al trapezio', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 4, progressive: 1, points: 80,
                            hasSubItems: false,
                            numSubItems: 0,
                            numSubItemsCompleted: 0,
                            numSubItemsInProgress: 0,
                            difficulty: 0
                        },
                        {
                            id: '', label: 'Pompa e saltella', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 4, progressive: 2, points: 80,
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
                    id: '', label: 'Curvare', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 8, progressive: 4, points: 160,
                    subSubMovements: [
                        {
                            id: '', label: 'Carving', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 4, progressive: 1, points: 80,
                            hasSubItems: false,
                            numSubItems: 0,
                            numSubItemsCompleted: 0,
                            numSubItemsInProgress: 0,
                            difficulty: 0
                        },
                        {
                            id: '', label: 'Girare con imbardata', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 4, progressive: 2, points: 80,
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
                    id: '', label: 'Piedi negli strap', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 8, progressive: 5, points: 160,
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
            id: '', label: 'Evitare le Catapulte', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 3, progressive: 7, board: '', sail: '', points: 60,
            hasSubItems: false,
            numSubItems: 0,
            numSubItemsCompleted: 0,
            numSubItemsInProgress: 0,
            difficulty: 0
        },
        {
            id: '', label: 'Evitare lo Spin Out', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 3, progressive: 8, board: '', sail: '', points: 60,
            hasSubItems: false,
            numSubItems: 0,
            numSubItemsCompleted: 0,
            numSubItemsInProgress: 0,
            difficulty: 0
        }
    ],
    progressive: 2,
    points: 2000,
    status: Constants.NotActive,
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
            id: '', label: 'Partenza dall’acqua', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 10, progressive: 13, board: '', sail: '', points: 300,
            hasSubItems: false,
            numSubItems: 0,
            numSubItemsCompleted: 0,
            numSubItemsInProgress: 0,
            difficulty: 0
        },
        {
            id: '', label: 'Virata Power', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 15, progressive: 14, board: '', sail: '', points: 450,
            subMovements: [
                {
                    id: '', label: 'Entrata', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 3, progressive: 1, points: 90,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Rotazione', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 5, progressive: 2, points: 150,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Uscita', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 7, progressive: 3, points: 210,
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
            id: '', label: 'Power Jibe', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 45, progressive: 15, board: '', sail: '', points: 1350,
            subMovements: [
                {
                    id: '', label: 'Ingresso', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 5, progressive: 1, points: 150,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Transizione', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 15, progressive: 2, points: 450,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Uscita', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 25, progressive: 3, points: 750,
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
            id: '', label: 'Chop hop', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 30, progressive: 16, board: '', sail: '', points: 900,
            subMovements: [
                {
                    id: '', label: 'Take off', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 5, progressive: 1, points: 150,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Tempo di permanenza', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 10, progressive: 2, points: 300,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Atterraggio', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 15, progressive: 3, points: 450,
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
            id: '', label: 'Light Wind Freestyle', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 75, progressive: 17, board: '', sail: '', points: 1200,
            subMovements: [
                {
                    id: '', label: 'Backsailing', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 1, progressive: 1, points: 60,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Bugna in avanti', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 2, progressive: 2, points: 60,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Pinna in avanti', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 4, progressive: 3, points: 120,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Heli tack', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 7, progressive: 4, points: 180,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Upwind 360', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 11, progressive: 5, points: 240,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Downwind 360', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 16, progressive: 6, points: 300,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                },
                {
                    id: '', label: 'Sailbody 360', status: Constants.NotActive, activationDate: null, completionDate: null, completionPercentage: 0, relativeCompletionPercentage: 20, progressive: 7, points: 240,
                    hasSubItems: false,
                    numSubItems: 0,
                    numSubItemsCompleted: 0,
                    numSubItemsInProgress: 0,
                    difficulty: 0
                }
            ],
            hasSubItems: true,
            numSubItems: 7,
            numSubItemsCompleted: 0,
            numSubItemsInProgress: 0,
            difficulty: 0
        }
    ],
    progressive: 3,
    points: 3000,
    status: Constants.NotActive,
    hasSubItems: true,
    numSubItems: 5,
    numSubItemsCompleted: 0,
    numSubItemsInProgress: 0,
    relativeCompletionPercentage: 0
};


const boards:  Board[] = [
    { id: 1, literage: 225, points: 10 },
    { id: 2, literage: 185, points: 30 },
    { id: 3, literage: 160, points: 50 },
    { id: 4, literage: 155, points: 70 },
    { id: 5, literage: 150, points: 90 },
    { id: 6, literage: 145, points: 110 },
    { id: 7, literage: 135, points: 130 },
    { id: 8, literage: 120, points: 150 },
    { id: 9, literage: 115, points: 170 },
    { id: 10, literage: 110, points: 190 },
    { id: 11, literage: 107, points: 210 },
    { id: 12, literage: 100, points: 230 },
];

const sails:  Sail[] = [
    { id: 1, label: 'Scuola', points: 50 },
    { id: 2, label: 'Pro', points: 150 },
]