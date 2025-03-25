"use client";

import { useState, useEffect } from "react";
import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { interviewer } from "@/constants";
import { useRouter } from "next/navigation";
import { vapi } from "@/lib/vapi.sdk";

enum CallStatus {
    INACTIVE = "INACTIVE",
    CONNECTING = "CONNECTING",
    ACTIVE = "ACTIVE",
    FINISHED = "FINISHED",
  }

interface SavedMessage {
    role: "user" | "system" | "assistant";
    content: string;
  }

const Agents = ({
    userName,
    userId,
    type,
    interviewId,
    questions
}: AgentProps) => {
  const router = useRouter();
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);

  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

    const onMessage = (message: Message) => {
      if(message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = {
          role: message.role,
          content: message.transcript
        };
        setMessages((prev) => [...prev, newMessage])
      }
    };

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);

    const onError = (error: Error) => {
      console.error("Error in call:", error);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  },[]);

  useEffect(() => {
    //if(messages.length > 0) {
    //  setLastMessage(messages[messages.length - 1].content);
    //}
    const handleGenerateFeedbaack = async (messages: SavedMessage[]) => {
      
    };
    
    if(callStatus === CallStatus.FINISHED){
      if(type === "generate") {
        router.push("/")
      } else {
        handleGenerateFeedbaack(messages);
      }
    }
  },[messages, callStatus, type, userId]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    if (type === "generate") {
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
        variableValues: {
          username: userName,
          userid: userId,
        },
      });
    } else {
      let formattedQuestions = "";
      if (questions) {
        formattedQuestions = questions
          .map((question) => `- ${question}`)
          .join("\n");
      };

      await vapi.start(interviewer, {
        variableValues: {
          questions: formattedQuestions,
        },
      });
    } 
  }

  const handleDisconnect = async () => {
    setCallStatus(CallStatus.FINISHED);

    vapi.stop();
  }

  const latestMessage = messages[messages.length - 1]?.content;
  const isCallInactiveOrFinished = callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;

  return (
    <>
    <div className="call-view">
      <div className="card-interviewer">
        <div className="avatar">
          <Image 
            src="/images/ai-avatar.png"
            alt="Avatar"
            width={65}
            height={54}
            className="object-cover"
          />
        {isSpeaking && <span className="animate-speak" />}
        </div>
        <h3>AI Interviewer</h3>
      </div>

      <div className="card-border">
        <div className="card-content">
          <Image 
            src="/images/user-avatar.png"
            alt="Avatar"
            width={540}
            height={540}
            className="object-cover rounded-full size-[120px]"
          />
          <h3>{userName}</h3>
        </div>
      </div>
    </div>

    {messages.length > 0 && (
      <div className="transcript-border">
        <div className="transcript">
        <p
           key={latestMessage}
           className={cn(
             "transition-opacity duration-500 opacity-0",
             "animate-fadeIn opacity-100"
           )}
        >{latestMessage}</p>
        </div>
      </div>
    )}

    <div className="w-full flex justify-center">
        {callStatus !== "ACTIVE" ? (
            <button className="relative btn-call" onClick={handleCall}>
                <span
                   className={cn(
                    "absolute animate-ping rounded-full opacity-75",
                    callStatus !== "CONNECTING" && "hidden"
                  )}
                />

                <span className="relative">
                  {isCallInactiveOrFinished
                  ? "Call" 
                  : ". . ."}
                </span>
            </button>
        ) : (
            <button className="btn-disconnect" onClick={handleDisconnect}>
                End
            </button>
        )}
    </div>
    </>
  )
}

export default Agents