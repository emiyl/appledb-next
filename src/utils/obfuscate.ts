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

/**
 * Obfuscate a number to a 6-digit number.
 * @param num The number to obfuscate (should be <= 999999)
 * @returns Obfuscated 6-digit number
 */
export function obfuscateNumber(num: number): number {
    if (!Number.isInteger(num) || num < 0 || num > 999999) {
        throw new Error('Input must be an integer between 0 and 999999');
    }
    // Mix with salt, generate mask, rotate bits, then XOR
    let mixed = (num + SALT) % 1000000;
    mixed = ((mixed << 3) | (mixed >> 17)) & 0xFFFFF; // Rotate left by 3 bits
    const mask = generateMask(num);
    const obfuscated = (mixed ^ mask) % 1000000;
    return obfuscated;
}

/**
 * Reverse the obfuscation to get the original number.
 * @param obfuscatedNum The obfuscated 6-digit number
 * @returns The original number
 */
export function deobfuscateNumber(obfuscatedNum: number): number {
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