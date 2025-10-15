import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./ClientLayout";

export const metadata: Metadata = {
  title: "Cyber Hub - Cyber Security Portal | Salam Company",
  description: "Central portal for Salam Cyber Security Department - Project management, policies, and internal communication.",
  keywords: "cyber security, Salam, Cyber Hub, information security, portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body className={`antialiased gradient-bg`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
