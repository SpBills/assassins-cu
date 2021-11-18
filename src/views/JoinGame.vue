<template>
	<main-skeleton class="flex flex-col">
		<h1>Enter your game's code</h1>
		<small v-if="error">Error: {{ error }}</small>
		<div>
			<input class="border-b-2" v-model="gameId" type="text" />

			<button
				class="bg-blue-500 text-white px-5 py-3 rounded ml-5"
				@click="join"
			>
				Join
			</button>
		</div>
	</main-skeleton>
</template>

<script lang="ts">
import {
	collection,
	doc,
	getFirestore,
	getDocs,
	DocumentData,
	updateDoc,
	arrayUnion,
} from "firebase/firestore";
import EnrolledUser from "@/models/EnrolledUser";
import { ref } from "@vue/reactivity";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "vue-router";
import Game from "@/models/Game";
import MainSkeleton from "../components/MainSkeleton.vue";
export default {
	components: {
		MainSkeleton
	},
	setup() {
		const router = useRouter();
		const gameId = ref("");
		const error = ref("");
		var user = {} as User;
		const games: DocumentData[] = [];

		const db = getFirestore();
		const auth = getAuth();

		const getUser = () => {
			onAuthStateChanged(auth, (u) => {
				user = u!;
			});
		};

		const onLoad = async () => {
			getUser();

			const querySnapshot = await getDocs(collection(db, "games"));
			querySnapshot.forEach((doc) => {
				games.push(doc);
			});
		};

		onLoad();

		const join = async () => {
			const game = games.find((game) => game.id == gameId.value)!;
			const gameData = game.data() as Game;
			const gameRef = doc(db, "games", game.id);
			const userRef = doc(db, "users", user.email!);

			const userObj = {
				name: user.displayName,
				email: user.email,
				sortId: Math.floor(Math.random() * 100000),
				eliminated: false
			} as EnrolledUser;

			if (gameData.users.find((user) => user.email === userObj.email) !== undefined) {
				// Do something later.
				// TODO
				router.replace("/");
			}

			if (!gameData.won) {
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

		return {
			gameId,
			join,
			error,
		};
	},
};
</script>