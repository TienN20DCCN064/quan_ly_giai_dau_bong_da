const btnLuuThayDoi = document.getElementById("button_luu");
const btnTaiLaiTrang = document.getElementById("button_taiLaiTrang");

const taiKhoan = document.getElementById("taiKhoan");
const matKhau = document.getElementById("matKhau");

const trangThai = document.getElementById("trangThai");
const maVaiTro = document.getElementById("maVaiTro");

document.addEventListener("DOMContentLoaded", async function () {


    loadDanhSachVaiTro();

    viewTbody();
    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);
});

async function viewTbody() {
    const data = await hamChung.layDanhSach("tai_khoan");
    console.log(data);
    const tableBody = document.getElementById("dataTable");
    tableBody.innerHTML = "";

    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const row = document.createElement("tr");
        const data1vaiTro = await hamChung.layThongTinTheo_ID("vai_tro", item.ma_vai_tro);
        row.innerHTML = `
            <td style="text-align: center;">${item.tai_khoan}</td>
            <td style="text-align: center;">${item.mat_khau}</td>
            <td style="text-align: center;">${item.trang_thai}</td>
            <td style="text-align: center;">${data1vaiTro.ten_vai_tro}</td>
            <td style="text-align: center;"><button class="edit-btn btn btn-warning btn-sm">Sửa</button></td>
            <td style="text-align: center;"><button class="delete-btn btn btn-danger btn-sm">Xóa</button></td>
        `;
        tableBody.appendChild(row);
    }

    button_sua(data);
    button_xoa(data);
}

function button_sua(data) {
    document.querySelectorAll(".edit-btn").forEach((btn, index) => {
        btn.addEventListener("click", () => {
            const item = data[index];
            document.getElementById("taiKhoan").value = item.tai_khoan;
            document.getElementById("matKhau").value = item.mat_khau;
            document.getElementById("trangThai").value = item.trang_thai;
            document.getElementById("maVaiTro").value = item.ma_vai_tro;
        });
    });
}

// Xử lý nút "Xóa"
function button_xoa(data) {
    document.querySelectorAll(".delete-btn").forEach((btn, index) => {
        btn.addEventListener("click", async () => {
            if (confirm(`Bạn có chắc chắn muốn xóa tài khoản ${data[index].tai_khoan}?`)) {
                const formData = { tai_khoan: data[index].tai_khoan };
                await hamChung.xoa(formData, "tai_khoan");
                await viewTbody();
            }
        });
    });
}
// Xử lý tải lại trang
function handleTaiLaiTrang(event) {
    event.preventDefault();
    location.reload();
}

// Thêm/Sửa vai trò
async function handleLuuThayDoi(event) {
    event.preventDefault();

    const form = document.getElementById("inputForm");
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    let formData = {};
    console.log(await hamChung.taoID_theoBang("tai_khoan"));
    if (taiKhoan.value === "") {
        formData = {
            tai_khoan: await hamChung.taoID_theoBang("tai_khoan"),
            mat_khau: matKhau.value,
            trang_thai: trangThai.value,
            ma_vai_tro: maVaiTro.value
        };
        await hamChung.them(formData, "tai_khoan");
        alert("Thêm thành công!");
    } else {
        formData = {
            tai_khoan: taiKhoan.value,
            mat_khau: matKhau.value,
            trang_thai: trangThai.value,
            ma_vai_tro: maVaiTro.value
        };
        await hamChung.sua(formData, "tai_khoan");
        alert("Sửa thành công!");
    }
    console.log(formData);
    viewTbody();
}

async function loadDanhSachVaiTro() {
    const selectElement = document.getElementById("maVaiTro");
    selectElement.innerHTML = '<option value="">-- Chọn Vai Trò --</option>'; // Reset danh sách
    const data = await hamChung.layDanhSach("vai_tro");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_vai_tro;
        option.textContent = `${item.ten_vai_tro}`;
        selectElement.appendChild(option);
    });
}