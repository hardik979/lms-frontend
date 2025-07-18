import type { Metadata } from "next";
import { Montserrat, Righteous, Roboto } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";
const montserrat = Montserrat({ subsets: ["latin"] });

const righteous = Righteous({
  variable: "--font-righteous",
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});
const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});
export const metadata: Metadata = {
  title: "IT Job Factory",
  description: "IT job Factory learning management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${roboto.className} ${righteous.variable}`}>
          {children}
          <Analytics />
          <ToastContainer />
        </body>
      </html>
    </ClerkProvider>
  );
}
