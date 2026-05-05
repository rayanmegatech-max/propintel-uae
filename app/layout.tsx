import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PropIntel GCC — Real Estate Intelligence for UAE & KSA",
  description:
    "AI-powered GCC real estate intelligence for UAE and KSA. Track public listing activity, owner/direct signals, price movements, listing truth, market pressure, dominance, agency profiles, and activity feeds.",
  keywords: [
    "GCC real estate intelligence",
    "UAE real estate intelligence",
    "KSA real estate intelligence",
    "PropTech SaaS",
    "real estate market intelligence",
    "property listing intelligence",
    "owner direct radar",
    "price drop radar",
    "market dominance",
    "inventory pressure",
    "agency inventory profile",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 font-sans text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}