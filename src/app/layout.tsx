import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Noto_Sans_Arabic, Cairo, Tajawal, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";

// خط Inter للغة الإنجليزية - خط احترافي وواضح
const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

// خط JetBrains Mono للكود والأرقام - خط تقني
const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: '--font-jetbrains',
  display: 'swap',
});

// خط Noto Sans Arabic للعربية - خط احترافي من Google
const notoSansArabic = Noto_Sans_Arabic({ 
  subsets: ["arabic"],
  variable: '--font-noto-arabic',
  display: 'swap',
});

// خط Cairo للعربية - خط جميل وواضح
const cairo = Cairo({ 
  subsets: ["arabic", "latin"],
  variable: '--font-cairo',
  display: 'swap',
});

// خط Tajawal للعربية - خط احترافي ومقروء
const tajawal = Tajawal({ 
  subsets: ["arabic", "latin"],
  variable: '--font-tajawal',
  display: 'swap',
  weight: ['400', '700'],
});



// خط IBM Plex Sans Arabic - خط احترافي من IBM
const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({ 
  subsets: ["arabic", "latin"],
  variable: '--font-ibm-plex-sans-arabic',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

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
    <html>
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${notoSansArabic.variable} ${cairo.variable} ${tajawal.variable} ${ibmPlexSansArabic.variable} antialiased gradient-bg`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
