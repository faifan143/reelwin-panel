import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "لوحة إدارة ReelWin",
  description: "تطبيق إدارة محتوى ReelWin",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
