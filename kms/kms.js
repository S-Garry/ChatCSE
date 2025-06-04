// server.js
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// ─── 1. 讀取 master.key ───────────────────────────────────────────
const MASTER_KEY_PATH = path.join(__dirname, "master.key");
if (!fs.existsSync(MASTER_KEY_PATH)) {
  console.error("Error: master.key 文件不存在！請先運行 init_master_key.js 生成。");
  process.exit(1);
}
const masterKey = Buffer.from(fs.readFileSync(MASTER_KEY_PATH, "utf-8"), "base64");
// masterKey 長度須為 32 bytes
if (masterKey.length !== 32) {
  console.error("Error: master.key 長度須為32。");
  process.exit(1);
}

// ─── 2. path & logs ──────────────
const KEYS_DIR = path.join(__dirname, "keys");         // keys metadata
const AUDIT_LOG = path.join(__dirname, "audit.log");

if (!fs.existsSync(KEYS_DIR)) fs.mkdirSync(KEYS_DIR);
if (!fs.existsSync(AUDIT_LOG)) fs.writeFileSync(AUDIT_LOG, "", { mode: 0o600 });

// append only
function writeAuditLog(keyId, operation, caller, success, message = "") {
  const timestamp = new Date().toISOString();
  const logLine = `${timestamp} | ${keyId} | ${operation} | ${caller} | ${success ? "success" : "failure"}${message ? `: ${message}` : ""}\n`;
  fs.appendFileSync(AUDIT_LOG, logLine);
}

// ─── 3. EncryptKey 接口 ───────────────────────────────────
app.post("/kms/encrypt", (req, res) => {
  const { message_id, caller, key} = req.body;
  if (!message_id || !caller) {
    return res.status(400).json({ error: "request 必須包含 message_id 和 caller 以及 key 三項。" });
  }

  const keyFilePath = path.join(KEYS_DIR, `${message_id}.json`);
  if (fs.existsSync(keyFilePath)) {
    writeAuditLog(message_id, "encrypt", caller, false, "Message ID 已存在，無法覆蓋");
    return res.status(400).json({ error: "Message ID 已存在，請換一個新的 message_id。" });
  }

  try {
    // plaintextBuffer = E1
    const plaintextBuffer = Buffer.from(key, "base64");

    // 用 AES-256-GCM 对 masterKey 做封装
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv("aes-256-gcm", masterKey, iv);
    const ciphertext = Buffer.concat([cipher.update(plaintextBuffer), cipher.final()]);
    const tag = cipher.getAuthTag();
    const wrappedKeyBase64 = Buffer.concat([iv, tag, ciphertext]).toString("base64");

    // metadata JSON
    const metadata = {
      message_id,
      created_at: new Date().toISOString(),
      status: "ENABLED",
      allowed_ops: ["encrypt", "decrypt"],
      wrapped_key: wrappedKeyBase64
    };

    // 存成 keys/<message_id>.json
    fs.writeFileSync(keyFilePath, JSON.stringify(metadata, null, 2), { mode: 0o600 });

    writeAuditLog(message_id, "encrypt", caller, true);
    return res.json({ message: "Key 創建並 encrypt 成功", message_id });
  } catch (err) {
    console.error(err);
    writeAuditLog(message_id, "encrypt", caller, false, err.message);
    return res.status(500).json({ error: "server內部錯誤，Key encrypt 失敗。" });
  }
});

// ─── 4. DecryptKey 接口 ───────────────────────────────────
app.post("/kms/decrypt", (req, res) => {
  const { message_id, caller } = req.body;
  if (!message_id || !caller) {
    return res.status(400).json({ error: "request 必須包含 message_id 和 caller 兩項。" });
  }

  const keyFilePath = path.join(KEYS_DIR, `${message_id}.json`);
  if (!fs.existsSync(keyFilePath)) {
    writeAuditLog(message_id, "decrypt", caller, false, "Message ID 不存在");
    return res.status(404).json({ error: "指定的 Message ID 在 KMS 中不存在。" });
  }

  // 读取 metadata
  let metadata;
  try {
    metadata = JSON.parse(fs.readFileSync(keyFilePath, "utf-8"));
  } catch (err) {
    writeAuditLog(message_id, "decrypt", caller, false, "讀取 metadata 失敗");
    return res.status(500).json({ error: "讀取 Message metadata 失敗。" });
  }

  if (metadata.status !== "ENABLED") {
    writeAuditLog(message_id, "decrypt", caller, false, `message status: ${metadata.status}`);
    return res.status(403).json({ error: `Message status: ${metadata.status}，無法 decrypt。` });
  }

  try {
    // 拆分 iv/tag/ciphertext
    const blob = Buffer.from(metadata.wrapped_key, "base64");
    const iv = blob.slice(0, 12);
    const tag = blob.slice(12, 28);
    const ciphertext = blob.slice(28);

    // 用 masterKey 解 AES-GCM
    const decipher = crypto.createDecipheriv("aes-256-gcm", masterKey, iv);
    decipher.setAuthTag(tag);
    const plaintextKey = Buffer.concat([decipher.update(ciphertext), decipher.final()]);

    writeAuditLog(message_id, "decrypt", caller, true);
    return res.json({
      message_id,
      plaintext_key_base64: plaintextKey.toString("base64")
    });
  } catch (err) {
    console.error(err);
    writeAuditLog(message_id, "decrypt", caller, false, err.message);
    return res.status(500).json({ error: "decrypt failed，可能是 masterKey 不匹配或數據損壞。" });
  }
});

// ─── 5. 啟動 HTTP 服務 ───────────────────────────────────
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Simple KMS 已啟動，監聽 port ${PORT}`);
  console.log(`Encrypt -> POST http://localhost:${PORT}/kms/encrypt`);
  console.log(`Decrypt -> POST http://localhost:${PORT}/kms/decrypt`);
});
