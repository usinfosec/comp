import { EvidenceDetails } from "./Components/EvidenceDetails";

interface EvidencePageProps {
  params: {
    id: string;
  };
}

export default function EvidencePage({ params }: EvidencePageProps) {
  return <EvidenceDetails id={params.id} />;
}
