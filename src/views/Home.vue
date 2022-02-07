<template>
	<div>
		<div v-if="!loggedIn()">
			<main-skeleton class="w-1/4 flex flex-col justify-center">
				<button class="bg-gray-700 p-3 rounded text-white" @click="login">Login</button>
			</main-skeleton>
		</div>
		<div v-else class="w-100 h-full flex flex-col justify-between">
			<div>
				<div class="flex justify-around" v-if="loggedIn()">
					<button class="bg-gray-700 p-3 rounded text-white" @click="logout">Logout</button>

					<template v-if="!gameId">
						<button class="bg-gray-700 p-3 rounded text-white" @click="createGame">Create Game</button>
						<button class="bg-gray-700 p-3 rounded text-white" @click="joinGame">Join Game</button>
					</template>
					<template v-else>
						<button class="bg-gray-100 cursor-default p-3 rounded text-white">Create Game</button>
						<button class="bg-gray-100 cursor-default p-3 rounded text-white">Join Game</button>
					</template>
				</div>
				<div v-else></div>

				<main-skeleton class="mt-5 h-64 flex flex-col justify-evenly">
					<small class="text-xs mb-5">You are currently logged in as {{ user.email }}</small>

					<LoadingBar class="mx-auto w-1/2" v-if="loading" />
					<current-game
						class="flex-1"
						v-else-if="loggedIn() && gameId"
						:game="gameId"
						:user="user"
						@changeGame="changeGame"
						@changeGameId="changeGameId"
					/>
					<h2 v-else-if="!loggedIn()">Not logged in.</h2>
					<h2 v-else-if="!gameId">No game found.</h2>
				</main-skeleton>

				<main-skeleton v-if="gameId && user" class="mt-5">
					<h1 class="font-bold mb-3 text-xl">Current game</h1>
					<game-data :gameId="gameId" :game="game" :userEmail="user.email" />
				</main-skeleton>
			</div>
		</div>
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
import Footer from "@/components/Footer.vue";
import { doc, getFirestore, getDoc, setDoc } from "firebase/firestore";
import Game from "@/models/Game";
import LoadingBar from "../components/LoadingBar.vue";

export default {
	components: { CurrentGame, GameData, MainSkeleton, Footer, LoadingBar },
	setup() {
		const router = useRouter();
		const db = getFirestore();
		var user = ref({} as User);
		const game = ref({} as Game);
		const gameId = ref("");

		const loading = ref(true);

		const auth = getAuth();

		const login = async () => {
			const provider = new GoogleAuthProvider();
			await signInWithPopup(auth, provider);

			const userRef = doc(db, "users", user.value.email!);
			setDoc(userRef, { logged: true }, { merge: true });
		};

		const logout = async () => {
			window.location.reload();
			await signOut(auth);
		};

		onAuthStateChanged(auth, async (u) => {
			user.value = u!;
			const email = user.value.email!;

			const userRef = doc(db, "users", email);
			const docSnap = await getDoc(userRef);

			gameId.value = docSnap.data()!.game;
			loading.value = false;
		});

		const changeGame = (evt: Game) => {
			game.value = evt;
		};

		const changeGameId = (evt: string) => {
			gameId.value = evt;
		};

		const loggedIn = () => {
			return user.value && Object.keys(user.value).length > 0;
		};

		const createGame = () => {
			router.push({ path: "create" });
		};

		const joinGame = () => {
			router.push({ path: "join" });
		};

		return {
			login,
			logout,
			loading,
			user,
			loggedIn,
			createGame,
			joinGame,
			game,
			gameId,
			changeGame,
			changeGameId,
		};
	},
};
</script>