<template>
	<div>
		<h1>{{error}}</h1>
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
import { arrayUnion, collection, doc, DocumentData, getDoc, getDocs, getFirestore, setDoc, updateDoc } from "firebase/firestore";
import { useRoute, useRouter } from 'vue-router';
import Game from '@/models/Game';
import EnrolledUser from '@/models/EnrolledUser';
export default {
	setup() {
		const route = useRoute();
		const router = useRouter();

		const auth = getAuth();
		const db = getFirestore();
		const error = ref("");
		const user = ref({} as User);
		const games: DocumentData[] = [];
		const login = async () => {
			const provider = new GoogleAuthProvider();
			await signInWithPopup(auth, provider);

			const userRef = doc(db, "users", user.value.email!);
			setDoc(userRef, { game: "" }, { merge: true });
		};

		const getUser = async () => {
			onAuthStateChanged(auth, (u) => {
				if (u) {
					user.value = u!;

				} else {
					login();
				}
			});
		};

		const join = async () => {
			const id = route.params.id.toString();
			const game = games.find((game) => game.id == id)!;
			const gameData = game.data() as Game;
			const gameRef = doc(db, "games", id);
			const userRef = doc(db, "users", user.value.email!);

			const userObj = {
				name: user.value.displayName,
				email: user.value.email,
				sortId: Math.floor(Math.random() * 100000),
				eliminated: false
			} as EnrolledUser;

			if (!gameData.won) {
				await updateDoc(gameRef, {
					users: arrayUnion(userObj),
				});

				await updateDoc(userRef, {
					game: game.id,
				});
				router.push("/")
			} else {
				error.value = "Game has already finished.";
			}
		};

		const onLoad = async () => {
			const querySnapshot = await getDocs(collection(db, "games"));
			querySnapshot.forEach((doc) => {
				games.push(doc);
			});

			await getUser();
			join();
		};

		onLoad();


		return {
			user,
			error
		}
	},
};
</script>