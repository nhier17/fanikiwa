import Agents from "@/components/Agents";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Interview = async () => {
    const user = await getCurrentUser();
  return (
    <div>
        <h3>Interview Generator</h3>
      <Agents 
      userName={user?.name!}
      userId={user?.id}
      profileImage={user?.profileURL}
      type="generate"
      />
    </div>
  )
}

export default Interview