<template>
	<div class="collapse collapse-arrow border border-base-300 bg-base-100 dark:bg-darkgray-800 rounded-box mb-4 ml-2 mr-3">
		<input type="checkbox" aria-label="Expand the content" />
		<div class="collapse-title text-base font-medium">
			<fa-icon class="mr-2" :icon="getIcon(schemaError.ruleSet.type).icon" :style="getIcon(schemaError.ruleSet.type).style" />
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
import type { PropType } from "vue";
import { getIcon, displayNormalizedName, parseMarked } from "@/util/utils";
import type { SchemaType } from "@/interfaces/metadata";

const props = defineProps({
	schemaError: { type: Object as PropType<SchemaType>, required: true },
	ocVersion: { type: String, required: true }
});

const returnMessage = (msg: string, path: string, type?: string) => {
	if (msg.includes("must NOT have additional properties"))
		return `This property isn't expected in the provided configuration. There are two common reasons why this error occurs:
- It's possible that the property has been replaced, removed, or was never present in this version of OpenCore,
- You might have accidentally relocated this property to an incorrect location within the configuration
\nNote: For further information about this property, please refer to the **[OpenCore's Documentation](https://github.com/acidanthera/OpenCorePkg/blob/${props.ocVersion}/Docs/Configuration.pdf)** for version **v${props.ocVersion}**`;

	if (msg.includes("missing property") || msg.includes("must have required property"))
		return `The specified property was not detected in the provided configuration. There are two common reasons behind this error:
- It is possible that this property is new in **v${props.ocVersion}**, requiring manual addition to the configuration,
- You might have accidentally relocated this property to an incorrect location within the configuration
\nMake sure this property is included correctly in \`${path}\`
Note: For further information about this property, please refer to the **[OpenCore's Documentation](https://github.com/acidanthera/OpenCorePkg/blob/${props.ocVersion}/Docs/Configuration.pdf)** for version **v${props.ocVersion}**`;

	if (msg.includes("must be"))
		return `This property doesn't have the correct type. It should have a type of \`${type}\`
Note: For further information about this property, please refer to the **[OpenCore's Documentation](https://github.com/acidanthera/OpenCorePkg/blob/${props.ocVersion}/Docs/Configuration.pdf)** for version **v${props.ocVersion}**`;
};
</script>
<style>
.collapse-content li {
	list-style-type: disc;
	margin-left: 2rem;
}
</style>
