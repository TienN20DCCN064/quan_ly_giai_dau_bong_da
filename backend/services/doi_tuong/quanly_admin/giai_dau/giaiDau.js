const btnLuuThayDoi = document.getElementById("button_luu");
const btnTaiLaiTrang = document.getElementById("button_taiLaiTrang");

const maGiaiDau = document.getElementById("maGiaiDau");
const tenGiaiDau = document.getElementById("tenGiaiDau");
const tenToChuc = document.getElementById("tenToChuc");
const ngayBatDau = document.getElementById("ngayBatDau");
const ngayKetThuc = document.getElementById("ngayKetThuc");
const maGioiTinh = document.getElementById("maGioiTinh");
const moTa = document.getElementById("moTa");

document.addEventListener("DOMContentLoaded", function () {
    viewTbody();
    // Gán sự kiện cho nút
    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);
});

// Hiển thị danh sách giải đấu
async function viewTbody() {
    const data = await hamChung.layDanhSach("giai_dau"); // Lấy danh sách giải đấu
    console.log(data);
    const tableBody = document.getElementById("dataTable");
    tableBody.innerHTML = "";

    data.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td style="text-align: center;">${item.ma_giai_dau}</td>
            <td style="text-align: center;">${item.ten_giai_dau}</td>
            <td style="text-align: center;">${item.ten_to_chuc}</td>
            <td style="text-align: center;">${item.ngay_bat_dau}</td>
            <td style="text-align: center;">${item.ngay_ket_thuc}</td>
            <td style="text-align: center;">${item.gioi_tinh}</td>
            <td style="text-align: center;">${item.mo_ta || ""}</td>
            <td style="text-align: center;"><button class="edit-btn btn btn-warning btn-sm">Sửa</button></td>
            <td style="text-align: center;"><button class="delete-btn btn btn-danger btn-sm">Xóa</button></td>
        `;
        tableBody.appendChild(row);
    });

    button_sua(data);
    button_xoa(data);


}
async function handleLuuThayDoi(event) {
    event.preventDefault(); // Ngăn chặn form reload

    const form = document.getElementById("inputForm");

    // Kiểm tra xem form có hợp lệ không
    if (!form.checkValidity()) {
        form.reportValidity(); // Hiển thị thông báo lỗi nếu có ô chưa điền
        return; // Dừng hàm nếu form không hợp lệ
    }

    let formData = {};
    if (maGiaiDau.value === "") {
        formData = {
            ma_giai_dau: await hamChung.taoID_theoBang("giai_dau"),
            ten_giai_dau: tenGiaiDau.value,
            ten_to_chuc: tenToChuc.value,
            ngay_bat_dau: ngayBatDau.value,
            ngay_ket_thuc: ngayKetThuc.value,
            gioi_tinh: maGioiTinh.value,
            mo_ta: moTa.value
        };
        console.log("dang them " + await hamChung.taoID_theoBang("giai_dau"));
    } else {
        formData = {
            ma_giai_dau: maGiaiDau.value,
            ten_giai_dau: tenGiaiDau.value,
            ten_to_chuc: tenToChuc.value,
            ngay_bat_dau: ngayBatDau.value,
            ngay_ket_thuc: ngayKetThuc.value,
            gioi_tinh: maGioiTinh.value,
            mo_ta: moTa.value
        };
        console.log("dang xóa");
    }
    if (maGiaiDau.value === "") {
        await hamChung.them(formData, "giai_dau");
        alert("Thêm thành công!");
        viewTbody(); // Refresh danh sách sau khi thêm
        // Reset form
    }
    // Sửa dữ liệu
    else {
        await hamChung.sua(formData, "giai_dau");
        alert("Sửa thành công!");
        viewTbody(); // Refresh danh sách sau khi sửa
    }

    console.log("Thông tin từ ô nhập:", formData);
}

// Hàm xử lý tải lại trang
function handleTaiLaiTrang(event) {
    event.preventDefault();
    location.reload(); // Bỏ comment dòng này nếu muốn tải lại trang
}


// Xử lý nút "Sửa"
function button_sua(data) {
    document.querySelectorAll(".edit-btn").forEach((btn, index) => {
        btn.addEventListener("click", () => {
            const item = data[index];
            maGiaiDau.value = item.ma_giai_dau;
            tenGiaiDau.value = item.ten_giai_dau;
            tenToChuc.value = item.ten_to_chuc;
            ngayBatDau.value = item.ngay_bat_dau;
            ngayKetThuc.value = item.ngay_ket_thuc;
            maGioiTinh.value = item.gioi_tinh;
            moTa.value = item.mo_ta || "";



            
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
            if (confirm(`Bạn có chắc chắn muốn xóa giải đấu "${data[index].ten_giai_dau}"?`)) {
                const formData = {
                    ma_giai_dau: data[index].ma_giai_dau,
                };
                await hamChung.xoa( formData, "giai_dau");
                viewTbody(); // Refresh danh sách sau khi xóa
            }
        });
    });
}
