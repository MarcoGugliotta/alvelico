import { Constants } from "@/constants/Strings";
import { FIREBASE_DB } from "@/firebaseConfig";
import { Board, Sail } from "@/models/Models";
import { addDoc, collection } from "firebase/firestore";

const addBoards = async (boards: Board[]) => {
    boards.forEach(async (board) => {
        await addDoc(collection(FIREBASE_DB, Constants.Boards), {
            id: board.id,
            literage: board.literage,
            points: board.points,
        });
    });
}

const addSails = async (sails: Sail[]) => {
    sails.forEach(async (sail) => {
        await addDoc(collection(FIREBASE_DB, Constants.Sails), {
            id: sail.id,
            label: sail.label,
            points: sail.points,
        });
    });
}

export { addBoards, addSails, Board, Sail };