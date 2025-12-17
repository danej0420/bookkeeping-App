import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { api } from '../lib/api';

interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  category?: { name: string } | null;
  account?: { name: string } | null;
}

interface Account {
  id: number;
  name: string;
  provider: string;
}

export default function TransactionsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [accountId, setAccountId] = useState('');
  const [accountName, setAccountName] = useState('');
  const [provider, setProvider] = useState('');
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      const [txs, accs] = await Promise.all([api.listTransactions(), api.listAccounts()]);
      setTransactions(txs);
      setAccounts(accs);
      if (accs.length > 0) {
        setAccountId(String(accs[0].id));
      }
    } catch (err: any) {
      setError('Please login to view transactions.');
      if (err.message?.includes('401')) {
        router.push('/login');
      }
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.createTransaction({ accountId, date, description, amount: Number(amount) });
      setDescription('');
      setAmount('');
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Could not create transaction');
    }
  };

  const handleAccountCreate = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.createAccount({ name: accountName, provider });
      setAccountName('');
      setProvider('');
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Could not create account');
    }
  };

  return (
    <div>
      <h1>Transactions</h1>
      <p>Log income and expenses manually until bank connections are added.</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h2>Add account</h2>
      <form onSubmit={handleAccountCreate}>
        <label>
          Account name
          <input value={accountName} onChange={(e) => setAccountName(e.target.value)} required />
        </label>
        <label>
          Provider
          <input value={provider} onChange={(e) => setProvider(e.target.value)} required />
        </label>
        <button type="submit">Save account</button>
      </form>

      <form onSubmit={handleSubmit}>
        <label>
          Description
          <input value={description} onChange={(e) => setDescription(e.target.value)} required />
        </label>
        <label>
          Amount
          <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" step="0.01" required />
        </label>
        <label>
          Date
          <input value={date} onChange={(e) => setDate(e.target.value)} type="date" required />
        </label>
        <label>
          Account
          <select value={accountId} onChange={(e) => setAccountId(e.target.value)} required>
            <option value="" disabled>
              Select account
            </option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name} ({acc.provider})
              </option>
            ))}
          </select>
        </label>
        <button type="submit">Add transaction</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Account</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td>{new Date(tx.date).toLocaleDateString()}</td>
              <td>{tx.description}</td>
              <td>${tx.amount.toFixed(2)}</td>
              <td>{tx.category?.name ?? 'Uncategorized'}</td>
              <td>{tx.account?.name ?? 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
