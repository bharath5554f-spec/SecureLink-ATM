
"use client";

// This file simulates the backend/database logic mentioned in the requirements.
// In a real app, this would be handled via Server Actions calling a database.

export type AuthStatus = 'idle' | 'otp_required' | 'locked' | 'authenticated' | 'error';

export interface UserSession {
  cardNumber: string;
  loginAttempts: number;
  isLocked: boolean;
  otp?: string;
  otpExpiry?: number;
}

// Memory-based mock database (resets on full refresh, but works for the prototype)
const mockUsers: Record<string, UserSession> = {
  "1234567812345678": {
    cardNumber: "1234567812345678",
    loginAttempts: 0,
    isLocked: false
  }
};

const VALID_PIN = "1234";

export const authService = {
  validateCredentials: (cardNumber: string, pin: string): { status: AuthStatus; message?: string; otp?: string } => {
    // 1. Frontend validation is already done, but we re-validate here (backend simulation)
    if (cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
      return { status: 'error', message: "Invalid card format." };
    }
    if (pin.length !== 4 || !/^\d+$/.test(pin)) {
      return { status: 'error', message: "Invalid PIN format." };
    }

    // 2. Lookup user (Simulating SQL Parameterized Query)
    const user = mockUsers[cardNumber];
    if (!user) {
      return { status: 'error', message: "Card not found." };
    }

    // 3. Check Lockout
    if (user.isLocked) {
      return { status: 'locked', message: "Your account is locked due to multiple failed attempts." };
    }

    // 4. Verify PIN (In real app, pin would be salted/hashed)
    if (pin === VALID_PIN) {
      // Success: Reset attempts, Generate OTP
      user.loginAttempts = 0;
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      user.otp = otp;
      user.otpExpiry = Date.now() + (5 * 60 * 1000); // 5 minutes
      console.log(`[MOCK DB] OTP generated for ${cardNumber}: ${otp}`);
      return { status: 'otp_required', otp };
    } else {
      // Failure: Increment attempts
      user.loginAttempts += 1;
      if (user.loginAttempts >= 3) {
        user.isLocked = true;
        return { status: 'locked', message: "Account locked after 3 failed attempts." };
      }
      return { status: 'error', message: `Invalid PIN. ${3 - user.loginAttempts} attempts remaining.` };
    }
  },

  verifyOtp: (cardNumber: string, enteredOtp: string): { success: boolean; message?: string } => {
    const user = mockUsers[cardNumber];
    if (!user || !user.otp || !user.otpExpiry) {
      return { success: false, message: "No active verification found." };
    }

    if (Date.now() > user.otpExpiry) {
      return { success: false, message: "OTP has expired." };
    }

    if (enteredOtp === user.otp) {
      return { success: true };
    }

    return { success: false, message: "Invalid OTP. Please try again." };
  }
};
