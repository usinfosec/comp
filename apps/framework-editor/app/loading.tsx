import { Skeleton } from "@comp/ui/skeleton";
import PageLayout from "./components/PageLayout";

export default function Loading() {
    return (
        <PageLayout isLoading>
            <div className="flex flex-col gap-4 w-full">
              <div className="flex justify-between items-center gap-2">
                <Skeleton className="w-full max-w-sm h-10" />
              </div>
              <div>
                <Skeleton className="w-full h-10 mb-2" /> {/* Table header */}
                <Skeleton className="w-full h-12 mb-1" /> {/* Table row */}
                <Skeleton className="w-full h-12 mb-1" /> {/* Table row */}
                <Skeleton className="w-full h-12 mb-1" /> {/* Table row */}
                <Skeleton className="w-full h-12 mb-1" /> {/* Table row */}
                <Skeleton className="w-full h-12" /> {/* Table row */}
              </div>
            </div>
        </PageLayout>
    );
}