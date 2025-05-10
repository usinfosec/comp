import { CheckCircle } from "lucide-react"

interface ComplianceItemProps {
    text: string
    isCompliant: boolean
}

export default function ComplianceItem({ text, isCompliant }: ComplianceItemProps) {
    return (
        <div className="flex items-center justify-between py-1 font-mono">
            <span className="text-sm">{text}</span>
            {isCompliant ? (
                <div className="w-2 h-2 bg-green-500 rounded-full" />
            ) : (
                <div className="w-2 h-2 bg-red-500 rounded-full" />
            )}
        </div>
    )
}
