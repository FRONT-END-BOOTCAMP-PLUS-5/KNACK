import type { Metadata } from "next";
import "./global.scss";
import Header from "./components/common/header/Header";

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
        <Header />
        {children}
      </body>
    </html>
  );
}
