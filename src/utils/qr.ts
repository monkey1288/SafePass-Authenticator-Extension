import QRCode from 'qrcode';

export interface ParsedQRData {
  accountName: string;
  issuer: string;
  secret: string;
}

export const parseQRCode = (qrData: string): ParsedQRData | null => {
  try {
    // Handle otpauth:// URLs (Google Authenticator format)
    if (qrData.startsWith('otpauth://')) {
      const url = new URL(qrData);
      const params = new URLSearchParams(url.search);
      
      const secret = params.get('secret');
      const issuer = params.get('issuer') || url.hostname;
      const accountName = url.pathname.substring(1) || 'Unknown';
      
      if (secret) {
        return {
          accountName: decodeURIComponent(accountName),
          issuer: decodeURIComponent(issuer),
          secret
        };
      }
    }
    
    // Handle other formats or plain text
    return null;
  } catch (error) {
    console.error('Error parsing QR code:', error);
    return null;
  }
};

export const generateQRCode = async (data: string): Promise<string> => {
  try {
    return await QRCode.toDataURL(data);
  } catch (error) {
    console.error('Error generating QR code:', error);
    return '';
  }
}; 