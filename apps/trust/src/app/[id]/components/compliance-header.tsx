import Image from "next/image"
import { buttonVariants } from "@comp/ui/button"
import type { Organization } from "@comp/db/types"
import Link from "next/link"
import { ExternalLink, Globe } from "lucide-react"
import Logo from "./logo"
import ComplianceSummary from "./compliance-summary"

interface ComplianceHeaderProps {
    organization: Organization
    title: string
}

export default function ComplianceHeader({ organization, title }: ComplianceHeaderProps) {
    return (
        <div className="flex flex-col gap-4 border p-4 border-t-4 border-t-primary rounded">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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
                            <div className="w-10 h-10 bg-muted-foreground rounded-md flex items-center justify-center text-white font-bold">
                                {organization.name.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-xl font-bold">{title}</h1>
                        <ComplianceSummary
                            text={`Find out the compliance and security posture of ${organization.name}.`}
                        />
                    </div>
                </div>

                <div className="grid sm:flex gap-2">
                    <Link className={buttonVariants({ variant: "outline", className: "text-xs" })} href={`${organization.website || "https://trycomp.ai"}`}>
                        Visit {organization.name} <ExternalLink className="w-3 h-3" />
                    </Link>
                    <Link className={buttonVariants({ variant: "outline", className: "text-xs" })} href="https://trycomp.ai">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <Logo className="w-4 h-4 hidden sm:block" /> Monitored by Comp AI
                    </Link>
                </div>
            </div>
        </div>
    )
}
