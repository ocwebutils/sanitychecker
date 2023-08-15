import { config, library } from "@fortawesome/fontawesome-svg-core";
import {
	faArrowDown,
	faBars,
	faCircleCheck,
	faCircleExclamation,
	faCircleInfo,
	faCircleXmark,
	faCloudArrowUp,
	faCode,
	faCodeCommit,
	faCopy,
	faCube,
	faMoon,
	faNoteSticky,
	faQuestion,
	faSun,
	faDownload,
	faArrowUpRightFromSquare,
	faHome,
	faGavel,
	faXmark,
	faCheck
} from "@fortawesome/free-solid-svg-icons";
import { faDiscord, faGithub } from "@fortawesome/free-brands-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

config.autoAddCss = false;

library.add(
	faSun,
	faMoon,
	faCode,
	faCodeCommit,
	faNoteSticky,
	faBars,
	faArrowDown,
	faQuestion,
	faCircleXmark,
	faCircleExclamation,
	faCircleCheck,
	faCopy,
	faCircleInfo,
	faCube,
	faCloudArrowUp,
	faDownload,
	faArrowUpRightFromSquare,
	faHome,
	faGavel,
	faCheck,
	faXmark
);
library.add(faGithub, faDiscord);

export default defineNuxtPlugin(nuxtApp => {
	nuxtApp.vueApp.component("fa-icon", FontAwesomeIcon);
});
