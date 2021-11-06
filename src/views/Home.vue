<template>
    <div v-if="!loggedIn()" class="h-screen w-full flex flex-col justify-center items-center">
        <main-skeleton class="w-1/4 flex flex-col justify-center">
            <button class="bg-gray-700 p-3 rounded text-white" @click="login">
                Login
            </button>
        </main-skeleton>
    </div>
    <div v-else class="w-100 h-screen">
        <div class="flex justify-around" v-if="loggedIn()">
            <button class="bg-gray-700 p-3 rounded text-white" @click="logout">
                Logout
            </button>
            <button
                class="bg-gray-700 p-3 rounded text-white"
                @click="createGame"
            >
                Create Game
            </button>
            <button
                class="bg-gray-700 p-3 rounded text-white"
                @click="joinGame"
            >
                Join Game
            </button>
        </div>
        <div v-else></div>

        <main-skeleton class="mt-5">
            <current-game v-if="loggedIn() && game" :game="game" :user="user" @changeGame="changeGame" />
            <h2 v-else-if="!loggedIn()">Not logged in.</h2>
            <h2 v-else-if="!game">No game found.</h2>
        </main-skeleton>

        <main-skeleton v-if="game" class="mt-5">
            <h1 class="font-bold mb-3 text-xl">Current game</h1>
            <game-data :gameId="game" />
        </main-skeleton>
    </div>
</template>

<script lang="ts">
import {
    signInWithPopup,
    getAuth,
    GoogleAuthProvider,
    onAuthStateChanged,
    signOut,
    User,
} from "firebase/auth";

import { ref } from "@vue/reactivity";
import { useRouter } from "vue-router";
import CurrentGame from "@/components/CurrentGame.vue";
import GameData from "@/components/GameData.vue";
import MainSkeleton from "@/components/MainSkeleton.vue";
import { doc, getFirestore, getDoc, setDoc } from "firebase/firestore";

export default {
    components: { CurrentGame, GameData, MainSkeleton },
    setup() {
        const router = useRouter();
        const db = getFirestore();
        var user = ref({} as User);
        const game = ref("");

        const auth = getAuth();

        const login = async () => {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);

            const userRef = doc(db, "users", user.value.email!);
            setDoc(userRef, { game: "" }, { merge: true });
        };

        const changeGame = (evt: any) => {
            console.log("hit");
            console.log(evt);
            game.value = evt;
        }

        const logout = async () => {
            await signOut(auth);
        };

        const getUser = async () => {
            onAuthStateChanged(auth, async (u) => {
                user.value = u!;
                const email = user.value.email!;

                const userRef = doc(db, "users", email);
                const docSnap = await getDoc(userRef);

                game.value = docSnap.data()!.game;
            });
        };

        const loggedIn = () => {
            return user.value;
        };

        const createGame = () => {
            router.push({ path: "create" });
        };

        const joinGame = () => {
            router.push({ path: "join" });
        };

        getUser();

        return {
            login,
            logout,
            user,
            loggedIn,
            createGame,
            joinGame,
            game,
            changeGame
        };
    },
};
</script>