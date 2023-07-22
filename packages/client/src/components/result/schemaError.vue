<template>
	<div class="collapse collapse-arrow border border-base-300 bg-base-100 dark:bg-darkgray-800 rounded-box mb-4 ml-2 mr-3">
		<input type="checkbox" aria-label="Expand the content" />
		<div class="collapse-title text-base font-medium">
			<font-awesome-icon class="mr-2" :icon="getIcon(schemaError.ruleSet.type).icon" :style="getIcon(schemaError.ruleSet.type).style" />
			<span>{{ displayNormalizedName(schemaError, "schema") }} </span>
		</div>
		<div class="collapse-content text-sm font-base">
			<p v-dompurify-html="parseMarked(returnMessage(schemaError.ruleSet.message as string, schemaError.path, schemaError.type) as string)"></p>
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
<script setup lang="ts">
import { PropType } from "vue";
import { getIcon, displayNormalizedName, parseMarked } from "@/util/utils";
import { SchemaType } from "@/interfaces/metadata";

const props = defineProps({
	schemaError: { type: Object as PropType<SchemaType>, required: true },
	ocVersion: { type: String, required: true }
});

const returnMessage = (msg: string, path: string, type?: string) => {
	if (msg.includes("must NOT have additional properties"))
		return `This property shouldn't exist in the provided config. There is two common reasons why this error appears: \n- Most likely it has been replaced, removed or never existed in this OpenCore version. \n- You accidentally moved this property to the wrong place. \n\nNote: Please check the [OpenCore's Documentation](https://github.com/acidanthera/OpenCorePkg/blob/${props.ocVersion}/Docs/Configuration.pdf) for **v${props.ocVersion}** to know more about this property`;

	if (msg.includes("missing property") || msg.includes("must have required property"))
		return `This property hasn't been detected in the provided config. There is two common reasons why this error appears: \n- Most likely it's new in **v${props.ocVersion}** so you might need to add it manually. \n- You accidentally moved the property to the wrong place and now it's missing in its required place. \n\nMake sure it is present in \`${path}\` \nNote: Please check the [OpenCore's Documentation](https://github.com/acidanthera/OpenCorePkg/blob/${props.ocVersion}/Docs/Configuration.pdf) for **v${props.ocVersion}** to know more about this property`;

	if (msg.includes("must be")) return `This property doesn't have the right type. Expected type is \`${type}\``;
};
</script>
<style>
.collapse-content li {
	list-style-type: disc;
	margin-left: 2rem;
}
</style>
