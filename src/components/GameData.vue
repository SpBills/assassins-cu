<template>
	<div>
		<p>Game Code: {{ gameId }}</p>
		<qrcode-vue class="mx-auto mt-5" v-if="gameId" :value="gameId"></qrcode-vue>
	</div>
</template>

<script>
import QrcodeVue from "qrcode.vue";

export default {
    components: {
        QrcodeVue
    },
    props: {
        gameId: {
            type: String,
            required: true
        }
    }
}
</script>