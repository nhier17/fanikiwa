import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewByUserId, getLatestInterviews } from "@/lib/actions/interview.action";

export default async function Home() {
  const user = await getCurrentUser();

  const [userInterviews, latestInterviews] = await Promise.all([
    getInterviewByUserId(user?.id!),
    getLatestInterviews({ userId: user?.id! })
  ]);

  const hasPastInterviews = userInterviews?.length! > 0;
  const hasUpcomingInterviews = latestInterviews?.length! > 0;

  return (
    <>
    <section className="card-cta">
      <div className="flex flex-col gap-6 max-w-lg">
      <h2>Master your interview with AI-Powered practice</h2>
      <p>Sharpen your skills with Fanikiwa real-world interview questions and receive instant, actionable feedback.</p>

      <Button asChild className="btn-primary max-sm:w-full">
        <Link href="/interview">Start an interview</Link>
        </Button>
      </div>
      <Image 
        src="/images/robot.png" 
        alt="AI Interview" 
        width={500} 
        height={500} 
        className="max-sm:hidden"
      />
    </section>

    <section className="flex flex-col gap-6 mt-8">
        <h2>Your Interviews</h2>
        
        <div className="interviews-section">
            {hasPastInterviews ? (
              userInterviews?.map((interview) => (
                <InterviewCard 
                  key={interview.id} 
                  {...interview}
                />
              ))
            ) : (
              <p>You haven't taken any interviews yet.</p>
            )}
        </div>
    </section>

    <section className="flex flex-col gap-6 mt-8">
      <h2>Take Interview</h2>

      <div className="interviews-section">
        {hasUpcomingInterviews ? (
          latestInterviews?.map((interview) => (
            <InterviewCard 
              key={interview.id} 
              {...interview}
            />
          ))
        ) : (
          <p>No upcoming interviews available.</p>
        )}
      </div>
    </section>

    </>
  );
}
