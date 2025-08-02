import type { Metadata } from "next";
import "@/app/styles/global.scss";
import LayoutWrapper from "@/app/(user)/LayoutWrapper";

export const metadata: Metadata = {
  title: "KNACK",
  description: "KNACK",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
