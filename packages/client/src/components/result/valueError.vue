<template>
	<div class="collapse collapse-arrow border border-base-300 bg-base-100 dark:bg-darkgray-800 rounded-box mb-4 ml-2 mr-3">
		<input type="checkbox" aria-label="Expand the content" />
		<div class="collapse-title text-base font-medium">
			<fa-icon class="mr-2" :icon="getIcon(ruleOutput.ruleSet.type).icon" :style="getIcon(ruleOutput.ruleSet.type).style" />
			<span>{{ displayNormalizedName(ruleOutput, "rule") }} {{ replaceBoolean(ruleOutput.actualValue) }}</span>
		</div>
		<div class="collapse-content text-sm font-base">
			<p v-dompurify-html="parseMarked(ruleOutput.ruleSet.message as string)" />
			<div class="divider" />
			<span
				>Expected value: <code>{{ replaceBoolean(ruleOutput.expectedValue as string) }}</code></span
			>
			<p>
				Type: <code>{{ ruleOutput.ruleSet.type.charAt(0).toUpperCase() + ruleOutput.ruleSet.type.slice(1) }}</code>
			</p>
			<p>Source: <code>Rules validation</code></p>
			<p>
				Path: <code>{{ ruleOutput.path }}</code>
			</p>
		</div>
	</div>
</template>
<script setup lang="ts">
import type { PropType } from "vue";
import { getIcon, replaceBoolean, displayNormalizedName, parseMarked } from "@/util/utils";
import type { ValueType } from "@/interfaces/metadata";

defineProps({
	ruleOutput: { type: Object as PropType<ValueType>, required: true }
});
</script>
