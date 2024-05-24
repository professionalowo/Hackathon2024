import requests

data = {
    'text': 'What is failed going to goal mean?',
    'previous_summary': 'previous summary here'  # optional
}

response = requests.post('http://127.0.0.1:5000/query', json=data)

print("Status code:", response.status_code)
print("Response text:", response.text)

try:
    print(response.json())
except Exception as e:
    print("Error decoding JSON:", e)