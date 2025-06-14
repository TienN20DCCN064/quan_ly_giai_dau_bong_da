# 🏆 API - Quản Lý Giải Đấu Bóng Đá

Đây là service backend viết bằng Node.js và MySQL, phục vụ cho Mini App quản lý giải đấu bóng đá. Hướng dẫn dưới đây giúp bạn cài đặt và cấu hình server để chạy trên máy cục bộ và cho phép máy khác trong cùng mạng LAN truy cập được.

---

## 📦 1. Cài đặt thư viện

### ⚙️ Yêu cầu

- Node.js >= 16
- MySQL Server đang chạy và có sẵn database
- phpadmin, xampp

### 🧱 Cài đặt

Mở terminal và chạy:
    npm install express mysql2 cors moment jsonwebtoken
    python -m ensurepip --default-pip
    python -m pip install flask
    python -m pip install flask-cors
    python -m pip install cloudinary




##### 🧱 Chạy
+ Chạy sql trên xampp
+ Mở terminal và chạy:
        ipconfig  lấy  IPv4 Address. . . . . . . . . . . : 192.168.1.40
        Vào file : backend\services\global\global.js  
        Cập nhật : const IPv4_Address =  "192.168.1.40";
+ Chạy API  
          Mở terminal và chạy: cd "C:\Users\vanti\Desktop\tt\quan_ly_tran_dau\service\"
                node api.js
                python api_gmail.py
                python api_image.py
                python api_taoTranDau.py
                

