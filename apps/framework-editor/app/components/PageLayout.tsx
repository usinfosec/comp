import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@comp/ui/breadcrumb";
import React from "react";

interface PageLayoutProps {
    children: React.ReactNode;
    title?: string;
    breadcrumbs?: {
        href?: string;
        label: string;
    }[];
}

export default function PageLayout({ children, title, breadcrumbs }: PageLayoutProps) {
    return (
        <div className="flex flex-col gap-2">
            {(title || breadcrumbs) && (
                <div className="border-b pb-2">
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
                    ) : title ? (
                        <h1 className="text-xl font-semibold">{title}</h1>
                    ) : null}
                </div>
            )}
            {children}
        </div>
    );
}