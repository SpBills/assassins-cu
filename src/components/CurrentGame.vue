<template>
	<div class="flex flex-col">
		<div>
			<h1 class="text-4xl font-extrabold" v-if="won">You won!</h1>
			<h1 v-else-if="alone">You are alone.</h1>
			<h1 v-else-if="target">Your target is: {{ target }}</h1>
		</div>
		<div>
			<button
				class="p-5 bg-gray-700 rounded font-bold text-white mt-5"
				@click="leave"
				v-if="won || alone"
			>
				Leave
			</button>
			<button
				class="p-5 bg-red-500 rounded font-bold text-white mt-5"
				@click="
					() => {
						elimPrompt = true;
					}
				"
				v-if="!alone"
				v-show="!won"
			>
				Eliminated
			</button>
			
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
import { Ref, ref } from "@vue/reactivity";
import {
	arrayRemove,
	doc,
	getDoc,
	getFirestore,
	updateDoc,
} from "firebase/firestore";
import { toRef } from "vue";
import EnrolledUser from "@/models/EnrolledUser";
import { User } from "firebase/auth";
import Game from "@/models/Game";
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
	emits: ['changeGame'],
	setup(props: any, context: any) {
		const emit = context.emit;
		const target = ref("");
		const db = getFirestore();

		// Some prompting variables.
		const elimPrompt = ref(false);
		const won = ref(false);
		const alone = ref(false);

		const gameName = toRef(props, "game") as Ref<string>;
		const user = toRef(props, "user") as Ref<User>;

		const dead = async () => {
			const gameRef = doc(db, "games", gameName.value);
			const userRef = doc(db, "users", user.value.email!);
			const fullGame = (await getDoc(gameRef)).data()!;

			let enrolledUser = fullGame.users.find(
				(enrolled: EnrolledUser) => enrolled.email == user.value.email
			);

			// Check if there will only be one user left after removing this user.
			await updateDoc(gameRef, {
				users: arrayRemove(enrolledUser),
				won: fullGame.users.length - 1 === 1,
			});
			await updateDoc(userRef, {
				game: "",
			});

			emit("changeGame", "");

			elimPrompt.value = false;
		};

		const leave = async () => {
			const gameRef = doc(db, "games", gameName.value);
			const userRef = doc(db, "users", user.value.email!);
			const fullGame = (await getDoc(gameRef)).data()!;

			let enrolledUser = fullGame.users.find(
				(enrolled: EnrolledUser) => enrolled.email == user.value.email
			);

			await updateDoc(gameRef, {
				users: arrayRemove(enrolledUser),
				won: fullGame.users.length - 1 === 1,
			});


			await updateDoc(userRef, {
				game: "",
			});
			emit("changeGame", "");
		}

		const getTarget = async () => {
			const gameRef = doc(db, "games", gameName.value);
			const fullGame = (await getDoc(gameRef)).data()! as Game;

			const players = fullGame.users as EnrolledUser[];
			won.value = fullGame.won;
			players.sort((a, b) => (a.sortId > b.sortId ? -1 : 1));
			var next: number =
				players.findIndex(
					(player: EnrolledUser) => player.email === user.value.email
				) + 1;
			if (next >= players.length) {
				next = 0;
			}

			const nextPlayer: EnrolledUser = players[next];
			alone.value = nextPlayer.email === user.value.email;
			target.value = nextPlayer.name + " (" + nextPlayer.email + ")";
		};

		getTarget();

		return {
			target,
			dead,
			won,
			alone,
			elimPrompt,
			leave
		};
	},
};
</script>