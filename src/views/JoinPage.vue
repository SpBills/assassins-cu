<template>
	<div>
		<h1>{{ error }}</h1>
		<button
			class="bg-blue-500 p-3 mt-5 rounded text-white"
			@click="login"
			v-if="!loggedIn"
		>
			LOGIN
		</button>
	</div>
</template>

<script lang="ts">
import { ref } from "@vue/reactivity";
import {
	getAuth,
	GoogleAuthProvider,
	onAuthStateChanged,
	signInWithPopup,
	User,
} from "firebase/auth";
import {
	arrayUnion,
	collection,
	doc,
	DocumentData,
	getDoc,
	getDocs,
	getFirestore,
	setDoc,
	updateDoc,
} from "firebase/firestore";
import { useRoute, useRouter } from "vue-router";
import Game from "@/models/Game";
import EnrolledUser from "@/models/EnrolledUser";
export default {
	setup() {
		const route = useRoute();
		const router = useRouter();

		const auth = getAuth();
		const db = getFirestore();
		const error = ref("");
		const loggedIn = ref(false);
		const user = ref({} as User);
		const games: DocumentData[] = [];
		const login = async () => {
			const provider = new GoogleAuthProvider();
			await signInWithPopup(auth, provider);

			const userRef = doc(db, "users", user.value.email!);
			setDoc(userRef, { logged: true }, { merge: true });
		};

		const getUser = async () => {
			onAuthStateChanged(auth, (u) => {
				if (u) {
					user.value = u!;
					loggedIn.value = true;
					join();
				} else {
					error.value = "Log in to join this game.";
				}
			});
		};

		const join = async () => {
			const id = route.params.id.toString();
			const game = games.find((game) => game.id == id)!;
			const gameData = game.data() as Game;
			const gameRef = doc(db, "games", id);
			const userRef = doc(db, "users", user.value.email!);

			const userObj = {
				name: user.value.displayName,
				email: user.value.email,
				sortId: Math.floor(Math.random() * 100000),
				eliminated: false,
			} as EnrolledUser;

			if (gameData.users.find((user) => user.email === userObj.email) !== undefined) {
				router.replace("/");
				return;
			}

			if (!gameData.won) {
				console.log("hit");
				await updateDoc(gameRef, {
					users: arrayUnion(userObj),
				});

				await updateDoc(userRef, {
					game: game.id,
				});
				router.replace("/");
			} else {
				error.value = "Game has already finished.";
			}
		};

		const onLoad = async () => {
			const querySnapshot = await getDocs(collection(db, "games"));
			querySnapshot.forEach((doc) => {
				games.push(doc);
			});

			await getUser();
		};

		onLoad();

		return {
			user,
			error,
			loggedIn,
			login,
		};
	},
};
</script>