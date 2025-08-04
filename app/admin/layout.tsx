import type { Metadata } from "next";
import "@/app/styles/global.scss";
import Header from "@/app/components/common/header/Header";
import Footer from "@/app/components/common/footer/Footer";

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
                {children}
            </body>
        </html>
    );
}
