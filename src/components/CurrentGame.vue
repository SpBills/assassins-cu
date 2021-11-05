<template>
	<div class="flex flex-col">
		<small class="text-sm mb-5"
			>You are currently logged in as {{ user.email }}</small
		>

		<div v-if="!elim">
			<h1 v-if="target && !won">Your target is: {{ target }}</h1>
			<h1 v-else-if="!target && !won">You are alone.</h1>
			<h1 v-else>You won!</h1>
		</div>
		<div>
			<button
				class="p-5 bg-red-500 rounded font-bold text-white mt-5"
				@click="
					() => {
						elimPrompt = true;
					}
				"
				v-if="!elim"
				v-show="!won"
			>
				Eliminated
			</button>
			<h1 v-else>You were eliminated.</h1>
		</div>

		<div v-if="elimPrompt" class="flex flex-col">
			<hr class="my-5" />
			<p>Are you sure?</p>
			<small class="text-sm"
				>Only select this if you were the one eliminated.</small
			>
			<div class="mt-3">
				<button
					@click="dead"
					class="p-5 bg-red-500 rounded font-bold text-white"
				>
					Confirm
				</button>
				<button
					@click="
						() => {
							elimPrompt = false;
						}
					"
					class="ml-2 p-5 bg-gray-200 rounded font-bold text-white"
				>
					Cancel
				</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { ref } from "@vue/reactivity";
import {
	arrayRemove,
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
		const elimPrompt = ref(false);

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
			elimPrompt.value = false;
		};

		const getTarget = async () => {
			console.log(game.value);
			const gameRef = doc(db, "games", game.value);
			const docSnap = await getDoc(gameRef);

			const players = docSnap.data()!.users as string[];
			players.sort((a, b) => a > b ? -1 : 1);
			var next: number =
				players.findIndex(
					(player: string) => player === user.value.email
				) + 1;
			if (next >= players.length) {
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
			elimPrompt,
		};
	},
};
</script>