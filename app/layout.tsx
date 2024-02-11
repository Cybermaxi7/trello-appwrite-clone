import type { Metadata } from "next";

import Modal from "@/components/Modal";
import "./globals.css";

export const metadata: Metadata = {
    title: "Cybermaxi Trello Clone 2.0",
    description: "Generated by Moses Agbe",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="bg-[#f5f6f8">
                {children} <Modal />
            </body>
        </html>
    );
}
