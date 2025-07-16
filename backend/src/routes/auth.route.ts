import express from 'express'
import { getOTPType, loginWithEmailPassword, refreshToken, resetPasswordViaOTP, sendEmailVerification, sendOTP, verifyEmailVerification, verifyOTP } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router()

router.post('/send-otp', sendOTP)

router.post('/verify-otp', verifyOTP)

router.post('/login', loginWithEmailPassword);

router.post('/send-email-verification', authMiddleware, sendEmailVerification)

router.post('/verify-email', authMiddleware, verifyEmailVerification)

router.get('/otp-type', getOTPType);

router.post('/reset-password', resetPasswordViaOTP);

router.get('/refresh',refreshToken)

export default router;