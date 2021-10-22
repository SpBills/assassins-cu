<template>
	<div>
		<div v-if="!elim">
			<h1 v-if="target && !won">Your target is: {{ target }}</h1>
			<h1 v-else-if="!target && !won">You are alone.</h1>
			<h1 v-else>You won!</h1>
		</div>

		<button
			class="p-5 bg-red-500 rounded font-bold text-white"
			@click="dead"
			v-if="!elim"
		>
			Eliminated
		</button>
		<h1 v-else>You were eliminated.</h1>
	</div>
</template>

<script lang="ts">
import { ref } from "@vue/reactivity";
import {
	arrayRemove,
	deleteDoc,
	doc,
	getDoc,
	getFirestore,
	updateDoc,
} from "firebase/firestore";
import { toRef } from "vue";
export default {
	props: {
		game: {
			type: String,
			required: true,
		},
		user: {
			type: Object,
			required: true,
		},
	},
	setup(props: any) {
		const target = ref("");
		const db = getFirestore();

		const won = ref(false);
		const elim = ref(false);

		const game = toRef(props, "game");
		const user = toRef(props, "user");

		const dead = async () => {
			const gameRef = doc(db, "games", game.value);
			const userRef = doc(db, "users", user.value.email);

			await updateDoc(gameRef, {
				users: arrayRemove(user.value.email),
			});

			await updateDoc(userRef, {
				game: "",
			});

			elim.value = true;
		};

		const getTarget = async () => {
			const gameRef = doc(db, "games", game.value);
			const docSnap = await getDoc(gameRef);

			const players = docSnap.data()!.users;

			won.value = docSnap.data()!.users.length == 0;

			var next: number =
				players.findIndex(
					(player: String) => player === user.value.email
				) + 1;
			if (next > players.length - 1) {
				next = 0;
			}

			const nextPlayer: string = players[next];

			target.value = nextPlayer;
		};

		getTarget();

		return {
			target,
			dead,
			won,
			elim,
		};
	},
};
</script>