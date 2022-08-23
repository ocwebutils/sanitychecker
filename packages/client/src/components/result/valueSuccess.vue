<template>
	<div class="border border-base-300 bg-base-100 rounded-box mb-4">
		<div class="collapse-title text-base font-medium">
			<font-awesome-icon class="mr-2" :icon="getIcon(ruleOutput.ruleSet.type).icon" :style="getIcon(ruleOutput.ruleSet.type).style" />
			<span
				>{{
					ruleOutput.path.split("/").length >= 5
						? `(${ruleOutput.path.split("/")[1]}) ${ruleOutput.path.split("/")[3]}.${ruleOutput.path.split("/")[4]}:`
						: ruleOutput.path.split("/")[2] === undefined
						? `${ruleOutput.path.split("/")[1]}:`
						: `(${ruleOutput.path.split("/")[1]}) ${ruleOutput.path.split("/")[2]}:`
				}}
				{{ replaceBoolean(ruleOutput.actualValue) }}</span
			>
		</div>
	</div>
</template>
<script lang="ts">
export default {
	props: {
		ruleOutput: Object
	},
	methods: {
		getIcon: type => {
			switch (type) {
				case "success": {
					return {
						icon: "fa-solid fa-circle-check",
						style: { color: "green" }
					};
				}
			}
		},
		replaceBoolean: string => {
			const val = string.toString();
			switch (val) {
				case "true":
					return val.replace("true", "Enabled");
				case "false":
					return val.replace("false", "Disabled");
				default:
					return val;
			}
		}
	}
};
</script>
