interface PageLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export default function PageLayout({ children, title }: PageLayoutProps) {
    return (
        <div className="flex flex-col gap-2">
            {title && (
                <div className="border-b">
                    <h1 className="text-xl font-semibold">{title}</h1>
                </div>
            )}
            {children}
        </div>
    );
}