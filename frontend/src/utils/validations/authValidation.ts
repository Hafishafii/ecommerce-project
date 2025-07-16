// Authentication validation utilities

// Email validation with RFC 5322 compliant regex pattern
export const validateEmail = (email: string): string => {
  if (!email.trim()) {
    return 'Email is required';
  }
  
  // RFC 5322 compliant email regex pattern
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  
  // Additional checks for common email issues
  if (email.length > 254) {
    return 'Email address is too long';
  }
  
  // Check for consecutive dots in local part
  if (email.split('@')[0].includes('..')) {
    return 'Email address contains invalid characters';
  }
  
  // Check for invalid domain patterns
  if (email.includes('@.') || email.includes('.@') || email.endsWith('.')) {
    return 'Email address contains invalid characters';
  }
  
  return '';
};

// Password validation
export const validatePassword = (password: string): string => {
  if (!password.trim()) {
    return 'Password is required';
  }
  
  if (password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  
  return '';
};



// Combined validation for login form
export const validateLoginForm = (email: string, password: string): {
  emailError: string;
  passwordError: string;
  isValid: boolean;
} => {
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);
  
  return {
    emailError,
    passwordError,
    isValid: !emailError && !passwordError
  };
};



// Validation types for better type safety
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface LoginValidationResult {
  emailError: string;
  passwordError: string;
  isValid: boolean;
}

// Registration password validation
export const validateRegistrationPassword = (password: string): string => {
  if (!password.trim()) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters long';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
  if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
  if (!/\d/.test(password)) return 'Password must contain at least one digit';
  return '';
};

// Mobile number validation
export const validateMobile = (mobile: string, countryCode: string = 'IN +91'): string => {
  if (!mobile.trim()) return 'Mobile number is required';
  const phoneNumber = mobile.replace(/\D/g, '');
  if (countryCode === 'IN +91') {
    let cleanNumber = phoneNumber;
    if (phoneNumber.startsWith('91')) cleanNumber = phoneNumber.substring(2);
    if (cleanNumber.length !== 10) return 'Phone number must be exactly 10 digits';
    if (!/^[6-9]/.test(cleanNumber)) return 'Phone number must start with 6, 7, 8, or 9';
  }
  return '';
};

// Name validation
export const validateName = (name: string): string => {
  if (!name.trim()) return 'Name is required';
  if (name.trim().length < 4) return 'Name must be at least 4 characters long';
  if (name.trim().length > 50) return 'Name is too long (maximum 50 characters)';
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  if (!nameRegex.test(name.trim())) return 'Name can only contain letters, spaces, hyphens, and apostrophes';
  return '';
};

// Combined registration validation
export const validateRegistrationForm = (
  mobile: string, 
  name: string, 
  email: string, 
  password: string, 
  countryCode: string = 'IN +91'
): {
  mobileError: string;
  nameError: string;
  emailError: string;
  passwordError: string;
  isValid: boolean;
} => {
  const mobileError = validateMobile(mobile, countryCode);
  const nameError = validateName(name);
  const emailError = validateEmail(email);
  const passwordError = validateRegistrationPassword(password);
  return {
    mobileError,
    nameError,
    emailError,
    passwordError,
    isValid: !mobileError && !nameError && !emailError && !passwordError
  };
};

 