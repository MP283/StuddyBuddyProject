import os
from werkzeug.utils import secure_filename
from config import UPLOAD_FOLDER, ALLOWED_EXTENSIONS

# Ensure upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    """
    Check if the file has an allowed extension (PDF).
    """
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_file(file_storage):
    """
    Save an uploaded file to the uploads folder.
    :param file_storage: Flask's FileStorage object from request.files
    :return: Path where file is saved (relative to uploads folder)
    """
    if file_storage and allowed_file(file_storage.filename):
        filename = secure_filename(file_storage.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file_storage.save(file_path)
        return file_path
    else:
        raise ValueError("Invalid file type. Only PDF allowed.")

def get_file(file_path):
    """
    Return the absolute path of a stored file.
    Useful for sending files back to frontend.
    """
    abs_path = os.path.abspath(file_path)
    if os.path.exists(abs_path):
        return abs_path
    else:
        raise FileNotFoundError("File not found.")