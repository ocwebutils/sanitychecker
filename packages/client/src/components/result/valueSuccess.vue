<template>
	<div class="border border-base-300 bg-base-100 dark:bg-darkgray-800 rounded-box mb-4 ml-2 mr-3 w-full">
		<div class="collapse-title text-base font-medium">
			<font-awesome-icon class="mr-2" :icon="getIcon(ruleOutput.ruleSet.type).icon" :style="getIcon(ruleOutput.ruleSet.type).style" />
			<span>{{ displayNormalizedName(ruleOutput, "rule") }} {{ replaceBoolean(ruleOutput.actualValue) }}</span>
		</div>
	</div>
</template>
<script lang="ts">
import { PropType } from "vue";
import { replaceBoolean, getIcon, displayNormalizedName } from "@/util/utils";
import { ValueType } from "@/interfaces/metadata";
export default {
	props: {
		ruleOutput: { type: Object as PropType<ValueType>, required: true }
	},
	setup() {
		return {
			replaceBoolean,
			getIcon,
			displayNormalizedName
		};
	}
};
</script>
