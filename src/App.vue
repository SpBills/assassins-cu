<template>
	<div class="p-5 min-h-screen">
		<div class="h-screen flex flex-col justify-between">
			<router-view />
			<main-skeleton>
				<Footer />
			</main-skeleton>
		</div>
	</div>
</template>

<script lang="ts" setup>
import Footer from "./components/Footer.vue";
import MainSkeleton from "./components/MainSkeleton.vue";
</script>