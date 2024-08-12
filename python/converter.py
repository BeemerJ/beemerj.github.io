from flask import Flask, request, send_file, jsonify
from pydub import AudioSegment
from scipy.io import wavfile
import numpy as np
import os
import zipfile
import io
import logging

app = Flask(__name__, static_folder='..', static_url_path='')

logging.basicConfig(level=logging.DEBUG)

@app.route('/')
def index():
    return app.send_static_file('index.html')

UPLOAD_FOLDER = os.path.join(app.root_path, 'uploads')
PROCESSED_FOLDER = os.path.join(app.root_path, 'processed')

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

def convert_audio(file_path, output_path, channels):
    try:
        app.logger.info(f"Processing audio with channels: {channels}")
        original_audio = AudioSegment.from_file(file_path)
        
        # Set to 8-bit
        original_audio = original_audio.set_sample_width(1)
        original_audio = original_audio.set_frame_rate(11025)
        
        if channels == 'stereo':
            original_audio = original_audio.set_channels(2)
        else:
            original_audio = original_audio.set_channels(1)
        
        # Export as 8-bit WAV
        original_audio.export(output_path, format='wav', parameters=["-acodec", "pcm_u8"])

    except Exception as e:
        app.logger.error(f"Error in convert_audio: {str(e)}")
        raise

@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        files = request.files.getlist('file')
        for file in files:
            file_path = os.path.join(UPLOAD_FOLDER, file.filename)
            file.save(file_path)
        return jsonify({"message": "Files uploaded successfully"}), 200
    except Exception as e:
        app.logger.error(f"Error in upload_file: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/convert', methods=['POST'])
def convert_files():
    try:
        channels = request.json.get('channels', 'mono')
        zip_buffer = io.BytesIO()

        allowed_extensions = ('.mp3', '.wav', '.flac', '.ogg')

        with zipfile.ZipFile(zip_buffer, 'w') as zip_file:
            for file_name in os.listdir(UPLOAD_FOLDER):
                if file_name.lower().endswith(allowed_extensions):
                    input_path = os.path.join(UPLOAD_FOLDER, file_name)
                    output_path = os.path.join(PROCESSED_FOLDER, file_name.rsplit('.', 1)[0] + '.wav')
                    try:
                        convert_audio(input_path, output_path, channels)
                        zip_file.write(output_path, os.path.basename(output_path))
                    except Exception as e:
                        app.logger.error(f"Error converting {file_name}: {str(e)}")

        zip_buffer.seek(0)
        return send_file(zip_buffer, mimetype='application/zip', as_attachment=True, download_name='converted_audio.zip')
    except Exception as e:
        app.logger.error(f"Error in convert_files: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)