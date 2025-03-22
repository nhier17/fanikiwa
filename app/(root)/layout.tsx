import Link from "next/link";
import { ReactNode } from "react";
import Image from "next/image";


export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="root-layout">
        <nav>
            <Link href="/" className=" flex items-center gap-2">
            <Image src="/images/logo.webp" alt="Logo" width={138} height={38} />
            <h2 className="text-primary-100">Fanikiwa</h2>
            </Link>
        </nav>
      {children}
    </div>
  );
}