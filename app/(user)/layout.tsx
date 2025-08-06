import type { Metadata } from "next";
import "@/styles/global.scss";
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
      <body suppressHydrationWarning={true}>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
