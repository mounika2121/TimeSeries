const crypto = require("crypto");
require("dotenv").config();
const saveObjectInDb = require("./StoreData");

let salt = process.env.SALT;
console.log(salt);

function DecryptAndSaveFunc(EncryptedData, secretKey) {
  let arr = EncryptedData.split("|");
  for (let i = 0; i < arr.length; i++) {
    const combinedBuffer = Buffer.from(arr[i], "base64");
    const IV = combinedBuffer.slice(0, 16);
    const encryptedPayload = combinedBuffer.slice(16);
    console.log("secretKey:", secretKey);
    const key = crypto.pbkdf2Sync(secretKey, salt, 100000, 32, "sha256");

    console.log("Derived Key:", key.toString("hex"));
    key = Buffer.from(secretKey, "hex");
    try {
      const Decipher = crypto.createCipheriv("aes-256-ctr", key, IV);
      let decryptData = Decipher.update(encryptedPayload, "base64", "utf-8");
      decryptData += Decipher.final("utf-8");
      console.log(decryptData);
      saveObjectInDb(decryptData);
    } catch (err) {
      continue;
    }
  }
}

module.exports = DecryptAndSaveFunc;
