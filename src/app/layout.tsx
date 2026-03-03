import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700", "800"],
});

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
      <body className={`${montserrat.variable} antialiased selection:bg-emerald-200 selection:text-emerald-900 bg-[#F4F6F8]`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
