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
                <div className="pt-2">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <Skeleton className="w-24 h-6" />
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <Skeleton className="w-32 h-6" />
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <div>
                    <Skeleton className="w-full h-[300px]" />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {(breadcrumbs) && (
                <div className="pt-2">
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