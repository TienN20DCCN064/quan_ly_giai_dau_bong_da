document.getElementById("form_changePassword").addEventListener("submit", async function (e) {
    e.preventDefault(); // Ngăn submit form mặc định
    const url = "/frontend/view/login.html";
    if (GlobalStore.getUsername() === null) {

        window.location.href = url;
    }
    const oldPass = document.getElementById("old_password").value.trim();
    const newPass = document.getElementById("new_password").value.trim();
    const confirm = document.getElementById("confirm_password").value.trim();
    const data1TaiKhoan = await hamChung.layThongTinTheo_ID("tai_khoan", GlobalStore.getUsername());
    if (newPass !== confirm) {
        alert("Mật khẩu mới và xác nhận không khớp!");
        return;
    }
    if (oldPass !== data1TaiKhoan.mat_khau) {
        alert("Mật khẩu không chính xác!");
        return;
    }
    if (oldPass === newPass) {
        alert("Mật khẩu mới giống mật khẩu hiện tại!");
        return;
    }

    console.log(data1TaiKhoan);
    // Gửi dữ liệu đổi mật khẩu tới API (ví dụ)
    const formData = {
        tai_khoan: GlobalStore.getUsername(),
        mat_khau: newPass
    };
    await hamChung.sua(formData, "tai_khoan");
    alert("Sửa thông tin thành công!");
    console.log(formData);

    window.location.href = url;
});
