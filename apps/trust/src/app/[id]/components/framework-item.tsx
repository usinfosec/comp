import type React from "react"
import type { FrameworkStatus } from "@comp/db/types"
import { Badge } from "@comp/ui/badge"

interface FrameworkItemProps {
    text: string
    status: FrameworkStatus
    icon?: React.ReactNode
}

export default function FrameworkItem({ text, status, icon }: FrameworkItemProps) {
    const getStatusText = (status: FrameworkStatus) => {
        switch (status) {
            case "started":
                return "Started"
            case "in_progress":
                return "In progress"
            case "compliant":
                return "Compliant"
            default:
                return "Unknown"
        }
    }

    return (
        <div className="flex items-center justify-between py-3 px-1 rounded-md transition-colors">
            <div className="flex items-center gap-3">
                {icon && (
                    <div className="w-12 h-12 rounded-full bg-transparent flex items-center justify-center text-foreground text-xs font-medium">
                        {icon}
                    </div>
                )}
                <div className="flex flex-col">
                    <span className="font-medium">{text}</span>
                    <Badge variant="marketing" className="text-foreground font-bold">
                        {getStatusText(status)}
                    </Badge>
                </div>
            </div>
        </div>
    )
}
