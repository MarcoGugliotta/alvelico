import { Timestamp } from "firebase/firestore";

export default function formatTimestampToString(timestamp: Timestamp): string{
    return new Date(timestamp.seconds! * 1000).toLocaleDateString("it-IT");
}