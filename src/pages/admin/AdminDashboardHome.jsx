import { useState, useEffect } from 'react';
import { ShoppingCart, DollarSign, Clock, Package } from 'lucide-react';
import FadeUp from '../../components/ui/FadeUp';
import { formatPrice } from '../../utils/format';
import api from '../../utils/api';

export default function AdminDashboardHome() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    totalProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/orders'), api.get('/products')])
      .then(([ordersRes, productsRes]) => {
        const orders = ordersRes.data;
        const products = productsRes.data;
        setStats({
          totalOrders: orders.length,
          totalRevenue: orders
            .filter((o) => o.paymentStatus === 'paid')
            .reduce((sum, o) => sum + o.totalAmount, 0),
          pendingOrders: orders.filter((o) => o.orderStatus === 'pending').length,
          totalProducts: products.length,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'bg-light-teal text-teal' },
    { label: 'Total Revenue', value: formatPrice(stats.totalRevenue), icon: DollarSign, color: 'bg-teal/10 text-teal' },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: Clock, color: 'bg-orange-50 text-orange-500' },
    { label: 'Total Products', value: stats.totalProducts, icon: Package, color: 'bg-ivory text-mid-teal' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-text mb-8">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <FadeUp key={card.label} delay={i * 0.05}>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
                <card.icon size={20} />
              </div>
              <p className="mt-4 text-2xl font-bold text-text">{card.value}</p>
              <p className="text-sm text-gray-500 mt-1">{card.label}</p>
            </div>
          </FadeUp>
        ))}
      </div>
    </div>
  );
}
