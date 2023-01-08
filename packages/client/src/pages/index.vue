<template>
	<div>
		<InfoBox />
		<HeroContent>
			<HeroFormContent />
		</HeroContent>
	</div>
</template>

<script>
import { createIdentificator } from "@/util/identificator";

export default {
	mounted() {
		this.storage();
	},
	methods: {
		async storage() {
			await createIdentificator();
		}
	}
};
</script>
