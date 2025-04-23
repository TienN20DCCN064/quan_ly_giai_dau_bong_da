const btnLuuThayDoi = document.getElementById("button_luu");
const btnTaiLaiTrang = document.getElementById("button_taiLaiTrang");

const maNguoiDung = document.getElementById("maNguoiDung");
const taiKhoan = document.getElementById("taiKhoan");
const hoTen = document.getElementById("hoTen");
const gioiTinh = document.getElementById("gioiTinh");
const email = document.getElementById("email");
const soDienThoai = document.getElementById("soDienThoai");
const ngayTao = document.getElementById("ngayTao");

document.addEventListener("DOMContentLoaded", function () {
    loadDanhSachTaiKhoan();
    viewTbody();
    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);
});

// Hiển thị danh sách người dùng
async function viewTbody() {
    const data = await hamChung.layDanhSach("nguoi_dung");
    console.log(data);
    const tableBody = document.getElementById("dataTable");
    tableBody.innerHTML = "";

    data.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td style="text-align: center;">${item.ma_nguoi_dung}</td>
            <td>${item.tai_khoan}</td>
            <td>${item.ho_ten}</td>
            <td>${item.gioi_tinh}</td>
            <td>${item.email}</td>
            <td>${item.so_dien_thoai}</td>
            <td>${item.ngay_tao}</td>
            <td style="text-align: center;"><button class="edit-btn btn btn-warning btn-sm">Sửa</button></td>
            <td style="text-align: center;"><button class="delete-btn btn btn-danger btn-sm">Xóa</button></td>
        `;
        tableBody.appendChild(row);
    });

    button_sua(data);
    button_xoa(data);
}

// Thêm/Sửa người dùng
async function handleLuuThayDoi(event) {
    event.preventDefault();

    const form = document.getElementById("inputForm");
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    let formData = {};
    if (maNguoiDung.value === "") {
        formData = {
            ma_nguoi_dung: await hamChung.taoID_theoBang("nguoi_dung"),
            // tai_khoan: taiKhoan.value,
            ho_ten: hoTen.value,
            gioi_tinh: gioiTinh.value,
            email: email.value,
            so_dien_thoai: soDienThoai.value,
            ngay_tao: ngayTao.value
        };
    } else {
        formData = {
            ma_nguoi_dung: maNguoiDung.value,
            // tai_khoan: taiKhoan.value,
            ho_ten: hoTen.value,
            gioi_tinh: gioiTinh.value,
            email: email.value,
            so_dien_thoai: soDienThoai.value,
            ngay_tao: ngayTao.value
        };
    }

    // Chỉ thêm `tai_khoan` nếu nó không rỗng
    if (taiKhoan.value.trim() !== "") {
        formData.tai_khoan = taiKhoan.value;
    }

    if (maNguoiDung.value === "") {
        await hamChung.them(formData, "nguoi_dung");
        alert("Thêm thành công!");
    } else {
        await hamChung.sua(formData, "nguoi_dung");
        alert("Sửa thành công!");
    }
    console.log(formData);
    viewTbody();
}

// Xử lý tải lại trang
function handleTaiLaiTrang(event) {
    event.preventDefault();
    location.reload();
}

// Xử lý nút "Sửa"
function button_sua(data) {
    document.querySelectorAll(".edit-btn").forEach((btn, index) => {
        btn.addEventListener("click", () => {
            const item = data[index];
            maNguoiDung.value = item.ma_nguoi_dung;
            taiKhoan.value = item.tai_khoan;
            hoTen.value = item.ho_ten;
            gioiTinh.value = item.gioi_tinh.charAt(0).toUpperCase() + item.gioi_tinh.slice(1);
            email.value = item.email;
            soDienThoai.value = item.so_dien_thoai;
            ngayTao.value = item.ngay_tao;

            
            // Scroll lên đầu trang
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    });
}

// Xử lý nút "Xóa"
function button_xoa(data) {
    document.querySelectorAll(".delete-btn").forEach((btn, index) => {
        btn.addEventListener("click", async () => {
            if (confirm(`Bạn có chắc chắn muốn xóa người dùng ${data[index].tai_khoan}?`)) {
                const formData = { ma_nguoi_dung: data[index].ma_nguoi_dung };
                await hamChung.xoa(formData, "nguoi_dung");
                viewTbody();
            }
        });
    });
}
async function loadDanhSachTaiKhoan() {
    const selectElement = document.getElementById("taiKhoan");
    selectElement.innerHTML = '<option value="">-- Chọn Tài Khoản --</option>'; // Reset danh sách
    const data = await hamChung.layDanhSach("tai_khoan");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.tai_khoan;
        option.textContent = `${item.tai_khoan}`;
        selectElement.appendChild(option);
    });
}