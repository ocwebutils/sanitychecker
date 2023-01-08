<template>
	<div class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box mb-4 ml-3 mr-3">
		<input type="checkbox" />
		<div class="collapse-title text-base font-medium">
			<font-awesome-icon class="mr-2" :icon="getIcon(schemaError.ruleSet.type).icon" :style="getIcon(schemaError.ruleSet.type).style" />
			<span>{{ displayNormalizedName(schemaError, "schema") }} </span>
		</div>
		<div class="collapse-content text-sm font-base">
			<p v-dompurify-html="parseMarked(returnMessage(schemaError.ruleSet.message, schemaError.path, schemaError.type))"></p>
			<div class="divider" />
			<p>
				Type: <code>{{ schemaError.ruleSet.type.charAt(0).toUpperCase() + schemaError.ruleSet.type.slice(1) }}</code>
			</p>
			<p>Source: <code>Schema validation</code></p>
			<p>
				Path: <code>{{ schemaError.path }}</code>
			</p>
		</div>
	</div>
</template>
<script lang="ts">
import { getIcon, displayNormalizedName, parseMarked } from "@/util/utils";
export default {
	props: {
		schemaError: Object
	},
	setup() {
		return {
			getIcon,
			displayNormalizedName,
			parseMarked
		};
	},
	methods: {
		returnMessage: (msg: string, path: string, type?: string) => {
			if (msg.includes("must NOT have additional properties"))
				return "This property shouldn't be in your config. Most likely it has been replaced, removed or never existed in this OpenCore version. Please check documentation for more information";

			if (msg.includes("missing property") || msg.includes("must have required property"))
				return `Sanity Checker didn't detect this property in your config. Make sure it is present in \`${path}\`<br/>Note: This property may or may not be required for OpenCore to boot. Please check documentation for more information`;

			if (msg.includes("must be")) return `This property doesn't have the right type. Expected type is \`${type}\``;
		}
	}
};
</script>
