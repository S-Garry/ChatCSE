// init_master_key.js
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

const MASTER_KEY_PATH = path.join(__dirname, "master.key");

if (!fs.existsSync(MASTER_KEY_PATH)) {
  const masterKey = crypto.randomBytes(32);
  fs.writeFileSync(MASTER_KEY_PATH, masterKey.toString("base64"), { mode: 0o600 });
  console.log("master.key 不存在，已生成新檔並儲存至", MASTER_KEY_PATH);
} else {
  console.log("master.key 已存在，未作任何修改。位置：", MASTER_KEY_PATH);
}
console.log("master.key 已生成，以 Base64 格式保存到 kms\\master.key");
