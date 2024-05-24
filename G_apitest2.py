import requests

url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyAy7c85dW4Yhuew2yeFP2wkQ5JynZYmWyk'
headers = {
    'Content-Type': 'application/json'
}
data = {
    "contents": [
        {
            "parts": [
                {
                    "text": "Explain how AI works"
                }
            ]
        }
    ]
}

response = requests.post(url, headers=headers, json=data)

print(response.status_code)
print(response.json())
