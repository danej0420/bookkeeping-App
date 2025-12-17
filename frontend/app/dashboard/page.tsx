"use client";

import { useEffect, useState } from "react";
import { fetchSummary } from "../../lib/api";
import { useRouter } from "next/navigation";

type Summary = { income: number; expenses: number; net: number };

export default function DashboardPage() {
  const router = useRouter();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetchSummary(token)
      .then(setSummary)
      .catch((err) => setError((err as Error).message));
  }, [router]);

  return (
    <main>
      <div className="card">
        <h1>Dashboard</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!summary && !error && <p>Loading totals...</p>}
        {summary && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            <div className="card">
              <h3>Income</h3>
              <p>${summary.income.toFixed(2)}</p>
            </div>
            <div className="card">
              <h3>Expenses</h3>
              <p>${summary.expenses.toFixed(2)}</p>
            </div>
            <div className="card">
              <h3>Net</h3>
              <p>${summary.net.toFixed(2)}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
