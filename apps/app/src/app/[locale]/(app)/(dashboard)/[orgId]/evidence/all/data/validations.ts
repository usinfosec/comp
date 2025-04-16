import { getFiltersStateParser, getSortingStateParser } from "@/lib/parsers";
import { Task, TaskStatus } from "@comp/db/types";
import {
	createSearchParamsCache,
	parseAsArrayOf,
	parseAsInteger,
	parseAsString,
	parseAsStringEnum,
} from "nuqs/server";
import * as z from "zod";

export const searchParamsCache = createSearchParamsCache({
	page: parseAsInteger.withDefault(1),
	perPage: parseAsInteger.withDefault(10),
	sort: getSortingStateParser<Task>().withDefault([
		{ id: "title", desc: false },
	]),
	title: parseAsString.withDefault(""),
	status: parseAsArrayOf(z.nativeEnum(TaskStatus)).withDefault([]),
	createdAt: parseAsArrayOf(z.coerce.date()).withDefault([]),
	// advanced filter
	filters: getFiltersStateParser().withDefault([]),
	joinOperator: parseAsStringEnum(["and", "or"]).withDefault("and"),
});

export type GetEvidenceSchema = Awaited<
	ReturnType<typeof searchParamsCache.parse>
>;
