import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: true,
};

export const metadata: Metadata = {
  title: "NutriAcademic",
  description: "MicroSaaS de Nutrição de alta performance with PIX subscriptions.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=yes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${plusJakartaSans.variable} antialiased selection:bg-emerald-200 selection:text-emerald-900 bg-[#FAFAFA]`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
