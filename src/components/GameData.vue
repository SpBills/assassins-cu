<template>
	<div>
		<p>Game Code: {{ gameId }}</p>
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