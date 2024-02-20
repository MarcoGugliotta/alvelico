import { Level, Movement, SubMovement, SubSubMovement } from "@/models/Models";
import { Timestamp } from "firebase/firestore";

const formatTimestampToString = function (timestamp: Timestamp): string{
    return new Date(timestamp.seconds! * 1000).toLocaleDateString("it-IT");
}

const countCompletedItems = (items: any[]): number => {
    return items.filter((item) => item.completionDate !== null).length;
};

const countInProgressItems = (items: any[]): number => {
    return items.filter((item) => item.activationDate !== null && item.completionDate === null).length;
  };

export { formatTimestampToString, countCompletedItems, countInProgressItems };

