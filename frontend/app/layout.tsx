import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
import { AuthProvider } from "@/components/Providers/AuthProvider";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ModalProvider } from "@/components/Providers/ModalProvider";
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
  title: "StaySync",
  description: "One smart platform to manage hostel living digitally. Connect with top hostels, manage bookings, and resolve issues in real-time.",
    icons: {
    icon: "/icon.png",
  },

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactQueryProvider>
          <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "PROVIDE_VALID_CLIENT_ID"}>
            <AuthProvider>
              <ModalProvider>
                <Navbar/>
                {children}
              </ModalProvider>
            </AuthProvider>
          </GoogleOAuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
