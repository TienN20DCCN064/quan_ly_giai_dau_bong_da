const btnLuuThayDoi = document.getElementById("button_luu");
const btnTaiLaiTrang = document.getElementById("button_taiLaiTrang");

const maTranDau = document.getElementById("maTranDau");
const maTrongTai = document.getElementById("maTrongTai");
const maLoaiTrongTai = document.getElementById("maLoaiTrongTai");
const form = document.getElementById("inputForm");

const maGiaiDau_chon_viewbody = document.getElementById("maGiaiDau_chon_viewbody");
const maTranDau_chon_viewbody = document.getElementById("maTranDau_chon_viewbody");

document.addEventListener("DOMContentLoaded", function () {
    loadDanhTranDau();
    loadDanhSachTrongTai();
    loadDanhSachLoaiTrongTai();
    loadDanhSachGiaiDau_chon_viewbody();

    viewTbody();
    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);


    maGiaiDau_chon_viewbody.addEventListener("change", async function () {
        console.log(maGiaiDau_chon_viewbody.value);
        // maVongDau_chon_viewbody.value = "All";
        let data = await hamChung.layDanhSach("trong_tai_tran_dau");
        await loadDanhSachTranDauTheoGiaiDau_chon_viewbody(maGiaiDau_chon_viewbody.value);
        viewTbody(data);
    });

    maTranDau_chon_viewbody.addEventListener("change", async function () {
        console.log(maGiaiDau_chon_viewbody.value);
        // maVongDau_chon_viewbody.value = "All";
        let data = await hamChung.layDanhSach("trong_tai_tran_dau");

        viewTbody(data);
    });
});
// Hiển thị danh sách trọng tài
// Hiển thị danh sách trọng tài
async function check_tranDau_thuoc_giaDau_Khong(maTranDau, maGiaiDau) {
    const data = await hamChung.layDanhSach("tran_dau");
    const tranDau = data.find(item => item.ma_tran_dau === maTranDau);
    if (tranDau && tranDau.ma_giai_dau === maGiaiDau) {
        return true; // Trận đấu thuộc giải đấu
    }
    return false; // Trận đấu không thuộc giải đấu

}
async function viewTbody(data) {
    if (data === undefined) {
        data = await hamChung.layDanhSach("trong_tai_tran_dau");
    }
    console.log(data);
    console.log(maGiaiDau_chon_viewbody.value);
    console.log(maTranDau_chon_viewbody.value);
    if (maGiaiDau_chon_viewbody.value !== "All") {
        const filteredData = [];
        for (const item of data) {
            const isValid = await check_tranDau_thuoc_giaDau_Khong(item.ma_tran_dau, maGiaiDau_chon_viewbody.value);
            if (isValid) filteredData.push(item);
        }
        data = filteredData;
    }

    if (maTranDau_chon_viewbody.value !== "All") {
        data = data.filter(item => item.ma_tran_dau === maTranDau_chon_viewbody.value);
    }

    console.log(data);
    const tableBody = document.getElementById("dataTable");
    tableBody.innerHTML = "";

    // Dùng Promise.all để chờ tất cả hình ảnh tải xong
    for (const item of data) {
        const row = document.createElement("tr");
        const lay1TranDau = await hamChung.layThongTinTheo_ID("tran_dau", item.ma_tran_dau);
        const lay1GiaiDau = await hamChung.layThongTinTheo_ID("giai_dau", lay1TranDau.ma_giai_dau);
        const lay1TrongTai = await hamChung.layThongTinTheo_ID("trong_tai", item.ma_trong_tai);
        const lay1LoaiTrongTai = await hamChung.layThongTinTheo_ID("loai_trong_tai", item.ma_loai_trong_tai);

        row.innerHTML = `
            <td style="text-align: center;">${lay1GiaiDau.ten_giai_dau}</td>
            <td style="text-align: center;">${item.ma_tran_dau}</td>
            <td style="text-align: center;">${lay1TrongTai.ho_ten}</td>
            <td style="text-align: center;">${lay1LoaiTrongTai.ten_loai_trong_tai}</td>
            <td style="text-align: center;"><button class="edit-btn btn btn-warning btn-sm">Sửa</button></td>
            <td style="text-align: center;"><button class="delete-btn btn btn-danger btn-sm">Xóa</button></td>
        `;
        tableBody.appendChild(row);
    }

    // Thêm tất cả hàng vào bảng cùng lúc
    // rows.forEach(row => tableBody.appendChild(row));

    // Gán lại sự kiện cho các nút sau khi bảng đã cập nhật
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
        ma_tran_dau: maTranDau.value,
        ma_trong_tai: maTrongTai.value,
        ma_loai_trong_tai: maLoaiTrongTai.value,
    };
    console.log(formData);
    // th đang chỉnh sửa
    if (maTranDau.disabled && maTrongTai.disabled) {
        await hamChung.sua(formData, "trong_tai_tran_dau");
        alert("Sửa thành công!");
    } else
    // th đang thêm mới
    {
        await hamChung.them(formData, "trong_tai_tran_dau");
        alert("Thêm thành công!");
    }
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
            maTranDau.value = item.ma_tran_dau;
            maTrongTai.value = item.ma_trong_tai;
            maLoaiTrongTai.value = item.ma_loai_trong_tai;

            maTranDau.setAttribute("disabled", true);
            maTrongTai.setAttribute("disabled", true);
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
            // if (confirm(`Bạn có chắc chắn muốn xóa loại trọng tài ${data[index].ten_loai_trong_tai}?`)) {
            //     const formData = { ma_loai_trong_tai: data[index].ma_loai_trong_tai };
            //     await hamChung.xoa(formData, "trong_tai_tran_dau");
            //     viewTbody();
            // }
            if (confirm(`Bạn có chắc chắn muốn xóa trọng tài ${data[index].ma_trong_tai} khỏi trận đấu ${data[index].ma_tran_dau}?`)) {
                const formData = {
                    ma_tran_dau: data[index].ma_tran_dau,
                    ma_trong_tai: data[index].ma_trong_tai,
                    ma_loai_trong_tai: data[index].ma_loai_trong_tai
                };
                await hamChung.xoa(formData, "trong_tai_tran_dau");
                viewTbody();
            }
        });
    });
}



async function loadDanhTranDau() {
    const selectElement = document.getElementById("maTranDau");
    selectElement.innerHTML = '<option value="">-- Chọn Trận Đấu --</option>'; // Reset danh sách
    const data = await hamChung.layDanhSach("tran_dau");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_tran_dau;
        option.textContent = `${item.ma_tran_dau}`;
        selectElement.appendChild(option);
    });
}
async function loadDanhSachTrongTai() {
    const selectElement = document.getElementById("maTrongTai");
    selectElement.innerHTML = '<option value="">-- Chọn Trọng Tài --</option>'; // Reset danh sách
    const data = await hamChung.layDanhSach("trong_tai");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_trong_tai;
        option.textContent = `${item.ho_ten}`;
        selectElement.appendChild(option);
    });
}
async function loadDanhSachLoaiTrongTai() {
    const selectElement = document.getElementById("maLoaiTrongTai");
    selectElement.innerHTML = '<option value="">-- Chọn Loại Trọng Tài --</option>'; // Reset danh sách
    const data = await hamChung.layDanhSach("loai_trong_tai");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_loai_trong_tai;
        option.textContent = `${item.ten_loai_trong_tai}`;
        selectElement.appendChild(option);
    });
}

async function loadDanhSachGiaiDau_chon_viewbody() {
    const selectElement = document.getElementById("maGiaiDau_chon_viewbody");
    selectElement.innerHTML = '<option value="All">Tất Cả</option>'; // Reset danh sách
    const data = await hamChung.layDanhSach("giai_dau");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_giai_dau;
        option.textContent = `${item.ten_giai_dau}`;
        selectElement.appendChild(option);
    });
}

async function loadDanhSachTranDauTheoGiaiDau_chon_viewbody(maGiaiDau) {
    const selectElement = document.getElementById("maTranDau_chon_viewbody");
    selectElement.innerHTML = '<option value="All">Tất Cả</option>'; // Reset danh sách
    let data = await hamChung.layDanhSach("tran_dau");
    data = data.filter(item => item.ma_giai_dau === maGiaiDau);
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_tran_dau;
        option.textContent = `${item.ma_tran_dau}`;
        selectElement.appendChild(option);
    });
}
