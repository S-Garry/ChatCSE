// 假設 KMS 啟動在 http://localhost:4000

async function callKmsEncrypt(message_id, caller, key) {

  const body = {
    message_id: message_id,
    caller: caller,
    key: key
  };

  const res = await fetch("http://localhost:4000/kms/encrypt", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`KMS Encrypt fail: ${res.status} ${res.statusText} ${JSON.stringify(err)}`);
  }
  return res.json();
}


(async () => {
  try {
    const message_id = "key-alice";
    const caller = "chat-backend";

    const key = "QmFzZTY0RW5jb2RlZElFMQAA";

    const result = await callKmsEncrypt(message_id, caller, key);
    console.log("KMS Encrypt 成功，返回：", result);
  } catch (err) {
    console.error("Call KMS Encrypt fail：", err.message);
  }
})();
