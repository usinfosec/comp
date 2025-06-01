export type CompanyDetails = {
	legalName: string;
	website: string;
	techStack: string;
	team: string;
	laptopAndMobileDevices: string;
	identity: string;
	hosting: string;
	vendors: string;
	data: string;
};

export type ChatBubble = {
	type: "system" | "user";
	text: string;
	key?: keyof CompanyDetails;
	isEditing?: boolean;
};

export type Step = {
	key: keyof CompanyDetails;
	question: string;
	placeholder: string;
};
