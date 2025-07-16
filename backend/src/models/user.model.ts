import mongoose from 'mongoose';

export interface UserType extends Document {
    phone: string;
    isPhoneVerified: boolean;
    email?: string;
    isEmailVerified: boolean;
    name: string;
    password: string;
    createdAt: Date;
}

const userSchema = new mongoose.Schema<UserType>({
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    isPhoneVerified: {
        type: Boolean,
        default: false,
    },
    email: {
        type: String,
        unique: true,
        sparse: true,
        lowercase: true,
        trim: true,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    name: {
        type: String,
        trim: true,
    },
    password: {
        type: String,
        minlength: 6,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const User = mongoose.model<UserType>('User', userSchema);

export default User;