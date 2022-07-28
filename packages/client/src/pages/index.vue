<template>
	<div>
		<info />
		<formBox />
	</div>
</template>

<script>
import { createIdentificator } from "@/util/uuid";

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
