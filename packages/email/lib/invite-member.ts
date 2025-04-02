import { sendEmail } from "@bubba/email/lib/resend";
import InviteEmail from "@bubba/email/emails/invite";

export const sendInviteMemberEmail = async (params: {
	email: string;
	inviteLink: string;
	organizationName: string;
}) => {
	const { email, inviteLink, organizationName } = params;

	const emailTemplate = InviteEmail({
		email,
		inviteLink,
		organizationName,
	});
	try {
		await sendEmail({
			to: email,
			subject: "You've been invited to join an organization in Comp AI",
			react: emailTemplate,
		});
	} catch (e) {
		console.error(e);
		throw e;
	}
};
