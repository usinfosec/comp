import type { Metadata } from 'next';
import { OnboardingForm } from './components/OnboardingForm';

export const metadata: Metadata = {
  title: 'Organization Setup | Comp AI',
};

interface SearchParams {
  intent?: string;
}

export default function SetupPage() {
  return <OnboardingForm />;
}
