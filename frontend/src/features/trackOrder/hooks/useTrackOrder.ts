// src/features/trackOrder/hooks/useTrackOrder.ts
import { useEffect, useState } from 'react';
import axios from 'axios';

interface OrderStatus {
  status: string;
  orderedAt: string;
  shippedAt?: string;
  deliveredAt?: string;
}

export const useTrackOrder = (orderId: string) => {
  const [order, setOrder] = useState<OrderStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`/api/orders/${orderId}`);
        setOrder(res.data);
      } catch (err) {
        console.error('Failed to fetch order status', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  return { order, loading };
};







// export const useTrackOrder = () => {
//   // Placeholder for real tracking logic
//   return {
//     status: "Shipped",
//     coordinates: [9.9312, 76.2673],
//     estimatedDelivery: "2025-07-20",
//   };
// };
