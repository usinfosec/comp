import { auth } from "@/auth";
import { db } from "@bubba/db";
import { EmployeeCompletionChart } from "./EmployeeCompletionChart";

export async function EmployeesOverview() {
	const employees = await getEmployees();
	const policies = await getEmployeePolicies();
	const trainingVideos = await getEmployeeTrainingVideos();

	console.log({ employees, policies, trainingVideos });

	return (
		<div className="grid gap-6">
			<EmployeeCompletionChart
				employees={employees}
				policies={policies}
				trainingVideos={trainingVideos}
			/>
			{/* Add more dashboard components here as needed */}
		</div>
	);
}

const getEmployees = async () => {
	const session = await auth();
	const orgId = session?.user.organizationId;

	if (!orgId) {
		return [];
	}

	const employees = await db.portalUser.findMany({
		where: {
			organizationId: orgId,
		},
	});

	return employees;
};

const getEmployeePolicies = async () => {
	const session = await auth();
	const orgId = session?.user.organizationId;

	if (!orgId) {
		return [];
	}

	const policies = await db.organizationPolicy.findMany({
		where: {
			organizationId: orgId,
			isRequiredToSign: true,
		},
		include: {
			policy: true,
		},
	});

	return policies;
};

const getEmployeeTrainingVideos = async () => {
	const session = await auth();
	const orgId = session?.user.organizationId;

	if (!orgId) {
		return [];
	}

	const trainingVideos = await db.organizationTrainingVideos.findMany({
		where: {
			organizationId: orgId,
		},
		include: {
			trainingVideo: true,
		},
	});

	return trainingVideos;
};
