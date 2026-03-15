import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Noodle Vault — Chef Fatty Kitchen",
  description: "20 exclusive noodle recipes with guided video walkthroughs. Your kitchen, your pace.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-cream min-h-screen">
        {children}
      </body>
    </html>
  );
}
