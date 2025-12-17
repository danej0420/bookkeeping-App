"use client";

import { useEffect, useState } from "react";
import {
  createAccount,
  createTransaction,
  fetchAccounts,
  fetchTransactions
} from "../../lib/api";
import { useRouter } from "next/navigation";

type Account = { id: number; name: string; provider: string };
type Transaction = {
  id: number;
  date: string;
  description: string;
  amount: number;
  categoryId?: number;
  category?: { name: string } | null;
};

export default function TransactionsPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [newAccount, setNewAccount] = useState({ name: "", provider: "" });
  const [newTxn, setNewTxn] = useState({ accountId: "", date: "", description: "", amount: "" });

  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (!stored) {
      router.push("/login");
      return;
    }
    setToken(stored);
    loadData(stored);
  }, [router]);

  async function loadData(authToken: string) {
    try {
      const [acctData, txnData] = await Promise.all([
        fetchAccounts(authToken),
        fetchTransactions(authToken)
      ]);
      setAccounts(acctData);
      setTransactions(txnData);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function handleAddAccount(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    try {
      await createAccount(token, { name: newAccount.name, provider: newAccount.provider });
      setNewAccount({ name: "", provider: "" });
      await loadData(token);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function handleAddTransaction(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    try {
      await createTransaction(token, {
        accountId: Number(newTxn.accountId),
        date: newTxn.date,
        description: newTxn.description,
        amount: Number(newTxn.amount)
      });
      setNewTxn({ accountId: "", date: "", description: "", amount: "" });
      await loadData(token);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <main>
      <div className="card">
        <h1>Transactions</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <section className="card">
          <h3>Add account</h3>
          <form onSubmit={handleAddAccount}>
            <input
              value={newAccount.name}
              onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
              placeholder="Account name"
              required
            />
            <input
              value={newAccount.provider}
              onChange={(e) => setNewAccount({ ...newAccount, provider: e.target.value })}
              placeholder="Provider"
              required
            />
            <button type="submit">Save account</button>
          </form>
        </section>

        <section className="card">
          <h3>Add transaction</h3>
          <form onSubmit={handleAddTransaction}>
            <select
              value={newTxn.accountId}
              onChange={(e) => setNewTxn({ ...newTxn, accountId: e.target.value })}
              required
            >
              <option value="">Select account</option>
              {accounts.map((acct) => (
                <option key={acct.id} value={acct.id}>
                  {acct.name} ({acct.provider})
                </option>
              ))}
            </select>
            <input type="date" value={newTxn.date} onChange={(e) => setNewTxn({ ...newTxn, date: e.target.value })} required />
            <input
              value={newTxn.description}
              onChange={(e) => setNewTxn({ ...newTxn, description: e.target.value })}
              placeholder="Description"
              required
            />
            <input
              type="number"
              step="0.01"
              value={newTxn.amount}
              onChange={(e) => setNewTxn({ ...newTxn, amount: e.target.value })}
              placeholder="Amount (positive for income, negative for expenses)"
              required
            />
            <button type="submit">Save transaction</button>
          </form>
        </section>

        <section className="card">
          <h3>Recent transactions</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn.id}>
                  <td>{new Date(txn.date).toLocaleDateString()}</td>
                  <td>{txn.description}</td>
                  <td>${txn.amount.toFixed(2)}</td>
                  <td>{txn.category?.name || "Uncategorized"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </main>
  );
}
