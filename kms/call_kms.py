import requests

def call_kms_encrypt():
    url = "http://localhost:4000/kms/encrypt"
    payload = {
        "message_id": "pythonKey1",
        "caller": "PythonTestClient",
        "key": "QmFzZTY0RW5jb2RlZElFMQBB" 
    }
    headers = {"Content-Type": "application/json"}

    resp = requests.post(url, json=payload, headers=headers)
    if not resp.ok:
        print("Encrypt fail：", resp.status_code, resp.text)
        return None

    data = resp.json()
    print("Encrypt return：", data)
    return data

def call_kms_decrypt():
    url = "http://localhost:4000/kms/decrypt"
    payload = {
        "message_id": "pythonKey1",
        "caller": "PythonTestClient"
    }
    headers = {"Content-Type": "application/json"}

    resp = requests.post(url, json=payload, headers=headers)
    if not resp.ok:
        print("Decrypt fail：", resp.status_code, resp.text)
        return None

    data = resp.json()
    print("Decrypt return：", data)
    return data

if __name__ == "__main__":
    print("=== call KMS Encrypt ===")
    call_kms_encrypt()

    print("\n=== call KMS Decrypt ===")
    call_kms_decrypt()
