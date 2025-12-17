import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { api } from '../lib/api';

interface SummaryResponse {
  income: number;
  expense: number;
  net: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await api.getSummary();
        setSummary(data);
      } catch (err: any) {
        setError('Please login to view your dashboard.');
        console.error(err);
        if (err.message?.includes('401')) {
          router.push('/login');
        }
      }
    };

    fetchSummary();
  }, [router]);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Quick snapshot of your income and expenses.</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {summary ? (
        <div>
          <p><strong>Total income:</strong> ${summary.income.toFixed(2)}</p>
          <p><strong>Total expenses:</strong> ${summary.expense.toFixed(2)}</p>
          <p><strong>Net:</strong> ${summary.net.toFixed(2)}</p>
        </div>
      ) : (
        <p>Loading totals...</p>
      )}
    </div>
  );
}
