import { Request, Response } from 'express';
import Order from '../models/order.model';

export const trackOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    const order = await Order.findById(orderId)
      .populate('userId', 'name email') 
      .populate('items.product', 'name images')
      .populate('shippingAddressId');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error('Track Order Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
