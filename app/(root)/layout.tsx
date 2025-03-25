import Link from "next/link";
import { ReactNode } from "react";
import Image from "next/image";
import { redirect } from "next/navigation"; 
import { isAuthenticated,signOut } from "@/lib/actions/auth.action";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";


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
        <nav className="flex items-center justify-between"  >
            <Link href="/" className=" flex items-center gap-2">
            <Image src="/images/logo.webp" alt="Logo" width={38} height={38} />
            <h2 className="text-primary-100">Fanikiwa</h2>
            </Link>
            {/* logout*/}
            <button onClick={signOut}>
                <LogOut className="text-primary-100 w-6 h-6" />
            </button>
        </nav>
      {children}
    </div>
  );
}