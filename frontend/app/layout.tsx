import "./globals.css";
import Link from "next/link";
import { ReactNode } from "react";

export const metadata = {
  title: "Stylist Bookkeeping",
  description: "Track income and expenses for independent stylists"
};

type Props = { children: ReactNode };

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body>
        <div className="main-shell">
          <header style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
            <Link href="/">Home</Link>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/transactions">Transactions</Link>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
