// 假設 KMS 啟動在 http://localhost:4000

async function callKmsDecrypt(message_id, caller) {
  const body = {
    message_id: message_id,
    caller: caller
  };

  const res = await fetch("http://localhost:4000/kms/decrypt", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`KMS Decrypt fail: ${res.status} ${res.statusText} ${JSON.stringify(err)}`);
  }
  const json = await res.json();
  // json { key_id: "key-alice", plaintext_key_base64: "<E1_Base64>" }
  return json.plaintext_key_base64;
}

(async () => {
  try {
    const message_id = "key-alice";
    const caller = "chat-backend";

    const e1Base64 = await callKmsDecrypt(message_id, caller);
    console.log("KMS Decrypt 成功，key (Base64) =", e1Base64);

  } catch (err) {
    console.error("Call KMS Encrypt fail：", err.message);
  }
})();
