import { createAuth } from "@comp/auth";

if (!process.env.AUTH_SECRET) {
	throw new Error("AUTH_SECRET is not set");
}

if (!process.env.AUTH_GOOGLE_ID) {
	throw new Error("AUTH_GOOGLE_ID is not set");
}

if (!process.env.AUTH_GOOGLE_SECRET) {
	throw new Error("AUTH_GOOGLE_SECRET is not set");
}

export const auth = createAuth({
	secret: process.env.AUTH_SECRET,
	googleAuth: {
		clientId: process.env.AUTH_GOOGLE_ID,
		clientSecret: process.env.AUTH_GOOGLE_SECRET,
	},
});
