import fs from 'fs'

export async function uploadAudio(file: string) {
    return new Promise<string>((res) => {
        fs.readFile(file, (err, data) => {
            if (err) {
                return console.log(err);
            }
            fetch('https://api.assemblyai.com/v2/upload', {
                body: data,
                method: 'POST',
                headers: {
                    "Authorization": import.meta.env.VITE_ASSEMBLY_API_KEY,
                    "Transfer-Encoding": "chunked"
                }
            })
                .then(response => response.json())
                .then(data => {
                    res(data['upload_url']);
                    console.log(`URL: ${data['upload_url']}`)
                })
                .catch((error) => {
                    console.error(`Error: ${error}`);
                });
        })
    });
}

import { AssemblyAI } from 'assemblyai'

const client = new AssemblyAI({
    apiKey: import.meta.env.VITE_ASSEMBLY_API_KEY
})
export async function transcripeAudio(url: string) {
    const params = {
        audio: url,
        speaker_labels: true
    };
    const transcript = await client.transcripts.transcribe(params)
    return transcript;
}
