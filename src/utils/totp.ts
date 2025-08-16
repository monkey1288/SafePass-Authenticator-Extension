import { authenticator } from 'otplib';

export const generateTOTP = (secret: string): string => {
  try {
    return authenticator.generate(secret);
  } catch (error) {
    console.error('Error generating TOTP:', error);
    return '000000';
  }
};

export const getTOTPInfo = (secret: string): { code: string; remainingTime: number; totalTime: number } => {
  const code = generateTOTP(secret);
  const now = Date.now();
  const period = 30 * 1000; // 30 seconds
  const remainingTime = period - (now % period);
  const totalTime = period;
  
  return {
    code,
    remainingTime,
    totalTime
  };
};

export const validateSecret = (secret: string): boolean => {
  try {
    // Try to generate a TOTP to validate the secret
    authenticator.generate(secret);
    return true;
  } catch {
    return false;
  }
}; 