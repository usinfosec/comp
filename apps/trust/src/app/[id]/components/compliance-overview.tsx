import type { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@comp/ui/card"

interface ComplianceSectionProps {
    title: string
    children: ReactNode
    isLive?: boolean
}

export default function ComplianceSection({ title, children, isLive = false }: ComplianceSectionProps) {
    return (
        <Card>
            <CardHeader className="border-t-muted-foreground border-t-4 rounded-t-sm border-b border-b-">
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 px-4 pb-4">
                {children}
            </CardContent>
        </Card>
    )
}

