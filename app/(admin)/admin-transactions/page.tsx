'use client';
import { useTransactionQuery } from '@/lib/queries/transactions';
import { useUserQuery } from '@/lib/queries/user';

export default function AdminTransactionPage() {
  const { data: transactions, isLoading, isError } = useTransactionQuery();

  if (isLoading) return <div>Loading transactions...</div>;
  if (isError || !transactions) return <div>Failed to load transactions.</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Admin: Stripe Transactions</h1>
      <table className="min-w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2 border">User ID</th>
            <th className="p-2 border">Amount</th>
            <th className="p-2 border">Currency</th>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Intent ID</th>
            <th className="p-2 border">Paid At</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx: any) => (
            <tr key={tx.paymentIntentId}>
              <td className="p-2 border">{tx.userId}</td>
              <td className="p-2 border">{(Number(tx.amount) / 100).toFixed(2)}</td>
              <td className="p-2 border">{tx.currency.toUpperCase()}</td>
              <td className="p-2 border">{tx.purchaseType}</td>
              <td className="p-2 border">{tx.paymentIntentId}</td>
              <td className="p-2 border">{new Date(tx.paidAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
