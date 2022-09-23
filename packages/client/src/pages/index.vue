<template>
	<div>
		<homeInfoBox />
		<homeHeroContent>
			<homeFormContent />
		</homeHeroContent>
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
