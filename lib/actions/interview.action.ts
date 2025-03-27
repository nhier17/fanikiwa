"use server";

import { generateObject } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { feedbackSchema } from "@/constants";

//get interview by user id
export async function getInterviewByUserId(userId:string): Promise<Interview[] | null>{
    const interviews = await db
    .collection("interviews")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .get();

    return interviews.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as Interview[];
};

//get latest interviews
export async function getLatestInterviews(params: GetLatestInterviewsParams): Promise<Interview[] | null>{
    const { userId, limit = 20 } = params;

    const interviews = await db
    .collection("interviews")
    .orderBy("createdAt", "desc")
    .where("finalized", "==", true)
    .where("userId", "!=", userId)
    .limit(limit)
    .get();

    return interviews.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as Interview[];
};

//get interview by id
export async function getInterviewById(id: string): Promise<Interview | null> {
    const interview = await db
        .collection("interviews")
        .doc(id)
        .get();

    return interview.data() as Interview | null;
};

//create feedback 
export async function createFeedback(params: CreateFeedbackParams) {
    const { interviewId, userId, transcript, feedbackId } = params;

        try {
            const formattedTranscript = transcript
                .map(
                    (sentence: { role: string; content: string }) =>
                        `- ${sentence.role}: ${sentence.content}\n`
                )
                .join("");

      const { object:{ totalScore, categoryScores, strengths, areasForImprovement, finalAssessment } } = await generateObject({
                    model: google("gemini-2.0-flash-001", {
                        structuredOutputs: false,
                    }),
                    schema: feedbackSchema,
                    prompt: `
                        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
                        Transcript:
          ${formattedTranscript}

                        Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
                        - **Communication Skills**: Clarity, articulation, structured responses.
                        - **Technical Knowledge**: Understanding of key concepts for the role.
                        - **Problem-Solving**: Ability to analyze problems and propose solutions.
                        - **Cultural & Role Fit**: Alignment with company values and job role.
                        - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
                    `,
        system:
          "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
                });

            const feedback = await db.collection("feedback").add({
                userId,
                interviewId,
        totalScore,
        categoryScores,
        strengths,
        areasForImprovement,
        finalAssessment,
                createdAt: new Date().toISOString(),
            });

            return {
                success: true,
                feedbackId: feedback.id
      }

        } catch (error) {
        console.error("Error creating feedback:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "An unknown error occurred"
        }
    }
};

export async function getFeedbackByInterviewId(params: GetFeedbackByInterviewIdParams): Promise<Feedback | null> {
const { interviewId, userId } = params;
const querySnapshot = await db
    .collection("feedback")
    .where("interviewId", "==", interviewId)
    .where("userId", "==", userId)
    .limit(1)
    .get();

    if (querySnapshot.empty) {
        return null;
    }

    const feebackDoc = querySnapshot.docs[0];
    return { id: feebackDoc.id, ...feebackDoc.data()} as Feedback;    
}

//retake interview
export async function retakeInterview(params: { interviewId: string; userId: string }): Promise<{ success: boolean; newInterviewId: string }> {
    try {
        const originalInterview = await getInterviewById(params.interviewId);
        
        if (!originalInterview) {
            throw new Error("Original interview not found");
        }

        // Create a new interview with the same parameters but reset the conversation
        const newInterview = await db.collection("interviews").add({
            ...originalInterview,
            userId: params.userId,
            createdAt: new Date().toISOString(),
            finalized: false,
            conversation: [], // Reset conversation
        });

        return {
            success: true,
            newInterviewId: newInterview.id
        };
    } catch (error) {
        console.error("Error retaking interview:", error);
        throw error;
    }
}