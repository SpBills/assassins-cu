import EnrolledUser from "./EnrolledUser";
import {
    Timestamp,
} from "firebase/firestore";
/**
 * The interface that defines a game.
 */
export default interface Game {
    name: string,
    time: Timestamp,
    won: boolean,
    users: EnrolledUser[]
}