import type { ReactNode } from "react"

interface ComplianceSectionProps {
    title: string
    children: ReactNode
    isLive?: boolean
}

export default function ComplianceSection({ title, children, isLive = false }: ComplianceSectionProps) {
    return (
        <div className="border rounded-md p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">{title}</h2>
                {isLive && (
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-xs">Live</span>
                    </div>
                )}
            </div>
            <div>{children}</div>
        </div>
    )
}
