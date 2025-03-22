import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import "./globals.css";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fanikiwa",
  description: "Your very own AI-powered interview prep assistant",
  icons: {
    icon: "/images/logo.webp",
  },  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        suppressHydrationWarning={true}
        className={`${monaSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
