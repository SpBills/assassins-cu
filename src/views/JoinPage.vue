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
	doc,
	getFirestore,
	setDoc,
} from "firebase/firestore";
import { joinGameFromId } from '@/utils/Game';
import { useRoute, useRouter } from 'vue-router';
export default {
	setup() {
		const route = useRoute();
		const router = useRouter();

		const auth = getAuth();
		const db = getFirestore();
		const error = ref("");
		const loggedIn = ref(false);
		const user = ref({} as User);
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
			const gameId = route.params.id as string;
			
			try {
				await joinGameFromId(db, user.value, gameId);
			} catch (e: any) {
				error.value = e;
			}

			router.replace("/");
		};

		const onLoad = async () => {
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