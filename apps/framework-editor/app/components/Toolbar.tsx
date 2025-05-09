'use client'

import { resetDataAction } from '@/app/actions/admin/reset-data-action';
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
} from "@comp/ui/alert-dialog";
import { Button } from "@comp/ui/button";
import { useToast } from "@comp/ui/use-toast";
import { Download, RotateCcw } from 'lucide-react';
import { useTransition } from 'react';
// Assuming ActionResponse is the type returned within result.data
// It should be imported if you need to explicitly type parts of result.data
// import type { ActionResponse } from '@/types/actions';

export default function Toolbar() {
    const [isPending, startTransition] = useTransition();

    const { toast } = useToast();
        const handleResetData = () => {
            startTransition(async () => {
                toast({
                title: "Resetting data...",
                description: "Please wait while we reset your data.",
            });
            
            // Call the simplified server action
            const result = await resetDataAction(); 

            if (!result) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to get a response from the server.",
                });
                return;
            }

            if (result.success) {
                toast({
                    title: "Success",
                    description: result.message || "Data reset successfully!",
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: result.error || "Failed to reset data.",
                });
            }
        });
    };

    return (
        <div className="flex justify-between items-center py-4">
            <div className="text-lg font-bold">Framework Editor</div>
            <div className="flex gap-2 items-center">
 
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="secondary" size="sm" disabled={isPending}>
                            <RotateCcw size={14} />
                            {isPending ? 'Resetting...' : 'Reset All Data'}
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
                            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleResetData} disabled={isPending}>
                                {isPending ? 'Confirming...' : 'Confirm'}
                            </AlertDialogAction>
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