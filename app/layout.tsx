import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ClerkProvider } from '@clerk/nextjs'

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  display: 'swap',
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Vishal Computer Institute | Premium Tech Education",
  description: "Advanced courses in computer science, engineering, and digital arts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
        <body className="antialiased min-h-screen flex flex-col font-body bg-black">
          <Navbar/>
          <main className="flex-grow pt-24">
            {children}
          </main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}

