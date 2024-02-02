import { collection, addDoc, doc, setDoc, Timestamp, CollectionReference, DocumentReference } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from '@/firebaseConfig'; 
import { User } from 'firebase/auth';


enum Constants {
    Beginner = 'beginner',
    Intermediate = 'intermediate',
    Advanced = 'advanced',
    Users = 'users',
    Career = 'career',
    Movements = 'movements',
    SubMovements = 'subMovements',
    SubSubMovements = 'subSubMovements'
}

interface Level {
    label: string;
    activationDate: Date | null;
    completionDate: Date | null;
    movements: Movement[];
    completionPercentage: number;
    progressive: number;
}

interface Movement {
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

        await addLevels(userId);

        await addMovements(userId);

        // Aggiungi un documento alla collezione leaderboard
        await addDoc(collection(FIREBASE_DB, 'leaderboard'), {
            userId: userId,
            username: '',
            points: 0
        });

        console.log('Struttura del database creata con successo!');
    } catch (error) {
        console.error('Errore durante la creazione della struttura del database:', error);
    }
};

const addLevels = async (userId: string) => {
    try{
        const beginnerRef = doc(collection(FIREBASE_DB, Constants.Users, userId, Constants.Career), Constants.Beginner);
        await setDoc(beginnerRef, {
            label: beginnerLevel.label,
            activationDate: beginnerLevel.activationDate,
            completionDate: beginnerLevel.completionDate,
            completionPercentage: beginnerLevel.completionPercentage,
            progressive: beginnerLevel.progressive
        });
    
        const intermediateRef = doc(collection(FIREBASE_DB, Constants.Users, userId, Constants.Career), Constants.Intermediate);
        await setDoc(intermediateRef, {
            label: intermediateLevel.label,
            activationDate: intermediateLevel.activationDate,
            completionDate: intermediateLevel.completionDate,
            completionPercentage: intermediateLevel.completionPercentage,
            progressive: intermediateLevel.progressive
        });
    
        const advancedRef = doc(collection(FIREBASE_DB, Constants.Users, userId, Constants.Career), Constants.Advanced);
        await setDoc(advancedRef, {
            label: advancedLevel.label,
            activationDate: advancedLevel.activationDate,
            completionDate: advancedLevel.completionDate,
            completionPercentage: advancedLevel.completionPercentage,
            progressive: advancedLevel.progressive
        });
        console.log('Raccolta di levels aggiunta con successo.');
    }catch(err){
        console.error('Errore durante l\'aggiunta dei levels:', err);
    }
};

const addMovements = async (userId: string) => {
    const movementsBegRef = collection(FIREBASE_DB, Constants.Users, userId, Constants.Career, Constants.Beginner, Constants.Movements);
    beginnerLevel.movements.forEach(async (movement) => {
        await addMovement(userId, movement, movementsBegRef, Constants.Beginner);
    })


    const movementsIntRef = collection(FIREBASE_DB, Constants.Users, userId, Constants.Career, Constants.Intermediate, Constants.Movements);
    intermediateLevel.movements.forEach(async (movement) => {
        await addMovement(userId, movement, movementsIntRef, Constants.Intermediate);
    })
    
    const movementsAdvRef = collection(FIREBASE_DB, Constants.Users, userId, Constants.Career, Constants.Advanced, Constants.Movements);
    advancedLevel.movements.forEach(async (movement) => {
        await addMovement(userId, movement, movementsAdvRef, Constants.Advanced);
    })
}

const addMovement = async (userId: string, movement: Movement, movementsRef: CollectionReference, level: Constants) => {
    try {
        // Clona l'oggetto movement escludendo la proprietà subMovements
        const { subMovements, ...movementWithoutSubMovements } = movement;
        const movementDocRef = await addDoc(movementsRef, movementWithoutSubMovements);

        if (movement.subMovements && movement.subMovements.length > 0) {
            await addSubMovements(userId, movement.subMovements, movementDocRef, level);
        }

        console.log('Raccolta di movimenti aggiunta con successo.');
    } catch (error) {
        console.error('Errore durante l\'aggiunta della raccolta di movimenti:', error);
    }
};

const addSubMovements = async (userId: string, subMovements: SubMovement[], movementDocRef: DocumentReference, level: Constants) => {
    const subMovementsRef = collection(FIREBASE_DB, Constants.Users, userId, Constants.Career, level, Constants.Movements, movementDocRef.id, Constants.SubMovements);
    subMovements.forEach(async (subMovement) => {
        await addSubMovement(userId, subMovement, movementDocRef, subMovementsRef, level);
    });
};

const addSubMovement = async (userId: string, subMovement: SubMovement, movementDocRef: DocumentReference, subMovementsRef: CollectionReference, level: Constants) => {
    try {
        // Clona l'oggetto subMovement escludendo la proprietà subSubMovements
        const { subSubMovements, ...subMovementWithoutSubSubMovements } = subMovement;
        const subMovementDocRef = await addDoc(subMovementsRef, subMovementWithoutSubSubMovements);
        if (subSubMovements) {
            await addSubSubMovements(userId, subSubMovements, movementDocRef, subMovementsRef, subMovementDocRef, level);
        }

        console.log('Raccolta di sotto movimenti aggiunta con successo.');
    } catch (error) {
        console.error('Errore durante l\'aggiunta della raccolta di sotto movimenti:', error);
    }
};

const addSubSubMovements = async (userId: string, subSubMovements: SubSubMovement[], movementDocRef: DocumentReference, subMovementsRef: CollectionReference, subMovementDocRef: DocumentReference, level: Constants) => {
    const subSubMovementsRef = collection(FIREBASE_DB, Constants.Users, userId, Constants.Career, level, Constants.Movements, movementDocRef.id, Constants.SubMovements, subMovementDocRef.id, Constants.SubSubMovements);
    subSubMovements.forEach(async (subSubMovement) => {
        await addSubSubMovement(subSubMovement, subSubMovementsRef);
    });
};

const addSubSubMovement = async (subSubMovement: SubSubMovement, subSubMovementsRef: CollectionReference) => {
    try {
        await addDoc(subSubMovementsRef, subSubMovement);
        console.log('Raccolta di sotto-sotto movimenti aggiunta con successo.');
    } catch (error) {
        console.error('Errore durante l\'aggiunta della raccolta di sotto-sotto movimenti:', error);
    }
};


const beginnerLevel: Level = {
    label: 'Principiante',
    activationDate: null,
    completionDate: null,
    completionPercentage: 0,
    movements: [
        { label: 'Trasporto della Tavola', difficulty: 3, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 1 },
        { label: 'Partenza', difficulty: 2, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 2 },
        { label: 'Rotazione di Prua', difficulty: 4, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 3 },
        { label: 'Rotazione di Poppa', difficulty: 4, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 4 },
        { label: 'Orzare', difficulty: 3, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 5 },
        { label: 'Puggiare', difficulty: 3, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 6 },
        { label: 'Navigare in Sicurezza', difficulty: 2, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 7 },
        { label: 'Andatura di Bolina', difficulty: 3, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 8 },
        { label: 'Andatura di Traverso', difficulty: 3, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 9 },
        { label: 'Andatura di Lasco', difficulty: 2, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 10 },
        { label: 'Andatura di Poppa', difficulty: 2, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 11 },
        { label: 'Virata Semplice', difficulty: 3, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 12 },
        { label: 'Strambata Semplice', difficulty: 3, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 13 }
    ],
    progressive: 1
};

const intermediateLevel: Level = {
    label: 'Intermedio',
    activationDate: null,
    completionDate: null,
    completionPercentage: 0,
    movements: [
        { label: 'Evitare le Catapulte', difficulty: 5, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 1 },
        { label: 'Evitare lo Spin Out', difficulty: 6, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 2 },
        { label: 'Partenza dalla Spiaggia Trapezio', difficulty: 4, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 3 },
        { label: 'Strambata Pivot', difficulty: 6, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 4 },
        { label: 'Trapezio', difficulty: 5, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 5 },
        { label: 'Virata Veloce', difficulty: 6, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 6 },
        {
            label: 'Planare',
            difficulty: 7,
            status: '',
            activationDate: null,
            completionDate: null,
            completionPercentage: 0,
            progressive: 7,
            subMovements: [
                { label: 'Entrare in Planata', difficulty: 6, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 1 },
                { label: 'Mantenere la Planata', difficulty: 7, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 2 },
                { label: 'Pompare', difficulty: 8, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 3, 
                    subSubMovements: [
                        { label: 'Pompare agganciati al Trapezio', difficulty: 8, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 1 },
                        { label: 'Pompare sulla Pinna', difficulty: 8, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 2 },
                        { label: 'Pompa e Saltella', difficulty: 9, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 3 }
                    ] 
                },
                {
                    label: 'Curvare', difficulty: 7, status: '', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 8,
                    subSubMovements: [
                        { label: 'Carving', difficulty: 7, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 1 },
                        { label: 'Girare con Imbardata', difficulty: 7, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 2 }
                    ]
                },
                { label: 'Piedi negli Strap', difficulty: 5, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 9 }
            ]
        },
        
    ],
    progressive: 2
};

const advancedLevel: Level = {
    label: 'Avanzato',
    activationDate: null,
    completionDate: null,
    completionPercentage: 0,
    movements: [
        { label: 'Partenza dall’Acqua', difficulty: 7, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 1 },
        {
            label: 'Virata Power',
            difficulty: 8,
            status: '',
            activationDate: null,
            completionDate: null,
            completionPercentage: 0,
            progressive: 2,
            subMovements: [
                { label: 'Ingresso', difficulty: 8, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 1 },
                { label: 'Rotazione', difficulty: 8, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 2 },
                { label: 'Uscita', difficulty: 8, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 3 }
            ]
        },
        {
            label: 'Power Jibe',
            difficulty: 9,
            status: '',
            activationDate: null,
            completionDate: null,
            completionPercentage: 0,
            progressive: 3,
            subMovements: [
                { label: 'Ingresso', difficulty: 9, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 1 },
                { label: 'Transizione', difficulty: 9, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 2 },
                { label: 'Uscita', difficulty: 9, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 3 }
            ]
        },
        {
            label: 'Chop Hop',
            difficulty: 9,
            status: '',
            activationDate: null,
            completionDate: null,
            completionPercentage: 0,
            progressive: 4,
            subMovements: [
                { label: 'Take off', difficulty: 9, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 1 },
                { label: 'Tempo di Permanenza', difficulty: 9, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 2 },
                { label: 'Atterraggio', difficulty: 9, status: 'not_active', activationDate: null, completionDate: null, completionPercentage: 0, progressive: 3 }
            ]
        }
    ],
    progressive: 3
};
