import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getInterviewById, getFeedbackByInterviewId } from "@/lib/actions/interview.action";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { Button } from "@/components/ui/button";
import RetakeButton from "@/components/RetakeButton";

const Feedback = async({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();

  const interview = await getInterviewById(id);
  if (!interview) redirect("/interviews");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!
  }); 

  return (
    <section className="section-feedback">
      <div className="flex flex-row justify-center">
        <h1 className="text-4xl font-semibold">
        Feedback on the Interview -{" "}
        <span className="capitalize">{interview.role}</span> Interview
        </h1>
      </div>

      <div className="flex flex-row justify-center">
        <div className="flex flex-row gap-5">
          <div className="flex flex-row gap-2 items-center">
          <Image src="/images/star.svg" width={22} height={22} alt="star" />
            <p>
              Overall Impression:{" "}
              <span className="text-primary-200 font-bold">
                {feedback?.totalScore}
              </span>
              /100
            </p>
          </div>

          <div className="flex flex-row gap-2">
          <Image src="/images/calendar.svg" width={22} height={22} alt="calendar" />
            <p>
              {feedback?.createdAt
                ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      <hr />
      <p>{feedback?.finalAssessment}</p>

      <div className="flex flex-col gap-4">
        <h2>Breakdown of the interview:</h2>
        {feedback?.categoryScores?.map((category, index) => (
          <div key={index}>
            <p className="font-bold">
              {index + 1}. {category.name} ({category.score}/100)
            </p>
            <p>{category.comment}</p>   
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
<h3>Strengths</h3>
        <ul>
          {feedback?.strengths?.map((strength, index) => (
            <li key={index}>{strength}</li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-3">
        <h3>Areas for Improvement</h3>
        <ul>
          {feedback?.areasForImprovement?.map((improvement, index) => (
            <li key={index}>{improvement}</li>
          ))}
        </ul>
      </div>

      <div className="buttons">
        <Button className="btn-secondary flex-1">
          <Link href="/" className="flex w-full justify-center"> 
            <p className="text-sm font-semibold text-primary-200 text-center">Back to Dashboard</p>
          </Link>
        </Button>

        <RetakeButton interviewId={id} userId={user?.id!} />
      </div>
    </section>
  )
}

export default Feedback