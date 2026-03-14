import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "Chef Fatty",
  description: "Asian-inspired recipes for home cooks.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-cream min-h-screen">
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  );
}
