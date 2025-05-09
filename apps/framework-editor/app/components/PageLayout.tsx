import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@comp/ui/breadcrumb";
import { Skeleton } from "@comp/ui/skeleton";
import React, { Suspense } from "react";

interface PageLayoutProps {
    children: React.ReactNode;
    breadcrumbs?: {
        href?: string;
        label: string;
    }[];
    isLoading?: boolean;
}

export default function PageLayout({ children, breadcrumbs, isLoading = false }: PageLayoutProps) {

    if (isLoading) {
        return (
            <div className="flex flex-col gap-4">
            <div className="border-b py-2">
                <Skeleton className="w-full h-10" />
            </div>
            <Skeleton className="w-full h-10" />
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4">
            {(breadcrumbs) && (
                <div className="border-b py-2">
                    {breadcrumbs ? (
                        <Breadcrumb>
                            <BreadcrumbList>
                                {breadcrumbs.map((crumb, index) => (
                                    <React.Fragment key={index}>
                                        <BreadcrumbItem>
                                            {index === breadcrumbs.length - 1 ? (
                                                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                                            ) : (
                                                <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                                            )}
                                        </BreadcrumbItem>
                                        {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                                    </React.Fragment>
                                ))}
                            </BreadcrumbList>
                        </Breadcrumb>
                    ) : null}
                </div>
            )}
            {children}  
        </div>
    );
}