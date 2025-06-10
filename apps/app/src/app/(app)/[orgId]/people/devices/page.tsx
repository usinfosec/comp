import { EmployeeDevicesList } from "./components/EmployeeDevicesList";
import { getEmployeeDevices } from "./data";

export default async function EmployeeDevicesPage() {
	const devices = (await getEmployeeDevices()) || [];

	return (
		<div>
			<EmployeeDevicesList devices={devices} />
		</div>
	);
}
