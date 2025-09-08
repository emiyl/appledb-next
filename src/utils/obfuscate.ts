const KEY = 123456; 
const SALT = 789012;

/**
 * Generate a pseudo-random mask based on input and values.
 */
function generateMask(num: number): number {
    // Use a simple hash-like function for more randomness
    let mask = ((num * KEY) ^ SALT) % 1000000;
    mask = ((mask << 5) | (mask >> 15)) & 0xFFFFF; // Rotate left by 5 bits
    return mask;
}

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function convertToBase62(num: number): string {
    let n = num;
    if (n === 0) return chars[0];
    let result = '';
    while (n > 0) {
        result = chars[n % 62] + result;
        n = Math.floor(n / 62);
    }
    return result;
}

function convertFromBase62(str: string): number {
    let num = 0;
    for (let i = 0; i < str.length; i++) {
        const index = chars.indexOf(str[i]);
        if (index === -1) {
            throw new Error('Invalid base62 input');
        }
        num = num * 62 + index;
    }
    return num;
}

/**
 * Obfuscate a number to a 6-digit number.
 * @param num The number to obfuscate (should be <= 999999)
 * @returns Obfuscated 6-digit number
 */
export function obfuscateNumber(num: number): string {
    if (!Number.isInteger(num) || num < 0 || num > 999999) {
        throw new Error('Input must be an integer between 0 and 999999');
    }
    // Mix with salt, generate mask, rotate bits, then XOR
    let mixed = (num + SALT) % 1000000;
    mixed = ((mixed << 3) | (mixed >> 17)) & 0xFFFFF; // Rotate left by 3 bits
    const mask = generateMask(num);
    const obfuscated = (mixed ^ mask) % 1000000;
    return convertToBase62(obfuscated);
}

/**
 * Reverse the obfuscation to get the original number.
 * @param obfuscatedNum The obfuscated 6-digit number
 * @returns The original number
 */
export function deobfuscateNumber(obfuscatedBase62Num: string): number {
    const obfuscatedNum = convertFromBase62(obfuscatedBase62Num);
    if (!Number.isInteger(obfuscatedNum) || obfuscatedNum < 0 || obfuscatedNum > 999999) {
        throw new Error('Input must be an integer between 0 and 999999');
    }
    // Try all possible numbers to find the original (since mask depends on num)
    for (let num = 0; num <= 999999; num++) {
        let mixed = (num + SALT) % 1000000;
        mixed = ((mixed << 3) | (mixed >> 17)) & 0xFFFFF;
        const mask = generateMask(num);
        const candidate = (mixed ^ mask) % 1000000;
        if (candidate === obfuscatedNum) {
            return num;
        }
    }
    throw new Error('Could not deobfuscate number');
}