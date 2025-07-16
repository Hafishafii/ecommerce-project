import mongoose from 'mongoose';


export interface VerificationRequestType extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    token: string;
    otp: string;
    type: 'LOGIN' | 'PASSWORD_RESET' | 'CREATE_ACCOUNT';
    method: 'OTP_PHONE' | 'OTP_EMAIL'
    isVerified: boolean;
    expiresAt: Date;
    createdAt: Date;
}

const verificationRequestSchema = new mongoose.Schema<VerificationRequestType>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
        unique: true,
    },
    type: {
        type: String,
        enum: ['LOGIN', 'PASSWORD_RESET', 'CREATE_ACCOUNT', 'VERIFY_EMAIL'],
        required: true,
    },
    method: {
        type: String,
        enum: ['OTP_PHONE', 'OTP_EMAIL'],
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const VerificationRequest = mongoose.model<VerificationRequestType>('VerificationRequest', verificationRequestSchema);

export default VerificationRequest