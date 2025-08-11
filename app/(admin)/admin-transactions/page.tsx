'use client';

import { useTransactionsQuery } from '@/lib/queries/transactions';
import clsx from 'clsx';

export default function AdminTransactionPage() {
  const { data: transactions, isLoading, isError } = useTransactionsQuery();

  if (isLoading) return <div className="p-6 text-neutral-600">Loading transactions...</div>;
  if (isError || !transactions) return <div className="p-6 text-red-600">Failed to load transactions.</div>;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-red-500 to-yellow-500">
          UBCMA Payment Dashboard
        </h1>
      </div>

      <div className="overflow-x-auto rounded-xl border border-neutral-300 shadow-lg animate-fade-in">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-rose-100 text-rose-700 uppercase tracking-wider text-xs border-b border-rose-200">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">User ID</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3">Currency</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Intent ID</th>
              <th className="px-4 py-3">Paid At</th>
            </tr>
          </thead>

          <tbody className="text-neutral-800">
            {transactions.map((tx: any, idx: number) => (
              <tr
                key={tx.paymentIntentId}
                className={clsx(
                  'transition-colors duration-200',
                  idx % 2 === 0 ? 'bg-white' : 'bg-pink-50'
                )}
              >
                <td className="px-4 py-3 font-medium">{tx.userName}</td>
                <td className="px-4 py-3">{tx.userId}</td>
                <td className="px-4 py-3 text-sm text-black-600">{tx.email}</td>
                <td className="px-4 py-3 text-right">
                  <span className="inline-block bg-green-100 text-green-700 font-semibold px-2 py-1 rounded-full">
                    ${(Number(tx.amount) / 100).toFixed(2)}
                  </span>
                </td>
                <td className="px-4 py-3 uppercase text-neutral-600">{tx.currency}</td>
                <td className="px-4 py-3">
                  <span
                    className={clsx(
                      'px-2 py-1 text-xs rounded-full font-semibold',
                      tx.purchaseType === 'membership'
                        ? 'bg-rose-200 text-rose-800'
                        : 'bg-yellow-200 text-yellow-800'
                    )}
                  >
                    {tx.purchaseType}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-neutral-500">{tx.paymentIntentId}</td>
                <td className="px-4 py-3 text-sm">{new Date(tx.paidAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
