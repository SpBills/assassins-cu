<template>
	<div class="p-5 h-screen">
		<div class="h-full flex flex-col justify-between">
			<router-view />
			<main-skeleton>
				<Footer />
			</main-skeleton>
		</div>
	</div>
</template>

<script>
import Footer from "./components/Footer.vue";
import MainSkeleton from "./components/MainSkeleton.vue";

export default {
	components: {
		Footer,
		MainSkeleton,
	},
	setup() {},
};
</script>