import type { AppProps } from 'next/app';
import '../styles/globals.css';
import Link from 'next/link';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <div className="navbar">
        <nav>
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/transactions">Transactions</Link>
        </nav>
      </div>
      <main>
        <Component {...pageProps} />
      </main>
    </>
  );
}
