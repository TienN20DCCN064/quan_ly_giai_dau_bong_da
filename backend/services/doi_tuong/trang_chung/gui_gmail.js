// Lấy query hiện tại




document.addEventListener("DOMContentLoaded", function () {
    const url = new URL(window.location.href);
    const params = url.searchParams;

    const btnQuenMatKhau = document.getElementById("btn_quenMatKhau");
    const btnQuayLai = document.getElementById("btn_quayLaiDangNhap");

    // Kiểm tra và thêm param mặc định nếu chưa có
    if (!params.has('trangThai')) {
        params.set('trangThai', "dangNhap"); // Thêm mặc định
        window.location.href = `${url.pathname}?${params.toString()}`;
    }
    if (btnQuenMatKhau) {
        btnQuenMatKhau.addEventListener("click", function () {
            params.set('trangThai', "quenMatKhau");
            window.location.href = `${url.pathname}?${params.toString()}`;
        });
    }

    if (btnQuayLai) {
        btnQuayLai.addEventListener("click", function () {
            params.set('trangThai', "dangNhap");
            window.location.href = `${url.pathname}?${params.toString()}`;
        });
    }


    const trangThai = params.get('trangThai');
    const formDangNhap = document.getElementById("form_dangNhap");
    const formQuenMK = document.getElementById("form_quenMK");

    if (trangThai == "dangNhap") {
        console.log("trang thai dang nhap");
        formDangNhap.style.display = "block";
        formQuenMK.style.display = "none";
        viewTrangThai_dangNhap();
    } else if (trangThai == "quenMatKhau") {
        console.log("trang thai lay mat khau");
        formDangNhap.style.display = "none";
        formQuenMK.style.display = "block";
        viewTrangThai_layMatKhau();
    }
});



// Hàm gửi email thông qua API của server
function sendEmail(nguoiDung) {
    const emailReceiver = nguoiDung.email_receiver; // Lấy email người nhận từ đối tượng nguoiDung
    const message = `Mật khẩu mới của bạn là: ${nguoiDung.message}`; // Soạn thông điệp

    // Gửi yêu cầu POST đến server Flask
    fetch('http://localhost:5003/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email_receiver: emailReceiver,
            message: message
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert("Mật khẩu mới của bạn được gửi vào Gmail! " + nguoiDung.email);
            } else {
                alert("Lỗi gửi email: " + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Đã xảy ra lỗi khi gửi email.");
        });
}