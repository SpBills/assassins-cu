<template>
	<div class="w-100 h-screen">
		<div class="flex flex-col w-1/3 shadow p-3" v-if="loggedIn()">
			<button
				@click="logout"
				class="bg-gray-500 mb-1 min-w-min w-1/3 px-5 py-2 rounded text-white"
			>
				Logout
			</button>

			<button
				@click="createGame"
				class="bg-green-500 mb-1 text-white p-5 rounded"
			>
				Create Game
			</button>
			<button
				@click="joinGame"
				class="bg-blue-500 mb-1 text-white p-5 rounded"
			>
				Join Game
			</button>
		</div>
		<div v-else>
			<button
				@click="login"
				class="bg-blue-500 px-5 py-2 rounded text-white"
			>
				Login
			</button>
		</div>

		<current-game v-if="loggedIn() && game" :game="game" :user="user" />
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

import { reactive, ref } from "@vue/reactivity";
import { useRouter } from "vue-router";
import CurrentGame from "@/components/CurrentGame.vue";
import { doc, getFirestore, getDoc, setDoc, arrayUnion } from "firebase/firestore";

export default {
	components: { CurrentGame },
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
			setDoc(userRef, { game: arrayUnion("") }, { merge: true });
		};

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
		};
	},
};
</script>