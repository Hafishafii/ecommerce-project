import { Router } from 'express';
import { trackOrder } from '../controllers/order.controller';

const router = Router();

// Temporarily JWT middleware removed for testing
router.get('/track/:orderId', trackOrder);

export default router;
