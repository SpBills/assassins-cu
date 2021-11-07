<template>
	<div>
		<div></div>
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
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
export default {
	setup() {
		const auth = getAuth();
		const db = getFirestore();
		const user = ref({} as User);
		const login = async () => {
			const provider = new GoogleAuthProvider();
			await signInWithPopup(auth, provider);

			const userRef = doc(db, "users", user.value.email!);
			setDoc(userRef, { game: "" }, { merge: true });
		};

		const getUser = async () => {
			onAuthStateChanged(auth, async (u) => {
				if (u) {
                    user.value = u!;
					const email = user.value.email!;

					const userRef = doc(db, "users", email);
					const docSnap = await getDoc(userRef);
                    user.value = docSnap.data() as User;
				} else {
					login();
				}
			});
		};

		getUser();

		const join = () => {};

		join();
	},
};
</script>