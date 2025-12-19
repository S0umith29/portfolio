import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sowmith Kuppa | AI/ML Engineer",
  description: "AI/ML Engineer | MLOps Specialist | CKA Certified",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
