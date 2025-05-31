// Gắn sự kiện submit cho form
const form = document.getElementById("form_userInfo");
// Khi DOM đã sẵn sàng
document.addEventListener("DOMContentLoaded", async () => {
    console.log(GlobalStore.getUsername());

    if (GlobalStore.getUsername() === null) {
        const url = "/frontend/view/login.html";
        window.location.href = url;
    }
    // Lấy dữ liệu từ các input
    const dataNguoiDung = await hamChung.layDanhSach("nguoi_dung");

    // Tìm một người dùng có tài khoản là 'admin'
    const data1NguoiDung = dataNguoiDung.find(item => item.tai_khoan === GlobalStore.getUsername());
    // Kiểm tra kết quả
    if (data1NguoiDung) {
        document.getElementById("ho_ten").value = data1NguoiDung.ho_ten;
        document.getElementById("gioi_tinh").value = data1NguoiDung.gioi_tinh;
        document.getElementById("email").value = data1NguoiDung.email;
        document.getElementById("so_dien_thoai").value = data1NguoiDung.so_dien_thoai;

    } else {
        console.log("Không tìm thấy người dùng!");
    }
    console.log(data1NguoiDung);

    form.addEventListener("submit", async function (e) {
        e.preventDefault(); // Ngăn form submit mặc định


        const hoTen = document.getElementById("ho_ten").value.trim();
        const gioiTinh = document.getElementById("gioi_tinh").value;
        const email = document.getElementById("email").value.trim();
        const soDienThoai = document.getElementById("so_dien_thoai").value.trim();

        let formData = {
            ma_nguoi_dung: data1NguoiDung.ma_nguoi_dung,
            ho_ten: hoTen,
            gioi_tinh: gioiTinh,
            email: email,
            so_dien_thoai: soDienThoai,
        }
        await hamChung.sua(formData, "nguoi_dung");
        alert("Sửa thông tin thành công!");
        console.log(formData);
    });
});