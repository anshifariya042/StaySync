import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/Providers/AuthProvider";
import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from "@/components/Navbar/Navbar";
import ReactQueryProvider from "@/components/Providers/ReactQueryProvider";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StaySync | The Future of Hostel Living",
  description: "One smart platform to manage hostel living digitally. Connect with top hostels, manage bookings, and resolve issues in real-time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactQueryProvider>
          <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "PROVIDE_VALID_CLIENT_ID"}>
            <AuthProvider>
              <Navbar/>
              {children}
            </AuthProvider>
          </GoogleOAuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
