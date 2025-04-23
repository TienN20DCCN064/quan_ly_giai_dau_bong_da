from flask import Flask, request, jsonify
from flask_cors import CORS
import cloudinary
import cloudinary.uploader
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)
port = 5000 ;           # api chạy trên cổng
# Cấu hình Cloudinary
cloudinary.config(
    cloud_name='dyilzwziv',
    api_key='215441275658421',
    api_secret='pMiC5-j_zWwvmOlkgohQ62cyQsY'
)

# Thư mục lưu ảnh Cloudinary tạm thời
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Thư mục lưu ảnh local (cấu hình theo yêu cầu của bạn)
LOCAL_IMAGE_FOLDER = os.path.join("image_local")

os.makedirs(LOCAL_IMAGE_FOLDER, exist_ok=True)

import os
import uuid
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import cloudinary.uploader

@app.route('/api/image', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({"error": "Không tìm thấy file ảnh"}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "Tên file không hợp lệ"}), 400

    try:
        # Lấy tên gốc và xử lý
        filename = secure_filename(file.filename)  # ví dụ: ronaldo.jpg
        name_only = os.path.splitext(filename)[0]  # ronaldo
        public_id = name_only

        # Lưu file tạm để upload
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        # Upload lên Cloudinary và đặt public_id
        result = cloudinary.uploader.upload(filepath, public_id=public_id)

        # Xóa file tạm sau khi upload
        os.remove(filepath)

        return jsonify({
            "imageUrl": result.get('secure_url'),
            "publicId": result.get('public_id'),
            # "originalFilename": result.get('original_filename')
        })
    except Exception as e:
        print(e)
        return jsonify({"error": "Upload thất bại"}), 500

# ✅ Upload ảnh và lưu vào thư mục local /backend/services/global
@app.route('/api/image/<public_id>', methods=['GET'])
def get_image_url(public_id):
    try:
        # Tạo đường dẫn ảnh từ public_id
        url = cloudinary.CloudinaryImage(public_id).build_url()
        print(url)
        
        return jsonify({"imageUrl": url})
    except Exception as e:
        print(e)
        return jsonify({"error": "Không có ảnh trên cloudinary"}), 500
    
@app.route('/api/image/<public_id>', methods=['DELETE'])
def delete_image(public_id):
    try:
        result = cloudinary.uploader.destroy(public_id)
        if result.get("result") == "ok":
            return jsonify({"message": f"Đã xóa ảnh {public_id} thành công"})
        else:
            return jsonify({"error": f"Không thể xóa ảnh: {result.get('result')}"}), 400
    except Exception as e:
        print(e)
        return jsonify({"error": "Lỗi khi xóa ảnh trên Cloudinary"}), 500
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=port)
