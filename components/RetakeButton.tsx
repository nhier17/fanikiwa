"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { retakeInterview } from "@/lib/actions/interview.action";

interface RetakeButtonProps {
    interviewId: string;
    userId: string;
}

const RetakeButton = ({ interviewId, userId }: RetakeButtonProps) => {
    const router = useRouter();

    const handleRetake = async () => {
        try {
            const { success, newInterviewId } = await retakeInterview({ 
                interviewId, 
                userId 
            });
            
            if (success) {
                router.push(`/interview/${newInterviewId}`);
            }
        } catch (error) {
            console.error("Error retaking interview:", error);
        }
    };

    return (
        <Button 
            className="btn-primary flex-1"
            onClick={handleRetake}
        >
            <p className="text-sm font-semibold text-black text-center">
                Retake Interview
            </p>
        </Button>
    );
};

export default RetakeButton;
