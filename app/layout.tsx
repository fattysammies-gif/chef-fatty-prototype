import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import TopNav from "@/components/TopNav";

export const metadata: Metadata = {
  title: "The Noodle Vault — Chef Fatty",
  description: "20 exclusive noodle recipes with guided video walkthroughs. Your kitchen, your pace.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-ivory min-h-screen">
        <TopNav />
        <main>{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
