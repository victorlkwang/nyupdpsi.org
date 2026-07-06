import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "NYU Pi Delta Psi",
    template: "%s | NYU Pi Delta Psi",
  },
  description:
    "Pi Delta Psi Fraternity, Inc. – Zeta Chapter at New York University. The fastest growing Asian-American interest fraternity in the United States.",
  metadataBase: new URL("https://nyupdpsi.org"),
  openGraph: {
    title: "NYU Pi Delta Psi",
    siteName: "NYU PDPSI",
    url: "https://nyupdpsi.org",
    type: "website",
    images: ["/images/desktop/cross.webp"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-gray-100 text-gray-900 antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
