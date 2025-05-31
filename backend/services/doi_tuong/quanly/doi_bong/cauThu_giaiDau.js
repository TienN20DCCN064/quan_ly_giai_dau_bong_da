const btnLuuThayDoi = document.getElementById("button_luu");
const btnTaiLaiTrang = document.getElementById("button_taiLaiTrang");

const maCauThu = document.getElementById("maCauThu");
const maDoiBong = document.getElementById("maDoiBong");
const maGiaiDau = document.getElementById("maGiaiDau");

document.addEventListener("DOMContentLoaded", function () {
    loadDanhSachCauThu();
    loadDanhSachDoiBong();
    loadDanhSachGiaiDau();
    viewTbody();
    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);
});

// Hiển thị danh sách cầu thủ trong giải đấu
async function viewTbody() {
    const data = await hamChung.layDanhSach("cau_thu_giai_dau");
    console.log(data);
    const tableBody = document.getElementById("dataTable");
    tableBody.innerHTML = "";

    data.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td style="text-align: center;">${item.ma_cau_thu}</td>
            <td style="text-align: center;">${item.ma_doi_bong}</td>
            <td style="text-align: center;">${item.ma_giai_dau}</td>
            <td style="text-align: center;"><button class="edit-btn btn btn-warning btn-sm">Sửa</button></td>
            <td style="text-align: center;"><button class="delete-btn btn btn-danger btn-sm">Xóa</button></td>
        `;
        tableBody.appendChild(row);
    });

    button_sua(data);
    button_xoa(data);
}

// Thêm/Sửa cầu thủ trong giải đấu
async function handleLuuThayDoi(event) {
    event.preventDefault();

    const form = document.getElementById("inputForm");
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    let formData = {
        ma_cau_thu: maCauThu.value,
        ma_doi_bong: maDoiBong.value,
        ma_giai_dau: maGiaiDau.value
    };
    // th đang chỉnh sửa
    if (maCauThu.disabled && maGiaiDau.disabled) {
        await hamChung.sua(formData, "cau_thu_giai_dau");
        alert("Sửa thành công!");
    } else 
    // th đang thêm mới
    {
        await hamChung.them(formData, "cau_thu_giai_dau");
        alert("Thêm thành công!");
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
            maCauThu.value = item.ma_cau_thu;
            maDoiBong.value = item.ma_doi_bong;
            maGiaiDau.value = item.ma_giai_dau;
            // Ngăn không cho thay đổi
            maCauThu.setAttribute("disabled", true);
            maGiaiDau.setAttribute("disabled", true);
        });
    });
}

// Xử lý nút "Xóa"
function button_xoa(data) {
    document.querySelectorAll(".delete-btn").forEach((btn, index) => {
        btn.addEventListener("click", async () => {
            if (confirm(`Bạn có chắc chắn muốn xóa cầu thủ ${data[index].ma_cau_thu} khỏi giải đấu?`)) {
                const formData = {
                    ma_cau_thu: data[index].ma_cau_thu,
                    ma_giai_dau: data[index].ma_giai_dau
                };
                await hamChung.xoa(formData, "cau_thu_giai_dau");
                viewTbody();
            }
        });
    });
}





async function loadDanhSachCauThu() {
    const selectElement = document.getElementById("maCauThu");
    selectElement.innerHTML = '<option value="">-- Chọn cầu thủ --</option>'; // Reset danh sách
    const data = await hamChung.layDanhSach("cau_thu");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_cau_thu;
        option.textContent = `${item.ma_cau_thu} - ${item.ho_ten}`;
        selectElement.appendChild(option);
    });
}
async function loadDanhSachDoiBong() {
    const selectElement = document.getElementById("maDoiBong");
    selectElement.innerHTML = '<option value="">-- Chọn Đội Bong --</option>'; // Reset danh sách
    const data = await hamChung.layDanhSach("doi_bong");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_doi_bong;
        option.textContent = `${item.ma_doi_bong} - ${item.ten_doi_bong}`;
        selectElement.appendChild(option);
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
