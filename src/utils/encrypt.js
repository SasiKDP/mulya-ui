import CryptoJS from 'crypto-js';

// Define your encryption key and initialization vector (IV)
const ENCRYPTION_KEY = 'your-encryption-key'; // Change this to a secure key
const IV = CryptoJS.enc.Utf8.parse('your-iv-vector'); // Change this to a secure IV

// Encrypt the field using AES encryption
export const encryptField = (value) => {
  if (value === undefined || value === null) return value;

  try {
    const encrypted = CryptoJS.AES.encrypt(value.toString(), ENCRYPTION_KEY, {
      iv: IV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString(); // Return the encrypted value as a string
  } catch (error) {
    console.error('Encryption failed:', error);
    return value; // Return original value if encryption fails
  }
};

// Decrypt the field using AES decryption
export const decryptField = (encryptedValue) => {
  if (!encryptedValue) return encryptedValue;

  try {
    const bytes = CryptoJS.AES.decrypt(encryptedValue, ENCRYPTION_KEY, {
      iv: IV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return bytes.toString(CryptoJS.enc.Utf8); // Convert decrypted value to string
  } catch (error) {
    console.error('Decryption failed:', error);
    return encryptedValue; // Return the encrypted value if decryption fails
  }
};
