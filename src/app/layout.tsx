import type { Metadata } from "next";
import { Krona_One } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import Session from "@/components/Session";

const kronaOne = Krona_One({
  weight: "400",
  variable: "--font-krona-one",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Productivity Dashboard",
  description:
    "A full-stack web application designed to streamline your daily workflow by centralizing frequently used apps into a single dashboard for easy access.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={kronaOne.className}>
        <Session>{children}</Session>
      </body>
    </html>
  );
}
