import { Constants } from "@/constants/Strings";
import { FIREBASE_DB } from "@/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";


interface Board {
    id: string;
    literage: number;
    points: number
}

interface Sail {
    id: string;
    label: string;
    points: number
}

const addBoards = async (boards: Board[]) => {
    boards.forEach(async (board) => {
        await addDoc(collection(FIREBASE_DB, Constants.Boards), {
            literage: board.literage,
            points: board.points,
        });
    });
}

const addSails = async (sails: Sail[]) => {
    sails.forEach(async (sail) => {
        await addDoc(collection(FIREBASE_DB, Constants.Sails), {
            label: sail.label,
            points: sail.points,
        });
    });
}

export {addBoards, addSails, Board, Sail};