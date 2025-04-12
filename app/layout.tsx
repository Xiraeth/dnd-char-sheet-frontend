import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import { ThemeProvider } from "./ThemeContext";
import "./globals.css";
import { Toaster } from "sonner";
import { UserProvider } from "./UserProvider";
import { ApolloProvider } from "@/lib/apollo/ApolloProvider";
import Script from "next/script";
import localFont from "next/font/local";

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

const bookinsanity = localFont({
  src: [
    {
      path: "../public/fonts/fantasyFonts/BookinsanityRemakeRegular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/fantasyFonts/BookinsanityRemakeBold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/fantasyFonts/BookinsanityRemakeItalic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/fantasyFonts/BookinsanityRemakeSmbldItlc.otf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-bookinsanity",
});

const scalySans = localFont({
  src: [
    {
      path: "../public/fonts/fantasyFonts/Scaly Sans.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-scaly-sans",
});

const mrEaves = localFont({
  src: "../public/fonts/fantasyFonts/Mr Eaves Small Caps.otf",
  variable: "--font-mr-eaves",
});

export const metadata: Metadata = {
  title: "D&D Character Sheet",
  description: "Create and manage your D&D characters",
  icons: {
    icon: "./favicon.ico",
  },
};

// create multiple fonts
// const roboto = localFont({
//   src: [
//     {
//       path: './Roboto-Regular.woff2',
//       weight: '400',
//       style: 'normal',
//     },
//     {
//       path: './Roboto-Italic.woff2',
//       weight: '400',
//       style: 'italic',
//     },
//     {
//       path: './Roboto-Bold.woff2',
//       weight: '700',
//       style: 'normal',
//     },
//     {
//       path: './Roboto-BoldItalic.woff2',
//       weight: '700',
//       style: 'italic',
//     },
//   ],
// })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="light">
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
        className={`bg-bgTextureDarkened bg-fixed bg-cover bg-center ${geistSans.variable} ${geistMono.variable} ${montserrat.variable} ${bookinsanity.variable} ${scalySans.variable} ${mrEaves.variable} min-h-screen`}
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
