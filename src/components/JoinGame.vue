<template>
	<div>
		<h1>Enter your game's ID</h1>
		<input v-model="gameId" type="text" />

		<button @click="join">Join</button>
	</div>
</template>

<script lang="ts">
import { collection, doc, getFirestore, getDocs, DocumentData, updateDoc, arrayUnion } from "firebase/firestore"; 

import { ref } from "@vue/reactivity";
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
export default {
	setup() {
		const gameId = ref("");
        var user = {} as User;
		const games: DocumentData[] = [];

        const db = getFirestore();
		const auth = getAuth();

        const getUser = () => {
			onAuthStateChanged(auth, (u) => {
				user = u!;
			});
		};

        getUser();

		const onLoad = async () => {
			const querySnapshot = await getDocs(collection(db, "games"));
			querySnapshot.forEach((doc) => {
				games.push(doc);
			});
		};

        onLoad();

		const join = async () => {
            const game = games.find(game => game.id == gameId.value)!;
            const gameRef = doc(db, "games", game.id);
            const userRef = doc(db, "users", user.email!);


            await updateDoc(gameRef, {
                users: arrayUnion(user!.email)
            });

            await updateDoc(userRef, {
                game: game.id
            })
        };

		return {
			gameId,
            join
		};
	},
};
</script>