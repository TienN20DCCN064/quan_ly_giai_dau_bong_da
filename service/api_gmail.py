from flask import Flask, request, jsonify
from flask_cors import CORS
import smtplib
from email.mime.text import MIMEText

app = Flask(__name__)
CORS(app)
port = 5002

# Cấu hình tài khoản Gmail
EMAIL_SENDER = "vantien18122002@gmail.com"
EMAIL_PASSWORD = "lgez ijzt asgs hpju"  # Mật khẩu ứng dụng mới từ Google
@app.route('/api/send-email', methods=['POST'])
def send_email():
    try:
        # Lấy thông tin từ request body
        data = request.get_json()
        email_receiver = data.get('email_receiver')
        message_text = data.get('message')
        subject = data.get('subject', 'Thông báo từ hệ thống')  # Nếu không có thì dùng mặc định

        # Kiểm tra dữ liệu
        if not email_receiver or not message_text:
            return jsonify({"status": "error", "message": "Thiếu thông tin email hoặc thông điệp!"}), 400

        # Tạo email với thông điệp
        msg = MIMEText(message_text, 'html')
        msg['Subject'] = subject
        msg['From'] = EMAIL_SENDER
        msg['To'] = email_receiver

        # Gửi email qua SMTP của Gmail
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(EMAIL_SENDER, EMAIL_PASSWORD)
            server.sendmail(EMAIL_SENDER, email_receiver, msg.as_string())

        return jsonify({"status": "success", "message": "Đã gửi email thành công!"})

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=port)
