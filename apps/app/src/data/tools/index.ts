import { getOrganizationTools } from "./organization";
import { getPolicyTools } from "./policies";
import { getRiskTools } from "./risks";

export const tools = {
	...getOrganizationTools(),
	...getPolicyTools(),
	...getRiskTools(),
};
