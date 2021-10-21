<template>
    <div>
        <h1>Your target is: {{target}}</h1>

        <button @click="dead">Eliminated</button>
    </div>
</template>

<script lang="ts">
import { ref } from '@vue/reactivity'
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { toRef } from 'vue';
export default {
    props: {
        game: {
            type: String,
            required: true
        },
        user: {
            type: Object,
            required: true
        }
    },
    setup(props) {
        const target = ref("");
        const db = getFirestore();

        const game = toRef(props, 'game');
        const user = toRef(props, 'user');

        const getTarget = async () => {
            const gameRef = doc(db, "games", game.value);
			const docSnap = await getDoc(gameRef);

            const players = docSnap.data()!.users;

            if (players.length === 1) {
                console.log("There are no other players.");
                return;
            }

            const next: number = players.findIndex((player: String) => player === user.value.email) + 1;
            const nextPlayer: string = players[next];

            target.value = nextPlayer;
        }

        getTarget();

        return {
            target
        }
    },
}
</script>