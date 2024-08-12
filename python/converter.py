from flask import Flask, request, send_file, jsonify
from pydub import AudioSegment
from scipy.io import wavfile
import numpy as np
import os
import zipfile
import io

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
PROCESSED_FOLDER = 'processed'

# Ensure the upload and processed folders exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

def convert_audio(file_path, output_path, channels):
    audio = AudioSegment.from_file(file_path)
    audio = audio.set_frame_rate(11025)
    audio = audio.set_sample_width(1)
    if channels == 'mono':
        audio = audio.set_channels(1)
    elif channels == 'stereo':
        audio = audio.set_channels(2)
    
    samples = np.array(audio.get_array_of_samples())
    wavfile.write(output_path, 11025, samples)

@app.route('/upload', methods=['POST'])
def upload_file():
    files = request.files.getlist('file')
    for file in files:
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)
    return '', 204

@app.route('/convert', methods=['POST'])
def convert_files():
    channels = request.json.get('channels', 'mono')
    zip_buffer = io.BytesIO()

    with zipfile.ZipFile(zip_buffer, 'w') as zip_file:
        for file_name in os.listdir(UPLOAD_FOLDER):
            input_path = os.path.join(UPLOAD_FOLDER, file_name)
            output_path = os.path.join(PROCESSED_FOLDER, file_name.replace('.', '_converted.'))
            convert_audio(input_path, output_path, channels)
            zip_file.write(output_path, os.path.basename(output_path))

    zip_buffer.seek(0)
    return send_file(zip_buffer, mimetype='application/zip', as_attachment=True, download_name='converted_audio.zip')

if __name__ == '__main__':
    app.run(debug=True)