<template>
	<div class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box mb-4">
		<input type="checkbox" />
		<div class="collapse-title text-base font-medium">
			<font-awesome-icon class="mr-2" :icon="getIcon(schemaError.ruleSet.type).icon" :style="getIcon(schemaError.ruleSet.type).style" />
			<span
				>{{
					schemaError.path.split("/").length === 2 && !schemaError.type
						? `(${schemaError.path.split("/")[1]}) ${schemaError.expectedValue}`
						: schemaError.path.split("/").length <= 2
						? schemaError.expectedValue
						: `(${schemaError.path.split("/")[1]}) ${schemaError.expectedValue}`
				}}
			</span>
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
import { parseMarked } from "@/util/marked";
export default {
	props: {
		schemaError: Object
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
			}
		},
		returnMessage: (msg, path, type?) => {
			if (msg.includes("must NOT have additional properties"))
				return "This property shouldn't be in your config. Most likely it has been replaced, removed or never existed in this OpenCore version.";

			if (msg.includes("missing property") || msg.includes("must have required property"))
				return `Expected property not found. Make sure it is present in \`${path}\``;

			if (msg.includes("must be")) return `This property doesn't have the right type. Expected type is \`${type}\`.`;
		},
		parseMarked: text => {
			return parseMarked(text);
		}
	}
};
</script>
