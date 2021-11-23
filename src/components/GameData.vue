<template>
	<div class="flex flex-col">
		<h1 class="font-bold text-xl">{{ game.name }}</h1>
		<p>Game Code: {{ gameId }}</p>
		<a class="mt-3 text-blue-400 cursor-pointer" @click="onClick"
			>Click to copy a link</a
		>
		<small class="text-xs" v-if="copied">Copied to clipboard</small>

		<button
			v-if="
				Object.keys(game).length > 0 &&
				game.owner.email === userEmail &&
				!game.started
			"
			@click="start"
			class="mt-5 bg-green-500 text-white px-5 py-3 rounded"
		>
			START THE GAME
		</button>
	</div>
</template>

<script lang="ts">
import { ref, Ref } from "@vue/reactivity";
import { getFirestore } from "firebase/firestore";
import Game from '@/models/Game';
import { startGame } from '@/utils/Game';
import { toRef } from 'vue';

export default {
	props: {
		game: {
			type: Object,
			required: true,
		},
		gameId: {
			type: String,
			required: true,
		},
		userEmail: {
			type: String,
			required: false,
		},
	},
	setup(props) {
		const db = getFirestore();
		const game = toRef(props, "game") as Ref<Game>;
		const copied = ref(false);
		const onClick = () => {
			navigator.clipboard.writeText(
				location.protocol + `//` + location.host + `/join/${props.gameId}`
			);
			copied.value = true;
		};

		const start = () => {
			startGame(db, props.gameId);

			game.value.started = true;
		}

		return { onClick, copied, start };
	},
};
</script>