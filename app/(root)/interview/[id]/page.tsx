import { getRandomInterviewCover } from "@/lib/utils"
import Image from "next/image"
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewById } from "@/lib/actions/interview.action";  
import { redirect } from "next/navigation";
import DisplayTechIcons from "@/components/DisplayTechIcons";
import Agents from "@/components/Agents";


const InterviewDetails = async({ params}: RouteParams) => {
    const { id } = await params;
    const user = await getCurrentUser();
    const interview = await getInterviewById(id);

    if(!interview) redirect("/");

  return (
    <>
    <div className="flex flex-row gap-4 justify-between">
      <div className="flex flex-row gap-4 items-center max-sm:flex-col max-sm:gap-2">
        <div className="flex flex-row gap-4 items-center">
          <Image 
            src={getRandomInterviewCover()}
            alt="Interview"
            width={40}
            height={40}
            className="rounded-full object-cover size-[40px]"
          />
          <h3 className="capitalize">{interview.role} Interview</h3>
        </div>
        <DisplayTechIcons techStack={interview.techstack} />
      </div>

      <p className="bg-dark-200 px-4 py-2 rounded-lg h-fit">{interview.type}</p>
    </div>

    <Agents 
      userName={user?.name!}
      type="interview"  
      interviewId={id}
      userId={user?.id}
      questions={interview.questions}
    />
    </>
  )
}

export default InterviewDetails