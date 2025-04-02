import {
	createSearchParamsCache,
	parseAsArrayOf,
	parseAsInteger,
	parseAsString,
	parseAsStringEnum,
} from "nuqs/server";
import * as z from "zod";
import { getFiltersStateParser, getSortingStateParser } from "@/lib/parsers";
import { Departments, Frequency, Policy, PolicyStatus } from "@bubba/db/types";

export const searchParamsCache = createSearchParamsCache({
	page: parseAsInteger.withDefault(1),
	perPage: parseAsInteger.withDefault(10),
	sort: getSortingStateParser<Policy>().withDefault([
		{ id: "createdAt", desc: true },
	]),
	name: parseAsString.withDefault(""),
	status: parseAsArrayOf(z.nativeEnum(PolicyStatus)).withDefault([]),
	createdAt: parseAsArrayOf(z.coerce.date()).withDefault([]),
	updatedAt: parseAsArrayOf(z.coerce.date()).withDefault([]),
	// advanced filter
	filters: getFiltersStateParser().withDefault([]),
	joinOperator: parseAsStringEnum(["and", "or"]).withDefault("and"),
});

export const createPolicySchema = z.object({
	name: z.string(),
	status: z.nativeEnum(PolicyStatus),
	frequency: z.nativeEnum(Frequency),
	department: z.nativeEnum(Departments),
});

export type GetPolicySchema = Awaited<
	ReturnType<typeof searchParamsCache.parse>
>;
export type CreatePolicySchema = z.infer<typeof createPolicySchema>;
