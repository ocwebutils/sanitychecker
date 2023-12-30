<template>
	<div class="border border-base-300 bg-base-100 dark:bg-darkgray-800 rounded-box mb-4 ml-2 w-full">
		<div class="daisy-collapse-title text-base font-medium">
			<fa-icon class="mr-2" :icon="getIcon(ruleOutput.ruleSet.type).icon" :style="getIcon(ruleOutput.ruleSet.type).style" />
			<span>{{ displayNormalizedName(ruleOutput, "rule") }} {{ replaceBoolean(ruleOutput.actualValue) }}</span>
		</div>
	</div>
</template>
<script setup lang="ts">
import type { PropType } from "vue";
import { replaceBoolean, getIcon, displayNormalizedName } from "@/utils/helpers";
import type { ValueType } from "@/interfaces/metadata";

defineProps({
	ruleOutput: { type: Object as PropType<ValueType>, required: true }
});
</script>
