import { collection, addDoc, doc, setDoc, Timestamp, CollectionReference, DocumentReference, onSnapshot } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from '@/firebaseConfig'; 
import { User } from 'firebase/auth';
import { Constants } from '@/constants/Strings';

interface Level {
    id: string;
    label: string;
    activationDate: Date | null;
    completionDate: Date | null;
    movements: Movement[];
    completionPercentage: number;
    progressive: number;
}

interface Movement {
    id: string;
    label: string;
    difficulty: number;
    status: string;
    activationDate: Date | null;
    completionDate: Date | null;
    subMovements?: SubMovement[];
    completionPercentage: number;
    progressive: number;
}

interface SubMovement {
    id: string;
    label: string;
    difficulty: number;
    status: string;
    activationDate: Date | null;
    completionDate: Date | null;
    subSubMovements?: SubSubMovement[];
    completionPercentage: number;
    progressive: number;
}

interface SubSubMovement {
    id: string;
    label: string;
    difficulty: number;
    status: string;
    activationDate: Date | null;
    completionDate: Date | null;
    completionPercentage: number;
    progressive: number;
}

const auth = FIREBASE_AUTH;

export default async function createCareerForUser(user: User, name: string, lastname: string): Promise<void>{
    try {
        const userId = auth.currentUser!.uid;

        await setDoc(doc(FIREBASE_DB, Constants.Users, userId), {
            userName: '',
            name: name,
            lastname: lastname,
            email: user.email,
            avatarUrl: user.photoURL,
        });

        const beginnerLevel: Level = {
            id: '', 
            label: 'Principiante',
            activationDate: null,
            completionDate: null,
            completionPercentage: 0,
            movements: [
                { id: '', label: 'Trasporto della Tavola', difficulty: 3, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 1 },
                { id: '', label: 'Partenza', difficulty: 2, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 2 },
                { id: '',  label: 'Rotazione di Prua', difficulty: 4, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 3 },
                { id: '',  label: 'Rotazione di Poppa', difficulty: 4, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 4 },
                { id: '',  label: 'Orzare', difficulty: 3, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 5 },
                { id: '',  label: 'Puggiare', difficulty: 3, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 6 },
                { id: '',  label: 'Navigare in Sicurezza', difficulty: 2, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 7 },
                { id: '',  label: 'Andatura di Bolina', difficulty: 3, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 8 },
                { id: '',  label: 'Andatura di Traverso', difficulty: 3, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 9 },
                { id: '',  label: 'Andatura di Lasco', difficulty: 2, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 10 },
                { id: '',  label: 'Andatura di Poppa', difficulty: 2, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 11 },
                { id: '',  label: 'Virata Semplice', difficulty: 3, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 12 },
                { id: '',  label: 'Strambata Semplice', difficulty: 3, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 13 }
            ],
            progressive: 1
        };

        const intermediateLevel: Level = {
            id: '', 
            label: 'Intermedio',
            activationDate: null,
            completionDate: null,
            completionPercentage: 0,
            movements: [
                { id: '', label: 'Evitare le Catapulte', difficulty: 5, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 1 },
                { id: '', label: 'Evitare lo Spin Out', difficulty: 6, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 2 },
                { id: '', label: 'Partenza dalla Spiaggia Trapezio', difficulty: 4, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 3 },
                { id: '', label: 'Strambata Pivot', difficulty: 6, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 4 },
                { id: '', label: 'Trapezio', difficulty: 5, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 5 },
                { id: '', label: 'Virata Veloce', difficulty: 6, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 6 },
                {
                    id: '', 
                    label: 'Planare',
                    difficulty: 7,
                    status: '',
                    activationDate: null,
                    completionDate: null,
                    completionPercentage: 0,
                    progressive: 7,
                    subMovements: [
                        { id: '', label: 'Entrare in Planata', difficulty: 6, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 1 },
                        { id: '', label: 'Mantenere la Planata', difficulty: 7, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 2 },
                        { id: '', label: 'Pompare', difficulty: 8, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 3, 
                            subSubMovements: [
                                { id: '', label: 'Pompare agganciati al Trapezio', difficulty: 8, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 1 },
                                { id: '', label: 'Pompare sulla Pinna', difficulty: 8, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 2 },
                                { id: '', label: 'Pompa e Saltella', difficulty: 9, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 3 }
                            ] 
                        },
                        {
                            id: '', 
                            label: 'Curvare', difficulty: 7, status: '', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 8,
                            subSubMovements: [
                                { id: '', label: 'Carving', difficulty: 7, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 1 },
                                { id: '', label: 'Girare con Imbardata', difficulty: 7, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 2 }
                            ]
                        },
                        { id: '', label: 'Piedi negli Strap', difficulty: 5, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 9 }
                    ]
                },
                
            ],
            progressive: 2
        };

        const advancedLevel: Level = {
            id: '', 
            label: 'Avanzato',
            activationDate: null,
            completionDate: null,
            completionPercentage: 0,
            movements: [
                { id: '', label: 'Partenza dall’Acqua', difficulty: 7, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 1 },
                {
                    id: '', 
                    label: 'Virata Power',
                    difficulty: 8,
                    status: '',
                    activationDate: null,
                    completionDate: null,
                    completionPercentage: 0,
                    progressive: 2,
                    subMovements: [
                        { id: '', label: 'Ingresso', difficulty: 8, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 1 },
                        { id: '', label: 'Rotazione', difficulty: 8, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 2 },
                        { id: '', label: 'Uscita', difficulty: 8, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 3 }
                    ]
                },
                {
                    id: '', 
                    label: 'Power Jibe',
                    difficulty: 9,
                    status: '',
                    activationDate: null,
                    completionDate: null,
                    completionPercentage: 0,
                    progressive: 3,
                    subMovements: [
                        { id: '', label: 'Ingresso', difficulty: 9, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 1 },
                        { id: '', label: 'Transizione', difficulty: 9, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 2 },
                        { id: '', label: 'Uscita', difficulty: 9, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 3 }
                    ]
                },
                {
                    id: '', 
                    label: 'Chop Hop',
                    difficulty: 9,
                    status: '',
                    activationDate: null,
                    completionDate: null,
                    completionPercentage: 0,
                    progressive: 4,
                    subMovements: [
                        { id: '', label: 'Take off', difficulty: 9, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 1 },
                        { id: '', label: 'Tempo di Permanenza', difficulty: 9, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 2 },
                        { id: '', label: 'Atterraggio', difficulty: 9, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 3 }
                    ]
                }
            ],
            progressive: 3
        };

        await setDoc(doc(FIREBASE_DB, Constants.Users, userId), {
            userName: '',
            name: name,
            lastname: lastname,
            email: user.email,
            avatarUrl: user.photoURL,
        });

        await addLevels(userId, beginnerLevel, intermediateLevel, advancedLevel);

        await addMovements(userId, beginnerLevel, intermediateLevel, advancedLevel);

        // Aggiungi un documento alla collezione leaderboard
        await addDoc(collection(FIREBASE_DB, 'leaderboard'), {
            userId: userId,
            username: '',
            points: 0
        });
    } catch (error) {
        console.error('Errore durante la creazione della struttura del database:', error);
    }
};

const addLevels = async (userId: string, beginnerLevel: Level, intermediateLevel: Level, advancedLevel: Level) => {
    try{
        const beginnerRef = doc(collection(FIREBASE_DB, Constants.Users, userId, Constants.Career), Constants.Beginner);
        await setDoc(beginnerRef, {
            label: beginnerLevel.label,
            activationDate: beginnerLevel.activationDate,
            completionDate: beginnerLevel.completionDate,
            completionPercentage: beginnerLevel.completionPercentage,
            progressive: beginnerLevel.progressive
        });
        beginnerLevel.id = beginnerRef.id;
        await setDoc(beginnerRef, beginnerLevel);
    
        const intermediateRef = doc(collection(FIREBASE_DB, Constants.Users, userId, Constants.Career), Constants.Intermediate);
        await setDoc(intermediateRef, {
            label: intermediateLevel.label,
            activationDate: intermediateLevel.activationDate,
            completionDate: intermediateLevel.completionDate,
            completionPercentage: intermediateLevel.completionPercentage,
            progressive: intermediateLevel.progressive
        });
        intermediateLevel.id = intermediateRef.id;
        await setDoc(intermediateRef, intermediateLevel);
    
        const advancedRef = doc(collection(FIREBASE_DB, Constants.Users, userId, Constants.Career), Constants.Advanced);
        await setDoc(advancedRef, {
            label: advancedLevel.label,
            activationDate: advancedLevel.activationDate,
            completionDate: advancedLevel.completionDate,
            completionPercentage: advancedLevel.completionPercentage,
            progressive: advancedLevel.progressive
        });
        advancedLevel.id = advancedRef.id;
        await setDoc(advancedRef, advancedLevel);
    } catch(error) {
        console.error('Errore durante l\'aggiunta dei livelli:', error);
    }
};

const addMovements = async (
    userId: string,
    beginnerLevel: Level,
    intermediateLevel: Level,
    advancedLevel: Level
) => {
    try {
        const addSubMovementsRecursively = async (
            userId: string,
            subMovements: SubMovement[],
            parentRef: DocumentReference,
            levelId: string
        ) => {
            for (const subMovement of subMovements) {
                const subMovementRef = await addDoc(
                    collection(
                        FIREBASE_DB,
                        Constants.Users,
                        userId,
                        Constants.Career,
                        levelId,
                        Constants.Movements,
                        parentRef.id,
                        Constants.SubMovements
                    ),
                    subMovement
                );
                subMovement.id = subMovementRef.id;
                await setDoc(subMovementRef, subMovement);

                if (subMovement.subSubMovements) {
                    await addSubSubMovements(
                        userId,
                        subMovement.subSubMovements,
                        subMovementRef,
                        levelId
                    );
                }
            }
        };

        const addSubSubMovements = async (
            userId: string,
            subSubMovements: SubSubMovement[],
            parentRef: DocumentReference,
            levelId: string
        ) => {
            for (const subSubMovement of subSubMovements) {
                const subSubMovementRef = await addDoc(
                    collection(
                        FIREBASE_DB,
                        Constants.Users,
                        userId,
                        Constants.Career,
                        levelId,
                        Constants.Movements,
                        parentRef.id,
                        Constants.SubMovements,
                        parentRef.id,
                        Constants.SubSubMovements
                    ),
                    subSubMovement
                );
                subSubMovement.id = subSubMovementRef.id;
                await setDoc(subSubMovementRef, subSubMovement);
            }
        };

        for (const movement of beginnerLevel.movements) {
            const movementRef = await addDoc(
                collection(
                    FIREBASE_DB,
                    Constants.Users,
                    userId,
                    Constants.Career,
                    beginnerLevel.id,
                    Constants.Movements
                ),
                movement
            );
            movement.id = movementRef.id;
            await setDoc(movementRef, movement);

            if (movement.subMovements) {
                await addSubMovementsRecursively(
                    userId,
                    movement.subMovements,
                    movementRef,
                    beginnerLevel.id
                );
            }
        }

        for (const movement of intermediateLevel.movements) {
            const movementRef = await addDoc(
                collection(
                    FIREBASE_DB,
                    Constants.Users,
                    userId,
                    Constants.Career,
                    intermediateLevel.id,
                    Constants.Movements
                ),
                movement
            );
            movement.id = movementRef.id;
            await setDoc(movementRef, movement);

            if (movement.subMovements) {
                await addSubMovementsRecursively(
                    userId,
                    movement.subMovements,
                    movementRef,
                    intermediateLevel.id
                );
            }
        }

        for (const movement of advancedLevel.movements) {
            const movementRef = await addDoc(
                collection(
                    FIREBASE_DB,
                    Constants.Users,
                    userId,
                    Constants.Career,
                    advancedLevel.id,
                    Constants.Movements
                ),
                movement
            );
            movement.id = movementRef.id;
            await setDoc(movementRef, movement);

            if (movement.subMovements) {
                await addSubMovementsRecursively(
                    userId,
                    movement.subMovements,
                    movementRef,
                    advancedLevel.id
                );
            }
        }
    } catch (error) {
        console.error('Errore durante l\'aggiunta dei movimenti:', error);
    }
};


