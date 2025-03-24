"use client"

import { useState, useEffect } from "react";
import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

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
    type
}: AgentProps) => {
    const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);

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
           key={lastMessage}
           className={cn(
             "transition-opacity duration-500 opacity-0",
             "animate-fadeIn opacity-100"
           )}
        >{lastMessage}</p>
        </div>
      </div>
    )}

    <div className="w-full flex justify-center">
        {callStatus !== "ACTIVE" ? (
            <button className="relative btn-call">
                <span
                   className={cn(
                    "absolute animate-ping rounded-full opacity-75",
                    callStatus !== "CONNECTING" && "hidden"
                  )}
                />

                <span className="relative">
                  {callStatus === "INACTIVE" || callStatus === "FINISHED" 
                  ? "Call" 
                  : ". . ."}
                </span>
            </button>
        ) : (
            <button className="btn-disconnect">
                End
            </button>
        )}
    </div>
    </>
  )
}

export default Agents