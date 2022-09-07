<template>
	<div>
		<info />
		<formBox />
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
