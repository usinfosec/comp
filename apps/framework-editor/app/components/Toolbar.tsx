import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Upload, RotateCcw, Download } from 'lucide-react';

export default function Toolbar() {
    return (
        <div className="flex justify-between items-center p-4 border-b">
            <div className="text-lg font-bold">Framework Editor</div>
            <div className="flex gap-2 items-center">
 
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="secondary" size="sm">
                            <RotateCcw size={14} />
                            Reset All Data
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action will reset all your data to the version currently in production/GitHub. Any changes you haven't exported will be lost.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction>Confirm</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <Button variant="default" size="sm">
                    <Download size={14} />
                    Export Data
                </Button>
            </div>
        </div>
    );
}