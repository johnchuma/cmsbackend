const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const algorithm = "aes-256-cbc";
const key = crypto.randomBytes(32); // AES-256 requires a 32-byte key
const iv = crypto.randomBytes(16); // Initialization vector

//Encrypt (numeric results)
const encryptToNumeric = (text) => {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  // Convert encrypted buffer to a numeric string
  const encryptedHex = encrypted.toString("hex");
  const numericString = BigInt("0x" + encryptedHex).toString();
  // Ensure the result is exactly 12 digits long
  return numericString.padStart(12, "0").slice(0, 12);
};

//Encypt to alphanumeric
function encryptToAlphanumeric(text) {
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    const encoded = Buffer.concat([iv, encrypted]).toString('base64');
    return encoded.slice(0, 12); // Ensure the result is 12 characters long
}

// Convert numeric string back to hex
const decrypt = (numericString) => {
  const encryptedHex = BigInt(numericString).toString(16);
  const encrypted = Buffer.from(encryptedHex, "hex");
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

module.exports = { encryptToNumeric,encryptToAlphanumeric, decrypt };
