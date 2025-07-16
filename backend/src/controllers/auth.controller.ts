import { NextFunction, Request, Response } from "express";
import { sendOTPTypes } from "../utils/constants";
import { userZodSchema } from "../validations/user.validation";
import { sanitizeInput } from "../utils/sanitize";
import User from "../models/user.model";
import { compareHashedPassword, hashPassword } from "../utils/bcrypt";
import { generateToken } from "../utils/crypto";
import VerificationRequest from "../models/verificationRequest";
import { checkCooldown, emailOrPhone, generateOtp } from "../utils/helpers";
import { sendEmailOTP, sendSMSOTP } from "../utils/sendVerification";
import { generateTokens, refreshAccessToken, verifyToken } from "../utils/jsonwebtoken";


// Sending OTPs ( Login , Create account , password reset )
export const sendOTP = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { type } = req.query;

        if (typeof type !== 'string' || !sendOTPTypes.includes(type)) {
            res.status(400).json({ message: "Invalid request." });
            return;
        }

        // Login 
        if (type === 'LOGIN') {
            const { phone } = req.body;

            if (!phone) {
                res.status(400).json({ message: "Phone number is required" });
                return;
            }

            const user = await User.findOne({ phone, isPhoneVerified: true });

            if (!user) {
                res.status(400).json({ message: "Oops! We couldn't find an account linked to this number. Try signing up first." });
                return;
            }

            const existingReq = await VerificationRequest.findOne({ userId: user.id, type: 'LOGIN' });

            // To check the cool down time for requesting next otp.
            if (checkCooldown(existingReq, res)) return;

            const { token, expiresAt } = generateToken();
            const otp = generateOtp();

            const verificationReq = await VerificationRequest.findOneAndUpdate(
                { userId: user.id, type: 'LOGIN' },
                {
                    token,
                    method: 'OTP_PHONE',
                    type: 'LOGIN',
                    userId: user.id,
                    expiresAt,
                    otp
                },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );

            await sendSMSOTP(user.phone, verificationReq.otp);

            res.status(200).json({
                message: "OTP sent successfully",
                token: verificationReq.token
            });
            return;
        }

        // Password Reset
        if (type === 'PASSWORD_RESET') {
            const { email, phone } = emailOrPhone(req.body?.emailOrPhone);

            if (!email && !phone) {
                res.status(400).json({ message: "Email/Phone number is required" });
                return;
            }

            let user;
            if (email) {
                user = await User.findOne({ email, isPhoneVerified: true });
            } else if (phone) {
                user = await User.findOne({ phone, isPhoneVerified: true });
            }

            if (!user) {
                res.status(400).json({ message: "Oops! We couldn't find an account linked to this email." });
                return;
            }

            const existingReq = await VerificationRequest.findOne({ userId: user.id, type: 'PASSWORD_RESET' });
            if (checkCooldown(existingReq, res)) return;

            const { token, expiresAt } = generateToken();
            const otp = generateOtp();

            const verificationReq = await VerificationRequest.findOneAndUpdate(
                { userId: user.id, type: 'PASSWORD_RESET' },
                {
                    token,
                    method: 'OTP_PHONE',
                    type: 'PASSWORD_RESET',
                    userId: user.id,
                    expiresAt,
                    otp
                },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );

            await sendSMSOTP(user.phone, verificationReq.otp);

            res.status(200).json({
                message: "OTP sent successfully",
                token: verificationReq.token
            });
            return;
        }

        // Create Account
        if (type === 'CREATE_ACCOUNT') {
            const { password } = req.body;
            const cleanedData = sanitizeInput(req.body);

            userZodSchema.parse(cleanedData);

            const existingUser = await User.findOne({ phone: cleanedData.phone });

            if (existingUser?.isPhoneVerified) {
                res.status(409).json({ message: "Phone number already in use" });
                return;
            }

            if (password !== cleanedData.password) {
                res.status(400).json({ message: "Suspicious characters found in password!" });
                return;
            }

            const hashedPassword = await hashPassword(password);
            if (!hashedPassword) {
                throw new Error("Failed to hash the password.");
            }

            const user = await User.findOneAndUpdate(
                { phone: cleanedData.phone },
                {
                    $setOnInsert: {
                        phone: cleanedData.phone,
                        name: cleanedData.name,
                        password: hashedPassword,
                        createdAt: new Date(),
                        isPhoneVerified: false
                    },
                },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );

            const existingReq = await VerificationRequest.findOne({ userId: user.id, type: 'CREATE_ACCOUNT' });
            if (checkCooldown(existingReq, res)) return;

            const { token, expiresAt } = generateToken();
            const otp = generateOtp();

            const verificationReq = await VerificationRequest.findOneAndUpdate(
                { userId: user.id, type: 'CREATE_ACCOUNT' },
                {
                    token,
                    method: 'OTP_PHONE',
                    type: 'CREATE_ACCOUNT',
                    userId: user.id,
                    expiresAt,
                    otp
                },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );

            await sendSMSOTP(user.phone, verificationReq.otp);

            res.status(200).json({
                message: "OTP sent successfully",
                token: verificationReq.token
            });
            return;
        }


    } catch (error) {
        console.log("Error in sending OTP:", error);
        next(error);
    }
};


// Verify OTP
export const verifyOTP = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { token } = req.query;
        const { otp } = req.body;

        if (!token || typeof token !== 'string') {
            res.status(400).json({ message: "Invalid request. Token is missing or malformed." });
            return;
        }

        if (!otp) {
            res.status(400).json({ message: "OTP is required." });
            return;
        }

        const verificationReq = await VerificationRequest.findOne({ token });

        if (!verificationReq) {
            res.status(400).json({ message: "Invalid or expired verification request." });
            return;
        }

        if (verificationReq.expiresAt && verificationReq.expiresAt < new Date()) {
            res.status(400).json({ message: "OTP has expired." });
            return;
        }

        if (verificationReq.otp !== otp) {
            res.status(400).json({ message: "Invalid OTP." });
            return;
        }

        const user = await User.findById(verificationReq.userId);
        if (!user) {
            throw new Error("User not found.");
        }

        if (!['LOGIN', 'CREATE_ACCOUNT'].includes(verificationReq?.type)) {
            res.status(400).json({ message: "Invalid request type." });
            return;
        }

        // LOGIN
        if (verificationReq.type === 'LOGIN') {
            const { accessToken, refreshToken } = generateTokens({ userId: user._id, phone: user.phone });

            await VerificationRequest.deleteOne({ token });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            res.status(201).json({
                message: "Login successful",
                accessToken,
                user: {
                    id: user._id,
                    phone: user.phone,
                    name: user.name,
                    email: user?.email
                }
            });
            return;
        }

        // CREATE_ACCOUNT
        if (verificationReq.type === 'CREATE_ACCOUNT') {

            user.isPhoneVerified = true;
            await user.save();

            const { accessToken, refreshToken } = generateTokens({ userId: user._id, phone: user.phone });

            await VerificationRequest.deleteOne({ token });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            res.status(201).json({
                message: "Account created successfully",
                accessToken,
                user: {
                    id: user._id,
                    phone: user.phone,
                    name: user.name,
                    email: user?.email
                }
            });
            return;
        }
        res.status(400).json({ message: "Invalid request. Please request a new otp." })
        return;
    } catch (error) {
        console.log("Error in verifying OTP:", error);
        next(error);
    }
};


// Send Email verification OTP
export const sendEmailVerification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {
        const type = 'VERIFY_EMAIL';
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: "Unauthorized." });
            return;
        }

        const { email } = req.body;
        const cleanedEmail = sanitizeInput(email);

        if (!email || email !== cleanedEmail) {
            res.status(400).json({ message: "Please provide a valid Email ID." });
            return;
        }

        userZodSchema.shape.email.parse(cleanedEmail);

        const existingUser = await User.findOne({ email: cleanedEmail });

        if (existingUser?.isEmailVerified && existingUser._id.equals(userId)) {
            res.status(400).json({ message: "This Email ID is already linked to your account." });
            return;
        }

        if (existingUser?.isEmailVerified) {
            res.status(400).json({ message: "Oops! This Email ID is already linked to another account. Try a new one." });
            return;
        }

        if (existingUser) {
            await User.updateOne(
                { _id: existingUser._id },
                { $set: { email: null, isEmailVerified: false } }
            );
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                email: cleanedEmail,
                isEmailVerified: false
            },
            { new: true }
        );

        if (!updatedUser) {
            res.status(401).json({ message: "Unauthorized." });
            return;
        }

        // Check for cooldown
        const existingReq = await VerificationRequest.findOne({ userId, type });
        if (checkCooldown(existingReq, res)) return;

        const { token, expiresAt } = generateToken();
        const otp = generateOtp();

        const verificationReq = await VerificationRequest.findOneAndUpdate(
            { userId, type },
            {
                token,
                method: 'OTP_EMAIL',
                type,
                userId,
                expiresAt,
                otp
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        await sendEmailOTP(updatedUser.email || email, verificationReq.otp);

        res.status(200).json({
            message: "OTP sent successfully",
            token: verificationReq.token
        });
    } catch (error) {
        console.error("Error in sending email verification OTP:", error);
        next(error);
    }
};

// Verify Email verification OTP 
export const verifyEmailVerification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const type = 'VERIFY_EMAIL';
        const userId = req.user?.userId;
        const { token } = req.query;
        const { otp } = req.body;

        if (!userId) {
            res.status(401).json({ message: "Unauthorized." });
            return;
        }

        if (!token || typeof token !== 'string') {
            res.status(400).json({ message: "Invalid request. Token is missing or malformed." });
            return;
        }

        if (!otp) {
            res.status(400).json({ message: "OTP is required." });
            return
        }

        const verificationReq = await VerificationRequest.findOne({ token, type });

        if (!verificationReq) {
            res.status(400).json({ message: "Invalid or expired verification request." });
            return;
        }

        if (verificationReq.userId.toString() !== userId.toString()) {
            res.status(401).json({ message: "Unauthorized." });
            return;
        }

        if (verificationReq.expiresAt && verificationReq.expiresAt < new Date()) {
            res.status(400).json({ message: "OTP has expired." });
            return;
        }

        if (verificationReq.otp !== otp) {
            res.status(400).json({ message: "Invalid OTP." });
            return;
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { isEmailVerified: true },
            { new: true }
        );

        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }

        await VerificationRequest.deleteOne({ _id: verificationReq._id });

        res.status(200).json({ message: "Email verified successfully." });
        return;
    } catch (error) {
        console.error("Error in email verification:", error);
        next(error);
    }
};

// Get OTP type
export const getOTPType = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { token } = req.query;

        if (!token || typeof token !== "string") {
            res.status(400).json({ message: "Token is missing or invalid." });
            return;
        }

        const verification = await VerificationRequest.findOne({ token });

        if (!verification) {
            res.status(400).json({ message: "Invalid or expired token." });
            return;
        }

        if (verification.expiresAt && verification.expiresAt < new Date()) {
            res.status(400).json({ message: "Token expired." });
            return;
        }

        res.status(200).json({
            message: "Token is valid",
            type: verification.type,
            method: verification.method,
        });

    } catch (error) {
        console.error("Error in getOTPType:", error);
        next(error);
    }
};

// Reset password by verifing the otp
export const resetPasswordViaOTP = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { token } = req.query;
        const { otp, newPassword } = req.body;

        if (!token || typeof token !== "string") {
            res.status(400).json({ message: "Token is missing or invalid." });
            return;
        }

        if (!otp || !newPassword) {
            res.status(400).json({ message: "OTP and new password are required." });
            return;
        }

        const verification = await VerificationRequest.findOne({ token });

        if (!verification || verification.type !== 'PASSWORD_RESET') {
            res.status(400).json({ message: "Invalid or expired token." });
            return;
        }

        if (verification.expiresAt && verification.expiresAt < new Date()) {
            res.status(400).json({ message: "OTP has expired." });
            return;
        }

        if (verification.otp !== otp) {
            res.status(400).json({ message: "Incorrect OTP." });
            return;
        }

        const user = await User.findById(verification.userId);
        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }

        const hashedPassword = await hashPassword(newPassword);

        user.password = hashedPassword;
        await user.save();

        await VerificationRequest.deleteOne({ _id: verification._id });

        res.status(200).json({ message: "Password reset successful." });

    } catch (error) {
        console.error("Error in resetPasswordViaOTP:", error);
        next(error);
    }
};


// Refresh access token 
export const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies?.refreshToken;

        if (!token) {
            res.status(401).json({ message: 'Refresh token missing' });
            return;
        }

        // Verify refresh token
        const decoded = verifyToken(token)

        if (!decoded?.userId) {
            res.status(403).json({ message: 'Invalid token' });
            return;
        }

        // Fetch user
        const user = await User.findById(decoded?.userId);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Generate new access token
        const { accessToken } = refreshAccessToken(token)

        res.status(200).json({
            accessToken, user: {
                id: user._id,
                phone: user.phone,
                email: user.email,
                name: user.name
            }
        });
    } catch (err) {
        console.error("Error in refreshing access Token:", err);
        next(err);
    }
};

// Login with email and password
export const loginWithEmailPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        console.log("route working")

        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }

        // Find user by email
        const user = await User.findOne({ email, isPhoneVerified: true });

        if (!user) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }

        if (!user?.isEmailVerified) {
            res.status(401).json({ message: "Email is not verified.Please login using OTP" });
            return;
        }

        // Check if user has a password (for users created via OTP only)
        if (!user.password) {
            res.status(401).json({ message: "Please login using OTP" });
            return;
        }

        // Compare password
        const isPasswordValid = await compareHashedPassword(password, user.password);

        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens({ userId: user._id, phone: user.phone });

        // Set refresh token cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });


        // Return success response
        res.status(200).json({
            message: "Login successful",
            accessToken,
            user: {
                id: user._id,
                phone: user.phone,
                email: user.email,
                name: user.name
            }
        });

    } catch (error) {
        console.log("Error in email/password login:", error);
        next(error);
    }
};