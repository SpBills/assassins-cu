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
	getFirestore,
	DocumentData,
} from "firebase/firestore";
import { ref } from "@vue/reactivity";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import MainSkeleton from "../components/MainSkeleton.vue";
import { joinGameFromId } from '@/utils/Game';
import { useRouter } from 'vue-router';
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
		};

		onLoad();

		const join = async () => {
			try {
				await joinGameFromId(db, user, gameId.value);
			} catch (e: any) {
				error.value = e;
			}

			router.push("/");
		};

		return {
			gameId,
			join,
			error,
		};
	},
};
</script>