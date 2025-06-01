import { getI18n } from "@/locales/server";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@comp/ui/card";
import { Skeleton } from "@comp/ui/skeleton";

export default async function Loading() {
    // const t = await getI18n(); // Not needed for loading

    return (
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
            <div className="space-y-1">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-5 w-80" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="flex flex-col h-full">
                        <CardHeader className="pb-2 flex-none">
                            <CardTitle>
                                <Skeleton className="h-5 w-32" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>
                                <Skeleton className="h-4 w-full mb-2" />
                                <Skeleton className="h-4 w-2/3" />
                            </CardDescription>
                        </CardContent>
                        <CardFooter>
                            <div className="flex justify-end w-full gap-2">
                                <Skeleton className="h-8 w-20 rounded-sm" />
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}