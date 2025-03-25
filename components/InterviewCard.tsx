import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { cn, getRandomInterviewCover } from "@/lib/utils";
import DisplayTechIcons from "./DisplayTechIcons";
import { getFeedbackByInterviewId } from "@/lib/actions/interview.action";


const InterviewCard = async({
  role,
  type,
  techstack,
  createdAt,
  id,
  userId
}: InterviewCardProps) => {

    const feedback = userId && id ? 
    await getFeedbackByInterviewId({
      interviewId: id,
      userId
    }) : null;

    const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

    const badgeColor =
    {
      Behavioral: "bg-light-400",
      Mixed: "bg-light-600",
      Technical: "bg-light-800",
    }[normalizedType] || "bg-light-600";

    const formattedDate = dayjs(
        feedback?.createdAt || createdAt || Date.now()
      ).format("MMM D, YYYY");

  return (
    <div className="card-border w-[360px] max-sm:w-full min-h-96">
        <div className="card-interview">
            <div>
            <div
                  className={cn(
                    "absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg",
                    badgeColor
                  )}
            >
                <p className="badge-text">{normalizedType}</p>
            </div>

            <Image 
            src={getRandomInterviewCover()}
            alt="Interview Cover"
            width={90}
            height={90}
            className="rounded-full object-fit size-[90px]"
            />

            <h3 className="capitalize mt-5">{role} interview</h3>

            <div className="flex flex-row gap-5 mt-3">
                <div className="flex flex-row gap-2">
                    <Image 
                        src="/images/calendar.svg" 
                        alt="calendar" 
                        width={22} 
                        height={22} 
                    />
                    <p>{formattedDate}</p>
                </div>

                <div className="flex flex-row gap-2 items-center">
                    <Image 
                        src="/images/star.svg" 
                        alt="star" 
                        width={22} 
                        height={22} 
                    />
                    <p>{feedback?.totalScore || "---"}/100</p>
                </div>
            </div>

            <p className="line-clamp-2 mt-5">
            {feedback?.finalAssessment ||
              "You haven't taken this interview yet. Take it now to improve your skills."}
            </p>
        </div>

        <div className="flex flex-row justify-between">
            <DisplayTechIcons techStack={techstack} />
            <Button className="btn-primary">
              <Link
                 href={
                    feedback 
                    ?  `/interview/${id}/feedback`
                    : `/interview/${id}`
                 }
              >
              {feedback ? "Check Feedback" : "View Interview"}
              </Link>
            </Button>
            </div>
        </div>
    </div>
  )
}

export default InterviewCard