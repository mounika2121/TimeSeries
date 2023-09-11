const crypto = require("crypto");
const fs = require("fs");

// Define your secret key
const secretKey = process.env.SECRET_KEY;

function encryptAES(data, key) {
  const iv = crypto.randomBytes(16);
  const encryptedData = crypto.encrypt("aes-256-ctr", key, data, {
    iv: iv,
  });

  return Buffer.concat([iv, encryptedData]).toString("base64");
}

function GenerateHashString() {
  const hash = crypto.createHash("sha256");
  const DataFromFile = fs.readFileSync("./data.json");
  const Data = JSON.parse(DataFromFile);
  console.log(Data);
  let max = 6;
  let min = 3;
  const RandomNumber = Math.floor(Math.random() * (max - min)) + min;
  let DataStream = "";
  for (let i = 0; i < RandomNumber; i++) {
    function getRandomElementFromArray(array) {
      const randomIndex = Math.floor(Math.random() * array.length);
      return array[randomIndex];
    }

    const SelectData = {
      name: getRandomElementFromArray(Data.names),
      origin: getRandomElementFromArray(Data.cities),
      destination: getRandomElementFromArray(Data.cities),
    };
    console.log("SelectData", SelectData);

    const objectJson = JSON.stringify(SelectData);

    // Hash the JSON string using SHA-256
    const hash = crypto.createHash("sha256");
    hash.update(objectJson);
    const hashValue = hash.digest("hex");

    // Use the hash value as the secret key
    const secretKey = crypto.pbkdf2Sync(
      process.env.PASS_KEY,
      salt,
      100000,
      32,
      "sha256"
    );
    console.log("Secret Key:", secretKey);
    SelectData.secretKey = secretKey;
    console.log("SelectData", SelectData);

    const encryptedHashValue = encryptAES(SelectData, secretKey);
    console.log("Encrypted Hash Value:", encryptedHashValue);
    DataStream += encryptedHashValue;
    DataStream += "|";
  }
  DataStream = DataStream.slice(0, -1);
  return DataStream;
}

const hashValue = GenerateHashString();
console.log(hashValue);
module.exports = GenerateHashString;
