import { collection, addDoc, doc, setDoc, Timestamp } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from '@/firebaseConfig'; 
import { User } from 'firebase/auth';

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

        await setDoc(doc(FIREBASE_DB, 'users', userId), {
            userName: '',
            name: name,
            lastname: lastname,
            email: user.email,
            avatarUrl: user.photoURL,
        });

        await addLevels(userId);

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
    const beginnerRef = doc(collection(FIREBASE_DB, 'users', userId, 'career'), 'beginner');
    await setDoc(beginnerRef, {
        label: 'Principiante',
        activationDate: null,
        completionDate: null,
        completionPercentage: 0,
        movements: beginnerLevel.movements,
        progressive: beginnerLevel.progressive
    });

    const intermediateRef = doc(collection(FIREBASE_DB, 'users', userId, 'career'), 'intermediate');
    await setDoc(intermediateRef, {
        label: 'Intermedio',
        activationDate: null,
        completionDate: null,
        completionPercentage: 0,
        movements: intermediateLevel.movements,
        progressive: intermediateLevel.progressive
    });

    const advancedRef = doc(collection(FIREBASE_DB, 'users', userId, 'career'), 'advanced');
    await setDoc(advancedRef, {
        label: 'Avanzato',
        activationDate: null,
        completionDate: null,
        completionPercentage: 0,
        movements: advancedLevel.movements,
        progressive: advancedLevel.progressive
    });
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
