import crypto from "crypto";

const algorithm = "aes-256-cbc";
const key = process.env.REACT_APP_SECRET_KEY;
const giv = crypto.randomBytes(16);

export const encrypt = (text) => {
  let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), giv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return { iv: giv.toString("hex"), encryptedData: encrypted.toString("hex") };
};

export const decrypt = (text) => {
  const textObj = JSON.parse(text);

  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(textObj.iv, "hex")
  );

  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(textObj.encryptedData, "hex")),
    decipher.final(),
  ]);

  return decrpyted.toString();
};
