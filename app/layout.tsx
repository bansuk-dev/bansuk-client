import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://bansuk.vercel.app"),
  title: "반석 - 소중한 순간을 기록하는 공간",
  description: "일상의 소중한 순간들을 기록하고 공유하는 공간입니다.",
  openGraph: {
    title: "반석 - 소중한 순간을 기록하는 공간",
    description: "일상의 소중한 순간들을 기록하고 공유하는 공간입니다.",
    images: [
      {
        url: "/bansuk.jpg",
        alt: "반석",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "반석 - 소중한 순간을 기록하는 공간",
    description: "일상의 소중한 순간들을 기록하고 공유하는 공간입니다.",
    images: ["/bansuk.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
