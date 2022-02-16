<template>
	<main-skeleton>
		<div v-if="!gameId" class="flex flex-col md:block">
			<p>Enter the name of your party</p>
			<input class="border-b-2 mt-3" placeholder="Game Name" v-model="gameName" type="text" />

			<button
				class="bg-blue-500 text-white px-5 py-3 rounded mt-5 md:ml-10"
				@click="create"
			>
				Create
			</button>
		</div>
		<div v-else>
			<game-data :gameId="gameId" :game="currentGame" />
			<small>Copy this and send it to everyone participating!</small>

			<button
				@click="back"
				class="bg-blue-500 text-white px-5 py-3 rounded md:ml-5"
			>
				Go back
			</button>
		</div>
	</main-skeleton>
</template>

<script lang="ts">
import {
	addDoc,
	collection,
	doc,
	getFirestore,
	Timestamp,
	updateDoc,
} from "firebase/firestore";

import { ref } from "@vue/reactivity";
import { useRouter } from "vue-router";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import GameData from "../components/GameData.vue";
import Game from "@/models/Game";
import EnrolledUser from "@/models/EnrolledUser";
import MainSkeleton from "../components/MainSkeleton.vue";
export default {
	components: {
		GameData,
		MainSkeleton,
	},
	setup() {
		const router = useRouter();
		const gameName = ref("");
		const currentGame = ref({} as Game);
		const db = getFirestore();
		const gamesCollection = collection(db, "games");
		var user = {} as User;
		const auth = getAuth();

		onAuthStateChanged(auth, (u) => {
			user = u!;
		});

		const gameId = ref("");

		const create = async () => {
			const userObj = {
				email: user.email,
				name: user.displayName,
				sortId: Math.floor(Math.random() * 100000),
				eliminated: false,
			} as EnrolledUser;

			const game = {
				name: gameName.value,
				time: Timestamp.now(),
				users: [userObj],
				owner: userObj,
				started: false,
				won: false
			} as Game;

			currentGame.value = game;

			const createdDoc = await addDoc(gamesCollection, game);

			const userRef = doc(db, "users", user.email!);
			await updateDoc(userRef, {
				game: createdDoc.id,
			});

			gameId.value = createdDoc.id;
		};

		const back = async () => {
			router.back();
		};

		return {
			gameName,
			create,
			gameId,
			back,
			currentGame,
		};
	},
};
</script>