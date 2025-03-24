import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";
import { dummyInterviews } from "@/constants";

export default function Home() {
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
            {dummyInterviews.map((interview) => (
              <InterviewCard key={interview.interviewId} {...interview} />
            ))}
        </div>
    </section>

    <section className="flex flex-col gap-6 mt-8">
      <h2>Take Interview</h2>

      <div className="interviews-section">
        {dummyInterviews.map((interview) => (
          <InterviewCard 
            key={interview.interviewId} 
            {...interview}
          />
        ))}
      </div>
    </section>

    </>
  );
}
