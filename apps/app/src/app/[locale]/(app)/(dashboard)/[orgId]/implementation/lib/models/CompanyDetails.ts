import { z } from "zod";

const companyDetailsSchemaV1 = z.object({
	companyName: z.string().default(""),
	companyWebsite: z.string().default(""),
	vendors: z.array(z.string()).default([]),
	headcount: z.number().default(1),
	workStyle: z.string().default(""),
	dataCategories: z.array(z.string()).default([]),
	storageRegions: z.string().default(""),
	identityProviders: z.string().default(""),
	laptopOS: z.array(z.string()).default([]),
	mobileDevice: z.boolean().default(false),
});

enum Versions {
	V1 = "v1",
}

interface CompanyDetailsSchemas {
	[Versions.V1]: typeof companyDetailsSchemaV1;
}

const versionToSchema: CompanyDetailsSchemas = {
	[Versions.V1]: companyDetailsSchemaV1,
};

type CompanyDetailsData = {
	[K in Versions]: z.infer<CompanyDetailsSchemas[K]>;
};

type CompanyDetailsConstructorArgs<V extends Versions> = {
	version: V;
	isCompleted: boolean;
	data: CompanyDetailsData[V];
};

export const companyDetailsObjectSchema = z.object({
	version: z.nativeEnum(Versions),
	isCompleted: z.boolean(),
	data: companyDetailsSchemaV1,
});

export const companyDetailslatestVersionSchema = companyDetailsSchemaV1;
export const companyDetailsLatestVersion = Versions.V1;

export class CompanyDetails {
	readonly version: Versions;
	readonly isCompleted: boolean;
	readonly data: CompanyDetailsData[Versions];

	constructor(input: unknown) {
		// If for some reason the input is undefined or null, create an empty latest version.
		if (input === undefined || input === null) {
			const latest = CompanyDetails.createEmptyLatest();
			this.version = latest.version;
			this.isCompleted = latest.isCompleted;
			this.data = latest.data;
			return;
		}
		const parsed = CompanyDetails.validateAndUpgrade(input);
		this.version = parsed.version;
		this.isCompleted = parsed.isCompleted;
		const schema = versionToSchema[parsed.version];
		this.data = schema.parse(parsed.data);
	}

	private static createEmptyLatest(): CompanyDetailsConstructorArgs<Versions> {
		const latestVersion: Versions = companyDetailsLatestVersion;
		const schema = versionToSchema[latestVersion];
		const emptyData = schema.parse({});

		return {
			version: latestVersion,
			isCompleted: false,
			data: emptyData,
		};
	}

	private static validateAndUpgrade(
		input: unknown,
	): CompanyDetailsConstructorArgs<Versions> {
		try {
			const parsed = z
				.object({
					version: z.nativeEnum(Versions),
					isCompleted: z.boolean(),
					data: companyDetailsSchemaV1,
				})
				.parse(input);
			return CompanyDetails.upgradeToLatestCompanyDetails(parsed);
		} catch (err) {
			console.error("Failed to validate CompanyDetails:", err);
			throw err;
		}
	}

	private static upgradeToLatestCompanyDetails<V extends Versions>(input: {
		version: V;
		data: CompanyDetailsData[V];
		isCompleted: boolean;
	}): CompanyDetailsConstructorArgs<Versions> {
		return input as CompanyDetailsConstructorArgs<Versions>;
	}
}
