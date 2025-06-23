import { OrderRow } from "./OrderRow";

export default function OrderTable({ orders }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="border-b bg-gray-100">
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Order</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Customer</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Amount</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <OrderRow key={order._id} order={order} />
          ))}
        </tbody>
      </table>
    </div>
  );
}