import { useState, useEffect } from 'react';
import { Eye, X } from 'lucide-react';
import FadeUp from '../../components/ui/FadeUp';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { formatPrice, formatDate } from '../../utils/format';
import api from '../../utils/api';

const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [estimatedDelivery, setEstimatedDelivery] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  const fetchOrders = () => {
    api.get('/orders').then(({ data }) => setOrders(data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const openOrder = (order) => {
    setSelected(order);
    setTrackingNumber(order.trackingNumber || '');
    setEstimatedDelivery(order.estimatedDelivery ? order.estimatedDelivery.slice(0, 10) : '');
    setAdminNotes(order.adminNotes || '');
  };

  const updateStatus = async (orderId, status) => {
    await api.put(`/orders/${orderId}/status`, { status });
    fetchOrders();
    if (selected) setSelected({ ...selected, orderStatus: status });
  };

  const saveTrackingDetails = async () => {
    if (!selected) return;
    const { data } = await api.put(`/orders/${selected._id}/status`, {
      trackingNumber,
      estimatedDelivery: estimatedDelivery || null,
      adminNotes,
    });
    setSelected(data);
    fetchOrders();
  };

  const statusColor = {
    pending: 'bg-yellow-50 text-yellow-600',
    processing: 'bg-blue-50 text-blue-600',
    shipped: 'bg-purple-50 text-purple-600',
    delivered: 'bg-green-50 text-green-600',
    cancelled: 'bg-red-50 text-red-600',
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-text mb-8">Orders</h1>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <FadeUp>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-soft-text">
                    <th className="p-4 font-medium">Order ID</th>
                    <th className="p-4 font-medium">Customer</th>
                    <th className="p-4 font-medium">Total</th>
                    <th className="p-4 font-medium">Payment</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Date</th>
                    <th className="p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b border-gray-50 hover:bg-mint-strong/20">
                      <td className="p-4 font-medium text-teal">{order.orderId}</td>
                      <td className="p-4">{order.customerName}</td>
                      <td className="p-4">{formatPrice(order.totalAmount)}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          order.paymentStatus === 'paid' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs capitalize ${statusColor[order.orderStatus]}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="p-4 text-soft-text">{formatDate(order.createdAt)}</td>
                      <td className="p-4">
                        <button onClick={() => openOrder(order)} className="p-1.5 text-soft-text hover:text-teal">
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </FadeUp>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Order {selected.orderId}</h2>
              <button onClick={() => setSelected(null)} className="text-soft-text hover:text-text">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-soft-text">Customer</p>
                <p className="font-medium">{selected.customerName}</p>
                <p className="text-soft-text">{selected.email} • {selected.phone}</p>
              </div>
              <div>
                <p className="text-soft-text">Address</p>
                <p>{selected.address}, {selected.city}, {selected.state} - {selected.pincode}</p>
              </div>
              <div>
                <p className="text-soft-text mb-2">Items</p>
                {selected.items?.map((item, i) => (
                  <div key={i} className="flex justify-between py-1">
                    <span>{item.name} × {item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-semibold pt-2 border-t border-gray-100 mt-2">
                  <span>Total</span>
                  <span>{formatPrice(selected.totalAmount)}</span>
                </div>
              </div>
              <div>
                <p className="text-soft-text">Razorpay Payment ID</p>
                <p className="font-mono text-xs">{selected.razorpayPaymentId || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-soft-text mb-1">Update Status</label>
                <select
                  value={selected.orderStatus}
                  onChange={(e) => updateStatus(selected._id, e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-teal capitalize"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <Input
                label="Tracking Number"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
              <Input
                label="Estimated Delivery"
                type="date"
                value={estimatedDelivery}
                onChange={(e) => setEstimatedDelivery(e.target.value)}
              />
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">Admin Notes</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-teal"
                />
              </div>
              <Button type="button" onClick={saveTrackingDetails} className="w-full">
                Save Tracking Details
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
