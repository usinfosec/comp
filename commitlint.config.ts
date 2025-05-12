import { RuleConfigSeverity } from "@commitlint/types";

export default {
	extends: ["@commitlint/config-conventional"],
	rules: {
		"body-max-line-length": [
			RuleConfigSeverity.Error,
			"always",
			Number.POSITIVE_INFINITY,
		], // Disable body line length rule
		"header-max-length": [
			RuleConfigSeverity.Error,
			"always",
			Number.POSITIVE_INFINITY,
		], // Disable header line length rule
	},
};
