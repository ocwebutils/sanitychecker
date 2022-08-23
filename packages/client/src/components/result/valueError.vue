<template>
	<div class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box mb-4">
		<input type="checkbox" />
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
import { parseMarked } from "@/util/marked";
export default {
	props: {
		ruleOutput: Object
	},
	methods: {
		getIcon: type => {
			switch (type) {
				case "error": {
					return {
						icon: "fa-solid fa-circle-xmark",
						style: { color: "red" }
					};
				}
				case "warning": {
					return {
						icon: "fa-solid fa-circle-exclamation",
						style: { color: "orange" }
					};
				}
				case "info": {
					return {
						icon: "fa-solid fa-circle-info",
						style: { color: "rgb(59,130,246)" }
					};
				}
			}
		},
		parseMarked: text => {
			return parseMarked(text);
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
