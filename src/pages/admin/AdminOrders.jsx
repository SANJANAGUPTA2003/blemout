import { useState, useEffect } from 'react';
import { Eye, X } from 'lucide-react';
import FadeUp from '../../components/ui/FadeUp';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { formatPrice, formatDate } from '../../utils/format';
import api from '../../utils/api';

const statusOptions = ['pending', 'processing'];
const statusLabels = {
  pending: 'placed',
  processing: 'confirmed',
  shipped: 'shipped',
  in_transit: 'in transit',
  out_for_delivery: 'out for delivery',
  delivered: 'delivered',
  cancelled: 'cancelled',
};

function isShippedLike(status) {
  return ['shipped', 'in_transit', 'out_for_delivery'].includes(status);
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [estimatedDelivery, setEstimatedDelivery] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [cancelOpen, setCancelOpen] = useState(false);
  const [shipOpen, setShipOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [shipping, setShipping] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState('');

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
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      fetchOrders();
      if (selected) setSelected({ ...selected, orderStatus: status });
    } catch (err) {
      setActionError(err.response?.data?.message || 'Unable to update order status.');
    }
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

  const canCancelSelected =
    selected &&
    ['pending', 'processing', 'shipped', 'in_transit', 'out_for_delivery'].includes(selected.orderStatus);

  const canShipSelected =
    selected &&
    ['pending', 'processing'].includes(selected.orderStatus) &&
    !(selected.paymentMethod === 'razorpay' && selected.paymentStatus !== 'paid');

  const canDeleteSelected =
    selected &&
    ['pending', 'processing', 'cancelled'].includes(selected.orderStatus) &&
    selected.paymentStatus !== 'paid' &&
    selected.refundStatus !== 'PENDING' &&
    selected.refundStatus !== 'REFUNDED' &&
    !selected.awbNumber &&
    !selected.shipmentId &&
    !isShippedLike(selected.orderStatus);

  const confirmAdminCancel = async () => {
    if (!selected) return;
    setCancelling(true);
    setActionError('');
    try {
      const { data } = await api.post(`/orders/${selected._id}/cancel`, {
        reason: cancelReason,
      });
      setSelected(data.order);
      setCancelOpen(false);
      setCancelReason('');
      fetchOrders();
    } catch (err) {
      setActionError(err.response?.data?.message || "We couldn't cancel the order right now. Please try again.");
      setCancelOpen(false);
    } finally {
      setCancelling(false);
    }
  };

  const confirmShipOrder = async () => {
    if (!selected) return;
    setShipping(true);
    setActionError('');
    try {
      const { data } = await api.post(`/orders/${selected._id}/ship`);
      setSelected(data.order);
      setShipOpen(false);
      fetchOrders();
    } catch (err) {
      setActionError(
        err.response?.data?.message || 'Unable to create shipment. The order was not marked as shipped.'
      );
      setShipOpen(false);
    } finally {
      setShipping(false);
    }
  };

  const confirmDeleteOrder = async () => {
    if (!selected) return;
    if (deleteConfirmId.trim().toUpperCase() !== String(selected.orderId).toUpperCase()) {
      return;
    }
    setDeleting(true);
    setActionError('');
    try {
      await api.delete(`/orders/${selected._id}`);
      setDeleteOpen(false);
      setDeleteConfirmId('');
      setSelected(null);
      fetchOrders();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Unable to delete the order right now.');
      setDeleteOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  const statusColor = {
    pending: 'bg-yellow-50 text-yellow-600',
    processing: 'bg-blue-50 text-blue-600',
    shipped: 'bg-purple-50 text-purple-600',
    in_transit: 'bg-purple-50 text-purple-600',
    out_for_delivery: 'bg-indigo-50 text-indigo-600',
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
                        <span className={`px-2 py-1 rounded-full text-xs capitalize ${statusColor[order.orderStatus] || 'bg-gray-50 text-gray-600'}`}>
                          {statusLabels[order.orderStatus] || order.orderStatus}
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
                <p className="text-soft-text">Payment</p>
                <p className="font-medium capitalize">
                  {selected.paymentMethod} · {selected.paymentStatus}
                </p>
              </div>
              <div>
                <p className="text-soft-text">Razorpay Payment ID</p>
                <p className="font-mono text-xs">{selected.razorpayPaymentId || 'N/A'}</p>
              </div>
              <div>
                <p className="text-soft-text">Shipment</p>
                <p className="font-medium capitalize">{selected.shipmentStatus || selected.orderStatus}</p>
                {selected.courier ? <p>Courier: {selected.courier}</p> : null}
                {selected.awbNumber || selected.trackingNumber ? (
                  <p>AWB: {selected.awbNumber || selected.trackingNumber}</p>
                ) : null}
                {selected.trackingUrl ? (
                  <a
                    href={selected.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal hover:underline"
                  >
                    Tracking URL
                  </a>
                ) : null}
              </div>
              <div>
                <p className="text-soft-text">Refund status</p>
                <p className="font-medium">{selected.refundStatus || 'NOT_APPLICABLE'}</p>
              </div>
              {selected.orderStatus === 'cancelled' && (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  <p className="font-semibold">Cancelled</p>
                  {selected.cancelledAt && <p>Date: {formatDate(selected.cancelledAt)}</p>}
                  {selected.cancelledBy && <p>Cancelled by: {selected.cancelledBy}</p>}
                  {selected.cancellationReason && <p>Reason: {selected.cancellationReason}</p>}
                </div>
              )}
              {actionError && <p className="text-sm text-red-500">{actionError}</p>}
              {selected.orderStatus === 'pending' && (
              <div>
                <label className="block text-soft-text mb-1">Update Status</label>
                <select
                  value={selected.orderStatus}
                  onChange={(e) => updateStatus(selected._id, e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-teal capitalize"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{statusLabels[s] || s}</option>
                  ))}
                </select>
              </div>
              )}
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
              {canShipSelected && (
                <Button
                  type="button"
                  className="w-full"
                  onClick={() => {
                    setActionError('');
                    setShipOpen(true);
                  }}
                >
                  Ship Order
                </Button>
              )}
              {canCancelSelected && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                  onClick={() => {
                    setActionError('');
                    setCancelOpen(true);
                  }}
                >
                  Cancel Order
                </Button>
              )}
              {canDeleteSelected && (
                <Button
                  type="button"
                  variant="danger"
                  className="w-full"
                  onClick={() => {
                    setActionError('');
                    setDeleteConfirmId('');
                    setDeleteOpen(true);
                  }}
                >
                  Delete Order
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={cancelOpen && Boolean(selected)}
        title={`Cancel order ${selected?.orderId || ''}?`}
        message={
          isShippedLike(selected?.orderStatus)
            ? 'This order has already been shipped. Cancelling here does not automatically recall the courier. Confirm only if you still need to cancel fulfilment.'
            : 'Are you sure you want to cancel this order? Stock will be restored if it was deducted.'
        }
        confirmLabel="Cancel Order"
        cancelLabel="Keep Order"
        loadingLabel="Cancelling..."
        loading={cancelling}
        onCancel={() => {
          if (!cancelling) setCancelOpen(false);
        }}
        onConfirm={confirmAdminCancel}
      >
        <div className="mt-5">
          <label className="mb-1.5 block text-[15px] font-medium text-text">
            Reason <span className="font-normal text-soft-text">(optional)</span>
          </label>
          <input
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="e.g. Customer request"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-teal focus:outline-none"
          />
        </div>
      </ConfirmDialog>

      <ConfirmDialog
        open={shipOpen && Boolean(selected)}
        title={`Ship order ${selected?.orderId || ''}?`}
        message="Review the customer, address, products, and payment below. The order is marked shipped only after the shipping provider confirms a shipment with an AWB."
        confirmLabel="Create Shipment"
        cancelLabel="Back"
        loadingLabel="Creating..."
        loading={shipping}
        onCancel={() => {
          if (!shipping) setShipOpen(false);
        }}
        onConfirm={confirmShipOrder}
      >
        {selected && (
          <div className="mt-5 space-y-2 text-sm text-soft-text">
            <p><span className="font-medium text-text">Customer:</span> {selected.customerName}</p>
            <p>
              <span className="font-medium text-text">Address:</span> {selected.address}, {selected.city}, {selected.state} - {selected.pincode}
            </p>
            <p>
              <span className="font-medium text-text">Products:</span>{' '}
              {selected.items?.map((item) => `${item.name} × ${item.quantity}`).join(', ')}
            </p>
            <p>
              <span className="font-medium text-text">Amount:</span> {formatPrice(selected.totalAmount)}
            </p>
            <p>
              <span className="font-medium text-text">Payment:</span> {selected.paymentMethod} · {selected.paymentStatus}
            </p>
          </div>
        )}
      </ConfirmDialog>

      <ConfirmDialog
        open={deleteOpen && Boolean(selected)}
        title={`Delete Order ${selected?.orderId || ''}?`}
        message="Delete this order permanently? This cannot be undone. This action permanently removes the order record."
        confirmLabel="Delete Permanently"
        cancelLabel="Keep Order"
        loadingLabel="Deleting..."
        loading={deleting}
        confirmDisabled={
          !selected || deleteConfirmId.trim().toUpperCase() !== String(selected.orderId).toUpperCase()
        }
        onCancel={() => {
          if (!deleting) {
            setDeleteOpen(false);
            setDeleteConfirmId('');
          }
        }}
        onConfirm={confirmDeleteOrder}
      >
        <div className="mt-5">
          <label className="mb-1.5 block text-[15px] font-medium text-text">
            Type {selected?.orderId} to confirm deletion
          </label>
          <input
            value={deleteConfirmId}
            onChange={(e) => setDeleteConfirmId(e.target.value)}
            placeholder={selected?.orderId || 'Order ID'}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-teal focus:outline-none"
          />
        </div>
      </ConfirmDialog>
    </div>
  );
}
