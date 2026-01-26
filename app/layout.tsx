import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import { ThemeProvider } from "./ThemeContext";
import "./globals.css";
import { Toaster } from "sonner";
import { UserProvider } from "./UserProvider";
import { ApolloProvider } from "@/lib/apollo/ApolloProvider";
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
      <head></head>
      <body
        className={`mt-0 bg-bgTextureDarkened bg-fixed bg-cover bg-center ${geistSans.variable} ${geistMono.variable} ${montserrat.variable} ${bookinsanity.variable} ${scalySans.variable} ${mrEaves.variable} min-h-screen`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <ApolloProvider>
            <UserProvider>{children}</UserProvider>
          </ApolloProvider>
        </ThemeProvider>
        <Toaster position="top-center" visibleToasts={2}  toastOptions={{unstyled: true, className: 'flex items-center justify-start gap-4 min-w-[300px] py-2 px-4 rounded-lg shadow-md min-h-[50px]', classNames: {
          success: "bg-green-500 text-white",
          error: "bg-red-500 text-white",
          warning: "bg-amber-500 text-white",
          info: "bg-sky-500 text-white",
        }}}/>
      </body>
    </html>
  );
}
