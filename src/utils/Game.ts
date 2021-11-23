import Game from '@/models/Game';
/**
 * This file defines a bunch of service functions for joining, leaving, and other actions to do with Games.
 */
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { arrayUnion, doc, Firestore, getDoc, setDoc, updateDoc } from "firebase/firestore";
import EnrolledUser from "@/models/EnrolledUser";

const leave = () => {

}

const startGame = async (db: Firestore, gameId: string) => {
    const gameRef = doc(db, "games", gameId);
    updateDoc(gameRef, { started: true });
}

const joinGameFromId = async (db: Firestore, user: User, gameId: string) => {
    const gameRef = doc(db, "games", gameId);
    const game = await getDoc(gameRef);
    const gameData = game.data()! as Game;
    const userRef = doc(db, "users", user.email!);

    const userObj = {
        name: user.displayName,
        email: user.email,
        sortId: Math.floor(Math.random() * 100000),
        eliminated: false
    } as EnrolledUser;

    if (gameData.users.find((user: EnrolledUser) => user.email === userObj.email) !== undefined) {
        throw "User is already in the game.";
    }

    if (!gameData.won) {
        await updateDoc(gameRef, {
            users: arrayUnion(userObj),
        });

        await updateDoc(userRef, {
            game: game.id,
        });
    } else {
        throw "Game has already finished.";
    }
}

/**
 * Gets the game from and ID.
 * @param db The firestore database reference.
 * @param gameName The ID of the game.
 * @returns The document reference to the game.
 */
const getGameFromId = async (db: Firestore, gameName: string) => {
    const gameRef = doc(db, "games", gameName);
    const gameDoc = await getDoc(gameRef);
    return gameDoc;
}

export {
    getGameFromId,
    joinGameFromId,
    leave,
    startGame
}