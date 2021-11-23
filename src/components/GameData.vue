<template>
	<div class="flex flex-col">
		<h1 class="font-bold text-xl">{{game.name}}</h1>
		<p>Game Code: {{ gameId }}</p>
		<a class="mt-3 text-blue-400 cursor-pointer" @click="onClick">Click to copy a link</a>
        <small class="text-xs" v-if="copied">Copied to clipboard</small>
	</div>
</template>

<script>
import { ref } from '@vue/reactivity';

export default {
	props: {
		game: {
			type: Object,
			required: false
		},
		gameId: {
			type: String,
			required: true,
		},
	},
	setup({gameId}) {
        const copied = ref(false);
		const onClick = () => {
			navigator.clipboard.writeText(location.protocol + `//` + location.host + `/join/${gameId}`);
            copied.value = true;
		};

		return { onClick, copied };
	},
};
</script>