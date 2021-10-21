<template>
    <div>
        <p>Game name: </p>
        <input v-model="gameName" type="text">

        <button @click="create">Create</button>
    </div>
</template>

<script lang="ts">
import { collection, doc, getFirestore, setDoc, Timestamp } from "firebase/firestore"; 

import { ref } from '@vue/reactivity'
export default {
    setup() {
        const gameName = ref("");

        const db = getFirestore();

        const gamesCollection = collection(db, "games")

        const create = async () => {
            const game = {
                name: gameName.value,
                time: Timestamp.now(),
                users: []
            }

            await setDoc(doc(gamesCollection), game);
        }

        return {
            gameName,
            create
        }
    },
}
</script>