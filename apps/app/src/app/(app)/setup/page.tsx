import { Metadata } from 'next';
import { OrganizationSetupForm } from './components/OrganizationSetupForm';

export const metadata: Metadata = {
  title: 'Setup Your Organization | Comp AI',
};

export default function SetupPage() {
  return <OrganizationSetupForm />;
}
