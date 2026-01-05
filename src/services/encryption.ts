import CryptoJS from 'crypto-js';

// In a real production app, we would use a stronger KDF.
// For this demo, we'll use the user's PIN directly or a simple salt.
const SALT = 'premium-notes-salt-v1';

export const EncryptionService = {
    encrypt: (text: string, pin: string): string => {
        if (!text) return '';
        try {
            // Combine PIN with salt for slightly better key derivation
            const key = pin + SALT;
            return CryptoJS.AES.encrypt(text, key).toString();
        } catch (error) {
            console.error('Encryption failed:', error);
            return text;
        }
    },

    decrypt: (ciphertext: string, pin: string): string | null => {
        if (!ciphertext) return '';
        try {
            const key = pin + SALT;
            const bytes = CryptoJS.AES.decrypt(ciphertext, key);
            const originalText = bytes.toString(CryptoJS.enc.Utf8);

            // If decryption produces empty string from non-empty ciphertext, it failed (wrong key)
            if (!originalText && ciphertext.length > 0) return null;

            return originalText;
        } catch (error) {
            console.error('Decryption failed:', error);
            return null;
        }
    },

    // Helper to verify if a string is likely encrypted (basic check)
    isEncrypted: (text: string): boolean => {
        return text.trim().startsWith('U2F'); // Common start for Base64 AES or similar? 
        // Better: just rely on the isLocked flag in the note object.
        // Actually, let's keep it simple and trust the isLocked flag.
        return false;
    }
};
