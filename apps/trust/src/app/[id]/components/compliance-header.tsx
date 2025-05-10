import Image from "next/image"
import { buttonVariants } from "@comp/ui/button"
import type { Organization } from "@comp/db/types"
import Link from "next/link"
import { Globe } from "lucide-react"

interface ComplianceHeaderProps {
    organization: Organization
    title: string
}

export default function ComplianceHeader({ organization, title }: ComplianceHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center">
                    {organization.logo ? (
                        <Image
                            src={organization.logo || "/placeholder.svg"}
                            alt={`${organization.name} logo`}
                            width={40}
                            height={40}
                            className="object-contain"
                        />
                    ) : (
                        <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center text-white font-bold">
                            {organization.name.charAt(0)}
                        </div>
                    )}
                </div>
                <h1 className="text-xl font-bold">{title}</h1>
            </div>

            <div className="flex gap-2">
                <Link className={buttonVariants({ variant: "outline", className: "text-xs" })} href={`${organization.website}`}>
                    <Globe className="w-3 h-3" />
                    {organization.name}
                </Link>
                <Link className={buttonVariants({ variant: "outline", className: "text-xs" })} href="https://trycomp.ai">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    Monitoring with Comp AI
                </Link>
            </div>
        </div>
    )
}
