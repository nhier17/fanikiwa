/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

// Session duration (1 week)
const SESSION_DURATION = 60 * 60 * 24 * 7;

export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies();
    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: SESSION_DURATION * 1000
    });

 cookieStore.set("session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_DURATION
    });
  };

export async function signUp(params: SignUpParams) {
    const { uid, name, email } = params;

    try {
      //check if user exists in db
      const userRecord = await db.collection("users").doc(uid).get();
      if (userRecord.exists) {
        return { success: false, message: "User already exists. Please login" };
      }
      //create user in db
      await db.collection("users").doc(uid).set({
        name,
        email,
      });

      return { success: true, message: "Account created successfully" };
    } catch (error: any) {
        console.log("Error creating account:", error);

        //handle firebase specific errors
        if (error.code === "auth/email-already-exists") {
            return { success: false, message: "Email already exists" };
        }
        return { success: false, message: "Failed to create account. Please try again" };
    }
};

export async function signIn(params: SignInParams) {
    const { email, idToken } = params;

    try {
      //check if user exists in db
      const userRecord = await auth.getUserByEmail(email);
      if (!userRecord) {
        return { success: false, message: "User does not exist. Please sign up" };
      }
      
      await setSessionCookie(idToken);

      return { success: true, message: "Account created successfully" };
    } catch (error: any) {
        console.log("Error creating account:", error);

        return { success: false, message: "Failed to login. Please try again" };
    }
};

//get current user
export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
      return null;
    }

    try {
      const decodedToken = await auth.verifySessionCookie(sessionCookie,true);

      const user = await db.collection("users").doc(decodedToken.uid).get();
      if (!user.exists) {
        return null;
      }
      return {
        ...user.data(),
        id: user.id
      } as User;
    } catch (error) {
      console.log("Error getting current user:", error);
      return null;
    }
  }

//is user authenticated
export async function isAuthenticated() {
    const user = await getCurrentUser();
    return !!user;
}

export async function signOut() {
    const cookieStore = await cookies();
    cookieStore.delete("session");
  }
