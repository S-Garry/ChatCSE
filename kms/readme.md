# KMS 啟動流程

## server 啟動

1. run `node init_kms_master_key.js`
1. run `npm init -y`

    會新增一個 `package.json`，需要點進去改東西。裡面會有一項是`"scripts"`

    把 
    ```
    "test": "echo \"Error: no test specified\" && exit 1"
    ```
    改成
    ```
    "start": "node kms.js"
    ```
1. run `npm start`
    
    如果出現 `Error: Cannot find module 'express'` 的話需要 run `npm install express body-parser`

    成功啟動則會顯示
    ```
    Simple KMS 已啟動，監聽 port 4000
    Encrypt -> POST http://localhost:4000/kms/encrypt
    Decrypt -> POST http://localhost:4000/kms/decrypt
    ```


    

## Encrypt / Decrypt

### .js
- encrypt

    `node call_encrypt.js`
- decrypt

    `node call_decrypt.js`

### .py
- 看一下 `call_kms.py`

    encrypt 成功 預期會 return

    `Encrypt return： {'message': 'Key 創建並 encrypt 成功', 'message_id': 'pythonKey1'}`

    decrypt 成功 預期會 return

    `Decrypt return： {'message_id': 'pythonKey1', 'plaintext_key_base64': 'QmFzZTY0RW5jb2RlZElFMQBB'}`
