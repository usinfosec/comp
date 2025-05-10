import Link from "next/link"
import { Badge } from "@comp/ui/badge"

interface ComplianceSummaryProps {
    text: string
}

export default function ComplianceSummary({ text }: ComplianceSummaryProps) {
    return (
        <div className="mt-4">
            <p className="text-sm">{text}</p>
        </div>
    )
}
