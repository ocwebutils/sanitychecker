<template>
	<div class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box mb-4 ml-3 mr-3">
		<input type="checkbox" />
		<div class="collapse-title text-base font-medium">
			<font-awesome-icon class="mr-2" :icon="getIcon(ruleOutput.ruleSet.type).icon" :style="getIcon(ruleOutput.ruleSet.type).style" />
			<span>{{ displayNormalizedName(ruleOutput, "rule") }} {{ replaceBoolean(ruleOutput.actualValue) }}</span>
		</div>
		<div class="collapse-content text-sm font-base">
			<p v-dompurify-html="parseMarked(ruleOutput.ruleSet.message)" />
			<div class="divider" />
			<span
				>Expected value: <code>{{ replaceBoolean(ruleOutput.expectedValue) }}</code></span
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
<script lang="ts">
import { getIcon, replaceBoolean, displayNormalizedName, parseMarked } from "@/util/utils";
export default {
	props: {
		ruleOutput: Object
	},
	setup() {
		return {
			replaceBoolean,
			getIcon,
			displayNormalizedName,
			parseMarked
		};
	}
};
</script>
