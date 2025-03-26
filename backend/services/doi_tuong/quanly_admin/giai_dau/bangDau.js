const btnLuuThayDoi = document.getElementById("button_luu");
const btnTaiLaiTrang = document.getElementById("button_taiLaiTrang");

const maBangDau = document.getElementById("maBangDau");
const tenBangDau = document.getElementById("tenBangDau");
const maGiaiDau = document.getElementById("maGiaiDau");

document.addEventListener("DOMContentLoaded", function () {
    loadDanhSachGiaiDau();
    viewTbody();
    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);
});

// Hiển thị danh sách bảng đấu
async function viewTbody() {
    const data = await hamChung.layDanhSach("bang_dau");
    console.log(data);
    const tableBody = document.getElementById("dataTable");
    tableBody.innerHTML = "";

    data.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
           <td style="text-align: center;">${item.ma_giai_dau}</td>
            <td style="text-align: center;">${item.ma_bang_dau}</td>
            <td style="text-align: center;">${item.ten_bang_dau}</td>
            <td style="text-align: center;"><button class="edit-btn btn btn-warning btn-sm">Sửa</button></td>
            <td style="text-align: center;"><button class="delete-btn btn btn-danger btn-sm">Xóa</button></td>
        `;
        tableBody.appendChild(row);
    });

    button_sua(data);
    button_xoa(data);
}

// Thêm/Sửa bảng đấu
async function handleLuuThayDoi(event) {
    event.preventDefault(); // Ngăn chặn reload

    const form = document.getElementById("inputForm");

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    if (!maGiaiDau.value) {
        alert("Vui lòng chọn một giải đấu!");
        return;
    }


    let formData = {};
    if (maBangDau.value === "") {
        formData = {
            ma_bang_dau: await hamChung.taoID_theoBang("bang_dau"),
            ten_bang_dau: tenBangDau.value,
            ma_giai_dau: maGiaiDau.value
        };
        await hamChung.them(formData, "bang_dau");
        alert("Thêm thành công!");
    } else {
        formData = {
            ma_bang_dau: maBangDau.value,
            ten_bang_dau: tenBangDau.value,
            ma_giai_dau: maGiaiDau.value
        };
        await hamChung.sua(formData, "bang_dau");
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
            maBangDau.value = item.ma_bang_dau;
            tenBangDau.value = item.ten_bang_dau;
            maGiaiDau.value = item.ma_giai_dau;
        });
    });
}

// Xử lý nút "Xóa"
function button_xoa(data) {
    document.querySelectorAll(".delete-btn").forEach((btn, index) => {
        btn.addEventListener("click", async () => {
            if (confirm(`Bạn có chắc chắn muốn xóa bảng đấu "${data[index].ten_bang_dau}"?`)) {
                const formData = { ma_bang_dau: data[index].ma_bang_dau };
                await hamChung.xoa(formData, "bang_dau");
                viewTbody();
            }
        });
    });
}

async function loadDanhSachGiaiDau() {
    const selectElement = document.getElementById("maGiaiDau");
    selectElement.innerHTML = '<option value="">-- Chọn Mã Giải Đấu --</option>'; // Reset danh sách
    const data = await hamChung.layDanhSach("giai_dau");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_giai_dau;
        option.textContent = `${item.ma_giai_dau} - ${item.ten_giai_dau}`;
        selectElement.appendChild(option);
    });
}