import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import { ThemeProvider } from "./ThemeContext";
import "./globals.css";
import { Toaster } from "sonner";
import { UserProvider } from "./UserProvider";
import { ApolloProvider } from "@/lib/apollo/ApolloProvider";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "D&D Character Sheet",
  description: "Create and manage your D&D characters",
  icons: {
    icon: "./favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="auth-status" content="loading" />
        <Script id="auth-status-script" strategy="beforeInteractive">
          {`
            // This script runs before the page loads
            // It reads the custom header from the server and sets a meta tag
            const authStatus = document.querySelector('meta[name="auth-status"]');
            if (authStatus) {
              // Get the auth status from the custom header
              const xhr = new XMLHttpRequest();
              xhr.open('GET', window.location.href, false); // Synchronous request
              xhr.send(null);
              
              const serverAuthStatus = xhr.getResponseHeader('x-auth-status');
              if (serverAuthStatus) {
                authStatus.setAttribute('content', serverAuthStatus);
              }
            }
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} min-h-screen bg-background-dark`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <ApolloProvider>
            <UserProvider>{children}</UserProvider>
          </ApolloProvider>
        </ThemeProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
