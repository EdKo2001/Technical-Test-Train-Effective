import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Technical Test: Train Effective",
  description: "Technical Test: Train Effective",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
