<template>
  <MainSkeleton>
    <LoadingBar v-if="!confirmedAdmin" />

    <div v-if="confirmedAdmin">
      <h1 class="font-bold mb-3 text-xl">Current game</h1>
      <GameData :gameId="gameId" :game="game" :userEmail="user.email" />
    </div>
  </MainSkeleton>
</template>

<script lang="ts" setup>import { onAuthStateChanged, User } from 'firebase/auth';
import { ref } from 'vue';
import { getAuth } from 'firebase/auth';
import { doc, getFirestore } from '@firebase/firestore';
import { getDoc } from 'firebase/firestore';
import { useRouter } from 'vue-router';
import MainSkeleton from '@/components/MainSkeleton.vue';
import LoadingBar from '@/components/LoadingBar.vue';
import Game from '@/models/Game';
import GameData from '@/components/GameData.vue';
const user = ref({} as User);

const auth = getAuth();
const db = getFirestore();

const router = useRouter();

const confirmedAdmin = ref(false);
const gameId = ref();
const game = ref();

onAuthStateChanged(auth, async (u) => {
  user.value = u!;
  const email = user.value.email!;

  const userRef = doc(db, "users", email);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data()!;
  const gameRef = doc(db, "games", userData.game);
  const gameSnap = await getDoc(gameRef);

  const gameEmail = gameSnap.data()!.owner.email;

  game.value = gameSnap.data() as Game;
  gameId.value = userData.game;

  if (gameEmail !== email) {
    router.push('/');
  } else {
    confirmedAdmin.value = true;
  }

  console.log(confirmedAdmin.value);
});
</script>