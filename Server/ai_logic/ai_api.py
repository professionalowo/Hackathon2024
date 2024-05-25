from flask import Flask, request, jsonify
import ai_backend_main

app = Flask(__name__)


@app.route('/query', methods=['POST'])
def query():
    data = request.get_json()
    text = data.get('text')
    previous_summary = data.get('previous_summary', None)
    result = ai_backend_main.user_input(text, previous_summary)
    if isinstance(result, set):
        result = list(result)
    return jsonify(result)


if __name__ == '__main__':
    app.run(port=5000, debug=True)
