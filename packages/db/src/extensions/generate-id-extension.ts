import { Prisma } from "@prisma/client";
import cuid from "cuid";

const PREFIX_KEY = "$prefix_";

const generateId = (idTemplate: string) => {
	const prefix = idTemplate.split("_")[1];
	const randomPart = cuid();
	return `${prefix}_${randomPart}`;
};

/**
This extension generates IDs for Prisma models by intercepting create/upsert operations.
When an input ID matches "prefix_{type}", it generates "{type}_{cuid}".

Examples:
"prefix_usr" -> "usr_ch72gsb320000udocl363emi"
"prefix_env" -> "env_ci72gsb320000udocl363emi"

Applies to:
- Single create
- Bulk create (createMany) 
- Upsert operations

IDs that don't match "prefix_*" are preserved unchanged.

Example usage:
await prisma.user.create({
  data: {
    id: "prefix_usr", // Generates: usr_{cuid}
    name: "John"
  }
})
*/
export const generateIdExtension = Prisma.defineExtension({
	query: {
		$allModels: {
			async create({ args, operation, model, query }) {
				// Example: "prefix_env", we should generate "env_{cuid}"
				if (args.data?.id?.startsWith(PREFIX_KEY)) {
					args.data.id = generateId(args.data.id);
					return query(args);
				}
				return query(args);
			},
			async createMany({ args, operation, model, query }) {
				if (Array.isArray(args.data)) {
					args.data = args.data.map((item: any) => {
						if (item.id?.startsWith(PREFIX_KEY)) {
							return {
								...item,
								id: generateId(item.id),
							};
						}
						return item;
					});
				}
				return query(args);
			},
			async createManyAndReturn({ args, operation, model, query }) {
				if (Array.isArray(args.data)) {
					args.data = args.data.map((item: any) => {
						if (item.id?.startsWith(PREFIX_KEY)) {
							return {
								...item,
								id: generateId(item.id),
							};
						}
						return item;
					});
				}
				return query(args);
			},
			async upsert({ args, operation, model, query }) {
				if (args.create?.id?.startsWith(PREFIX_KEY)) {
					args.create.id = generateId(args.create.id);
				}
				return query(args);
			},
		},
	},
});
