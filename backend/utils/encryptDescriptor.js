const crypto = require("crypto");

const ALGORITHM = "aes-256-cbc";
// 32-byte key derived from JWT_SECRET (for simplicity in this project;
// in production use a dedicated ENCRYPTION_KEY env variable)
const KEY = crypto.createHash("sha256").update(process.env.JWT_SECRET).digest();

const encryptDescriptor = (descriptorArray) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  const jsonStr = JSON.stringify(descriptorArray);
  const encrypted = Buffer.concat([cipher.update(jsonStr, "utf8"), cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
};

const decryptDescriptor = (encryptedString) => {
  const [ivHex, encryptedHex] = encryptedString.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const encryptedText = Buffer.from(encryptedHex, "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
  return JSON.parse(decrypted.toString("utf8"));
};

module.exports = { encryptDescriptor, decryptDescriptor };