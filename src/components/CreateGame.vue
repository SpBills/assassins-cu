<template>
	<div>
		<div v-if="!gameId">
			<p>Enter the name of your party</p>
			<input class="border-b-2" v-model="gameName" type="text" />

			<button
				class="bg-blue-500 text-white px-5 py-3 rounded ml-5"
				@click="create"
			>
				Create
			</button>
		</div>
		<div v-else>
			<game-data :gameId="gameId" />
			<small>Copy this and send it to everyone participating!</small>

			<button
				@click="back"
				class="bg-blue-500 text-white px-5 py-3 rounded ml-5"
			>
				Go back
			</button>
		</div>
	</div>
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
import GameData from './GameData.vue';
export default {
	components: {
		GameData,
	},
	setup() {
		const router = useRouter();
		const gameName = ref("");
		const db = getFirestore();
		const gamesCollection = collection(db, "games");
		var user = {} as User;
		const auth = getAuth();

		const getUser = () => {
			onAuthStateChanged(auth, (u) => {
				user = u!;
			});
		};

		getUser();

		const gameId = ref("");

		const create = async () => {
			const game = {
				name: gameName.value,
				time: Timestamp.now(),
				users: [user.email],
			};

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
		};
	},
};
</script>