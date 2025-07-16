import dotenv from 'dotenv'
import { Response } from 'express';
import xss from 'xss';

dotenv.config();

// Validate and get env variable 
export const getEnvVariable = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    console.error(`Error: Environment variable '${name}' is not defined.`);
    process.exit(1);
  }
  return value;
};


export const generateOtp = (length: number = 6): string => {
  const min = 10 ** (length - 1);
  const max = 10 ** length - 1;
  return Math.floor(Math.random() * (max - min + 1) + min).toString();
};


export const emailOrPhone = (param: string | undefined) => {
  let email;
  let phone;

  param = xss(param?.toString()?.trim() as string)

  if (param?.includes('@')) {
    email = param
  } else {
    phone = param
  }
  return {
    phone,
    email
  }
}

export const checkCooldown = (
  existingReq: { createdAt: Date } | null,
  res: Response,
  cooldownMinutes = 3
): boolean => {
  if (!existingReq) return false;

  const cooldownTime = new Date(existingReq.createdAt.getTime() + cooldownMinutes * 60 * 1000);
  if (cooldownTime > new Date()) {
    const timeLeft = Math.ceil((cooldownTime.getTime() - Date.now()) / 1000);
    res.status(429).json({ message: `Please wait ${timeLeft} seconds before requesting another OTP.` });
    return true;
  }

  return false;
};
