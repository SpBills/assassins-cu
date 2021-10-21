<template>
	<div>
		<button @click="login" v-if="!loggedIn()">Login</button>
		<button @click="logout" v-else>Logout</button>
		<br />
		<button @click="createGame" v-if="loggedIn()">Create Game</button>
		<button @click="joinGame" v-if="loggedIn()">Join Game</button>

		<current-game v-if="loggedIn()" :game="game" :user="user" />
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
import { doc, getFirestore, getDoc, setDoc } from "firebase/firestore";

export default {
	components: { CurrentGame },
	setup() {
		const router = useRouter();
		var user = ref({} as User);
		const db = getFirestore();
		const game = ref("");

		const auth = getAuth();

		const login = async () => {
			const provider = new GoogleAuthProvider();
			await signInWithPopup(auth, provider);

			const userRef = doc(db, "users", user.value.email!);
			setDoc(userRef, { game: "" }, { merge: true });
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