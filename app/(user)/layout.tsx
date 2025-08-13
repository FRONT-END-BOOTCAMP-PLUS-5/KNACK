import type { Metadata } from "next";
import "@/styles/global.scss";
import LayoutWrapper from "@/app/(user)/LayoutWrapper";
import SessionProvider from '@/components/providers/SessionProvider';

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
        <SessionProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </SessionProvider>
      </body>
    </html>
  );
}
