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

export default async function generateCareer(user: User, name: string, lastname: string): Promise<void>{
    try{
        const userId = auth.currentUser!.uid;

        await setDoc(doc(FIREBASE_DB, Constants.Users, userId), {
            userName: 'Guglio89',
            name: name,
            lastname: lastname,
            email: user.email,
            avatarUrl: user.photoURL,
        });
        await addLevels(userId, beginnerLevel);
        await addLevels(userId, intermediateLevel);
        await addLevels(userId, advancedLevel);

    } catch (error) {
        console.error('Errore durante la creazione della struttura del database:', error);
    }
}

const addLevels = async (userId: string, level: Level) => {
    try{
        const levelRef = await addDoc(collection(FIREBASE_DB, Constants.Users, userId, Constants.Career), {
            label: level.label,
            activationDate: level.activationDate,
            completionDate: level.completionDate,
            completionPercentage: level.completionPercentage,
            progressive: level.progressive
        });
        level.id = levelRef.id;

        await Promise.all(level.movements.map(async (movement) => {
            const movementRef = await addDoc(collection(FIREBASE_DB, Constants.Users, userId, Constants.Career, levelRef.id, Constants.Movements), {
                label: movement.label,
                difficulty: movement.difficulty,
                status: movement.status,
                activationDate: movement.activationDate,
                completionDate: movement.completionDate,
                completionPercentage: movement.completionPercentage,
                progressive: movement.progressive
            });
            movement.id = movementRef.id;

            if (movement.subMovements) {
                await Promise.all(movement.subMovements.map(async (subMovement) => {
                    const subMovementRef = await addDoc(collection(FIREBASE_DB, Constants.Users, userId, Constants.Career, levelRef.id, Constants.Movements, movementRef.id, Constants.SubMovements), {
                        label: subMovement.label,
                        difficulty: subMovement.difficulty,
                        status: subMovement.status,
                        activationDate: subMovement.activationDate,
                        completionDate: subMovement.completionDate,
                        completionPercentage: subMovement.completionPercentage,
                        progressive: subMovement.progressive
                    });
                    subMovement.id = subMovementRef.id;

                    if (subMovement.subSubMovements) {
                        await Promise.all(subMovement.subSubMovements.map(async (subSubMovement) => {
                            const subSubMovementRef = await addDoc(collection(FIREBASE_DB, Constants.Users, userId, Constants.Career, levelRef.id, Constants.Movements, movementRef.id, Constants.SubMovements, subMovementRef.id, Constants.SubSubMovements), {
                                label: subSubMovement.label,
                                difficulty: subSubMovement.difficulty,
                                status: subSubMovement.status,
                                activationDate: subSubMovement.activationDate,
                                completionDate: subSubMovement.completionDate,
                                completionPercentage: subSubMovement.completionPercentage,
                                progressive: subSubMovement.progressive
                            });
                            subSubMovement.id = subSubMovementRef.id;
                        }));
                    }
                }));
            }
        }));
        
        // Ripeti lo stesso processo per gli altri livelli intermediate e advanced
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