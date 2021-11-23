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
    started: boolean,
    won: boolean,
    users: EnrolledUser[],
    eliminated: EnrolledUser[],
    owner: EnrolledUser,
}