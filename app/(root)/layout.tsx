import Link from "next/link";
import { ReactNode } from "react";
import Image from "next/image";
import { redirect } from "next/navigation"; 
import { isAuthenticated } from "@/lib/actions/auth.action";


export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
    //check if user is authenticated
    const isUserAuthenticated = await isAuthenticated();
    if(!isUserAuthenticated) redirect("/sign-in");
  return (
    <div className="root-layout">
        <nav>
            <Link href="/" className=" flex items-center gap-2">
            <Image src="/images/logo.webp" alt="Logo" width={38} height={38} />
            <h2 className="text-primary-100">Fanikiwa</h2>
            </Link>
        </nav>
      {children}
    </div>
  );
}