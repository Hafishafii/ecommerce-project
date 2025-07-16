import { Request, Response, NextFunction } from 'express';
import { MulterError } from 'multer';
import { ZodError } from 'zod';

export const errorHandler = (
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
): any => {

    // Zod validation error
    if (err instanceof ZodError) {
        return res.status(400).json({ message: err.errors[0]?.message || "Invalid input" });
    }

    console.error("Error message:", err.message);
    // Multer file upload error
    if (err instanceof MulterError) {
        return res.status(400).json({ message: err.message });
    }

    // JWT-related error
    if (
        err instanceof Error &&
        (err.message === "jwt expired" || err.message === "invalid signature")
    ) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    // Custom image file error
    if (err.message?.includes('Only image')) {
        return res.status(400).json({ message: err.message });
    }

    // Generic fallback
    return res.status(500).json({
        message: 'Something went wrong!',
    });
};
