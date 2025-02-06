import { FilterToolbar } from "@/components/tables/people/filter-toolbar";
import { Loading } from "@/components/tables/people/loading";
import { Skeleton } from "@bubba/ui/skeleton";

export default function LoadingPeople() {
  return (
    <div className="relative overflow-hidden">
      <FilterToolbar isEmpty={true} />
      <Skeleton className="h-[500px] w-full" />
    </div>
  );
}
