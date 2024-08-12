from flask import Flask, request, send_file, jsonify
from pydub import AudioSegment
from scipy.io import wavfile
import numpy as np
import os
import zipfile
import io

app = Flask(__name__, static_folder='..', static_url_path='')

@app.route('/')
def index():
    return app.send_static_file('index.html')

UPLOAD_FOLDER = 'uploads'
PROCESSED_FOLDER = 'processed'

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

def convert_audio(file_path, output_path, channels):
    original_audio = AudioSegment.from_file(file_path)
    original_peak = original_audio.max_dBFS
    
    target_peak = -0.1 # slightly below 0 dBFS to avoid clipping...
    
    gain_adjustment = target_peak - original_peak
    
    adjusted_audio = original_audio.apply_gain(gain_adjustment)

    adjusted_audio = adjusted_audio.set_frame_rate(11025)
    adjusted_audio = adjusted_audio.set_sample_width(1)
    
    if channels == 'mono':
        adjusted_audio = adjusted_audio.set_channels(1)
    elif channels == 'stereo':
        adjusted_audio = adjusted_audio.set_channels(2)
    
    samples = np.array(adjusted_audio.get_array_of_samples())
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