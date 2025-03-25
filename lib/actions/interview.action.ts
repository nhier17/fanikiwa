"use server";

import { generateObject } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";

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
