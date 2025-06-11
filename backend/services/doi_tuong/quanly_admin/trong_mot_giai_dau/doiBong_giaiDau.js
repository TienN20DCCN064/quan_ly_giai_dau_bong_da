const btnLuuThayDoi = document.getElementById("button_luu");
const btnTaiLaiTrang = document.getElementById("button_taiLaiTrang");


const maDoiBong = document.getElementById("maDoiBong");
const maGiaiDau = document.getElementById("maGiaiDau");
const tenDoiBong = document.getElementById("tenDoiBong");

const hinhAnh = document.getElementById("logo");
const inputFile = document.getElementById("logoFile");

const form = document.getElementById("inputForm");
const quocGia = document.getElementById("quocGia");
const hatGiong = document.getElementById("hatGiong");

const maBangDau = document.getElementById("maBangDau");

const maGiaiDau_chon_viewbody = document.getElementById("maGiaiDau_chon_viewbody");
const maBangDau_chon_viewbody = document.getElementById("maBangDau_chon_viewbody");


const btnLocDanhSach = document.getElementById("button_locDanhSach");
const popupOverlay = document.getElementById("popupOverlay");
const closePopup = document.getElementById("closePopup");



document.addEventListener("DOMContentLoaded", function () {

    loadDanhSachDoiBong();
    loadDanhSachGiaiDau();
    loadDanhSachGiaiDau_chon_viewbody();
    viewTbody();
    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);
    document.getElementById("maGiaiDau").addEventListener("change", (e) => {
        loadDanhSachBangDau();
    });


    btnLocDanhSach.addEventListener("click", handle_view_locDanhSach);

    maGiaiDau_chon_viewbody.addEventListener("change", async function () {
        console.log(maGiaiDau_chon_viewbody.value);
        // maDoiBong_chon_viewbody.value = "All";
        // await loadDanhSachDoiBongTheoGiaiDau_chon_viewbody(maGiaiDau_chon_viewbody.value);
        await loadDanhSachBangDau_chon_viewbody(maGiaiDau_chon_viewbody.value);
        const data = await hamChung.layDanhSach("doi_bong_giai_dau");
        viewTbody(data);
    });
    maBangDau_chon_viewbody.addEventListener("change", async function () {
        console.log(maBangDau_chon_viewbody.value);
        // maGiaiDau_chon_viewbody.value = "All";
        const data = await hamChung.layDanhSach("doi_bong_giai_dau");
        viewTbody(data);
    });

});

// Hiển thị danh sách cầu thủ trong giải đấu
async function viewTbody(data) {
    if (data === undefined) {
        data = await hamChung.layDanhSach("doi_bong_giai_dau");

    }
    console.log(data);
    console.log(maGiaiDau_chon_viewbody.value);
    console.log(maBangDau_chon_viewbody.value);
    if (maGiaiDau_chon_viewbody.value !== "All") {
        data = data.filter(item => item.ma_giai_dau === maGiaiDau_chon_viewbody.value);
    }

    if (maBangDau_chon_viewbody.value !== "All") {
        data = data.filter(item => item.ma_bang_dau === maBangDau_chon_viewbody.value);
    }
    // Giới hạn chỉ lấy 20 cầu thủ
    data = data.slice(0, 20);
    const tableBody = document.getElementById("dataTable");
    tableBody.innerHTML = "";

    for (const item of data) {
        // const hinh_anh = await hamChung.getImage(item.hinh_anh);
        // console.log(item.hinh_anh);
        let hinh_anh;
        const row = document.createElement("tr");
        // C:\Users\vanti\Desktop\quan_ly_tran_dau\frontend\public\images\cat-2.png

        if (item.logo === null) {
            hinh_anh = "/frontend/public/images/cat-2.png";
        } else {
            hinh_anh = await hamChung.getImage(item.logo);

        }

        let bangDau = "---";
        if (item.ma_bang_dau != null) {
            const lay1BangDau = await hamChung.layThongTinTheo_ID("bang_dau", item.ma_bang_dau);
            bangDau = lay1BangDau.ten_bang_dau;
        }



        const lay1giaiDau = await hamChung.layThongTinTheo_ID("giai_dau", item.ma_giai_dau);
        const lay1doiBong = await hamChung.layThongTinTheo_ID("doi_bong", item.ma_doi_bong);
        console.log(item.ma_doi_bong);
        row.innerHTML = `
            <td style="text-align: center;">${lay1giaiDau.ten_giai_dau}</td>
            <td style="text-align: center;">${bangDau}</td>
            <td style="text-align: center;">${lay1doiBong.ten_doi_bong}</td>
            <td style="text-align: center;">${item.ten_doi_bong}</td>
            <td style="text-align: center;">${item.quoc_gia}</td>
            
            <td style="text-align: center;">${item.hat_giong}</td>
            <td style="text-align: center;"><img src="${hinh_anh}" alt="Logo" width="50"></td>
            <td style="text-align: center;"><button class="edit-btn btn btn-warning btn-sm">Sửa</button></td>
            <td style="text-align: center;"><button class="delete-btn btn btn-danger btn-sm">Xóa</button></td>
        `;
        tableBody.appendChild(row);
    }

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
    let id_Hinh_anh_thay = "";
    if (inputFile.value === "")
        id_Hinh_anh_thay = hinhAnh.value;
    else {
        id_Hinh_anh_thay = inputFile.files[0].name; // Lấy tệp đầu tiên (nếu có)
    }
    id_Hinh_anh_thay = hamChung.doiKhoangTrangThanhGachDuoi(id_Hinh_anh_thay);
    console.log(id_Hinh_anh_thay);

    let formData = {
        ma_doi_bong: maDoiBong.value,
        ma_giai_dau: maGiaiDau.value,
        ma_bang_dau: maBangDau.value,
        ten_doi_bong: tenDoiBong.value,
        quoc_gia: quocGia.value,
        hat_giong: hatGiong.value,
        logo: id_Hinh_anh_thay
    };
    // th đang chỉnh sửa
    console.log(maBangDau.value);
    if (maBangDau.value === "") {
        delete formData.ma_bang_dau
    }
    if (maDoiBong.disabled && maGiaiDau.disabled) {
        await hamChung.sua(formData, "doi_bong_giai_dau");
        alert("Sửa thành công!");
    } else
    // th đang thêm mới
    {
        await hamChung.them(formData, "doi_bong_giai_dau");
        alert("Thêm thành công!");
    }
    // console.log(formData);
    // viewTbody();
    if (inputFile.value != "") {
        await hamChung.uploadImage(inputFile.files[0]);
    }
    await viewTbody();
}

// Xử lý tải lại trang
function handleTaiLaiTrang(event) {
    event.preventDefault();
    location.reload();
}
async function button_sua(data) {
    document.querySelectorAll(".edit-btn").forEach((btn, index) => {
        btn.addEventListener("click", async () => {
            inputFile.value = "";
            const item = data[index];

            maGiaiDau.value = item.ma_giai_dau;
            await loadDanhSachBangDau();  // 🔹 Đợi load xong danh sách bảng đấu

            maDoiBong.value = item.ma_doi_bong;
            tenDoiBong.value = item.ten_doi_bong;
            quocGia.value = item.quoc_gia;
            hatGiong.value = item.hat_giong;
            maBangDau.value = item.ma_bang_dau;
            logo.value = item.logo;

            maGiaiDau.setAttribute("disabled", true);
            maDoiBong.setAttribute("disabled", true);
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    });
}


function button_xoa(data) {
    const buttons = document.querySelectorAll(".delete-btn");
    for (let index = 0; index < buttons.length; index++) {
        const btn = buttons[index];
        btn.addEventListener("click", async () => {
            if (confirm(`Bạn có chắc chắn muốn xóa đội bóng ${data[index].ma_doi_bong} khỏi giải đấu?`)) {
                const formData = {
                    ma_doi_bong: data[index].ma_doi_bong,
                    ma_giai_dau: data[index].ma_giai_dau
                };
                await hamChung.xoa(formData, "doi_bong_giai_dau");
                await viewTbody();
            }
        });
    }
}




async function loadDanhSachDoiBong() {
    const selectElement = document.getElementById("maDoiBong");
    selectElement.innerHTML = '<option value="">-- Chọn Đội Bóng --</option>'; // Reset danh sách
    const data = await hamChung.layDanhSach("doi_bong");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_doi_bong;
        option.textContent = `${item.ten_doi_bong}`;
        selectElement.appendChild(option);
    });
}
async function loadDanhSachGiaiDau() {
    const selectElement = document.getElementById("maGiaiDau");
    selectElement.innerHTML = '<option value="">-- Chọn Giải Đấu --</option>'; // Reset danh sách
    const data = await hamChung.layDanhSach("giai_dau");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_giai_dau;
        option.textContent = `${item.ten_giai_dau}`;
        selectElement.appendChild(option);
    });
}
async function loadDanhSachBangDau() {
    const selectElement = document.getElementById("maBangDau");

    const maGiaiDau_chon = document.getElementById("maGiaiDau");

    const data = await hamChung.layDanhSach("giai_dau");
    const data_bangDau = await hamChung.layDanhSach("bang_dau");

    if (maGiaiDau_chon != null) {
        selectElement.innerHTML = '<option value="">-- Chọn Bảng Đấu --</option>'; // Reset danh sách
        const data_load = data_bangDau.filter(item => item.ma_giai_dau === maGiaiDau_chon.value);
        console.log(data_load)
        data_load.forEach(item => {
            const option = document.createElement("option");
            option.value = item.ma_bang_dau;
            option.textContent = `${item.ten_bang_dau}`;
            selectElement.appendChild(option);
        });
    }

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

async function loadDanhSachBangDau_chon_viewbody(maGiaiDau) {
    const selectElement = document.getElementById("maBangDau_chon_viewbody");
    const data_bangDau = await hamChung.layDanhSach("bang_dau");


    selectElement.innerHTML = '<option value="All">Tất Cả</option>'; // Reset danh sách
    const data_load = data_bangDau.filter(item => item.ma_giai_dau === maGiaiDau);
    console.log(data_load)
    data_load.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_bang_dau;
        option.textContent = `${item.ten_bang_dau}`;
        selectElement.appendChild(option);
    });

}

function handle_view_locDanhSach(event) {
    loadDanhSachGiaiDau_chon();
    // loadDanhSachDoiBong_chon(maGiaiDau_chon);
    console.log("tien");
    event.preventDefault();
    // Hiển thị bảng popupOverlay
    document.getElementById("popupOverlay").classList.remove("hidden");
    // Sự kiện khi nhấn nút "Đóng" trong bảng
    document.getElementById("closePopup").addEventListener("click", function () {
        // Ẩn bảng khi nhấn nút "Đóng"
        document.getElementById("popupOverlay").classList.add("hidden");
    });
    // còn trường hợp là lọc theo đội bóng
    document.getElementById("maGiaiDau_chon").addEventListener("change", function () {
        // Ẩn bảng khi nhấn nút "Đóng"
        console.log(document.getElementById("maGiaiDau_chon").value);
        // tại sao lại không load danh sách đội bóng lại như ban đầu

        loadDanhSachDoiBong_chon(document.getElementById("maGiaiDau_chon").value);
        viewTbody_chon(document.getElementById("maGiaiDau_chon").value, document.getElementById("maDoiBong_chon").value);
        //    viewTbody_chon(document.getElementById("maGiaiDau_chon").value, document.getElementById("trangThai_chon").value);
        // console.log(trangThaiDuyet.value);

    });
    document.getElementById("maDoiBong_chon").addEventListener("change", function () {
        // Ẩn bảng khi nhấn nút "Đóng"
        console.log(document.getElementById("maDoiBong_chon").value);
        viewTbody_chon(document.getElementById("maGiaiDau_chon").value, document.getElementById("maDoiBong_chon").value);
        // console.log(trangThaiDuyet.value);

    });

}
async function loadDanhSachGiaiDau_chon() {
    const selectElement = document.getElementById("maGiaiDau_chon");
    selectElement.innerHTML = '<option value="All">Tất Cả</option>'; // Reset danh sách
    const data = await hamChung.layDanhSach("giai_dau");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_giai_dau;
        option.textContent = `${item.ten_giai_dau}`;
        selectElement.appendChild(option);
    });
}

async function loadDanhSachDoiBong_chon(maGiaiDau) {
    const selectElement = document.getElementById("maDoiBong_chon");
    selectElement.innerHTML = '<option value="All">Tất Cả</option>'; // Reset danh sách
    let data;
    const data_doiBong = await hamChung.layDanhSach("doi_bong");
    // Lọc danh sách đội bóng theo mã giải đấu
    // maGiaiDau !== "All" thì lọc theo mã giải đấu
    console.log(maGiaiDau);
    if (maGiaiDau !== "All") {
        const dataDangKyGiai = await hamChung.layDanhSach("doi_bong_giai_dau");
        const loc_theoMaGiaiDau = dataDangKyGiai.filter(item => item.ma_giai_dau === maGiaiDau);

        // Tạo tập hợp mã đội bóng đã đăng ký giải
        const maDoiBongSet = new Set(loc_theoMaGiaiDau.map(item => item.ma_doi_bong));

        // Lọc danh sách đội bóng theo mã giải đấu
        const dataLoc = data_doiBong.filter(item => maDoiBongSet.has(item.ma_doi_bong));
        console.log(dataLoc);
        data = dataLoc;

    }
    else {
        data = data_doiBong;
    }
    console.log(maGiaiDau);
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_doi_bong;
        option.textContent = `${item.ten_doi_bong}`;
        selectElement.appendChild(option);
    });
}


async function viewTbody_chon(maGiaiDau_chon, maDoiBong_chon) {
    const data_doiBongGiaiDau = await hamChung.layDanhSach("doi_bong_giai_dau");
    console.log(maGiaiDau_chon);
    console.log(maDoiBong_chon);
    let data = data_doiBongGiaiDau;

    // Lọc theo mã giải đấu nếu không phải "All"
    if (maGiaiDau_chon !== "All") {
        data = data.filter(item => item.ma_giai_dau === maGiaiDau_chon);
    }
    console.log(data);

    // Lọc tiếp theo mã đội bóng nếu không phải "All"
    if (maDoiBong_chon !== "All") {
        data = data.filter(item => item.ma_doi_bong === maDoiBong_chon);
    }

    // Hiển thị dữ liệu lọc được (tùy bạn xử lý render ra đâu)
    console.log(data); // hoặc gọi hàm render ra tbody


    // const tableBody = document.getElementById("dataTable_chon");
    // tableBody.innerHTML = "";

    const tableBody = document.querySelector("#dataTable_chon tbody");
    tableBody.innerHTML = "";
    // for(let i = 0;i<data.length;i++){
    //     const item = data[i];

    // }
    const rows = await Promise.all(data.map(async item => {
        // const hinh_anh = await hamChung.getImage(item.hinh_anh);
        // console.log(item.hinh_anh);
        let hinh_anh;
        const row = document.createElement("tr");
        // C:\Users\vanti\Desktop\quan_ly_tran_dau\frontend\public\images\cat-2.png

        if (item.logo === null) {
            hinh_anh = "/frontend/public/images/cat-2.png";
        } else {
            hinh_anh = await hamChung.getImage(item.logo);

        }
        const lay1giaiDau = await hamChung.layThongTinTheo_ID("giai_dau", item.ma_giai_dau);
        const lay1DoiBong_hienTai = await hamChung.layThongTinTheo_ID("doi_bong", item.ma_doi_bong);

        let tenBangDau = "---";
        if (item.ma_bang_dau != null) {
            const lay1BangDau = await hamChung.layThongTinTheo_ID("bang_dau", item.ma_bang_dau);
            tenBangDau = lay1BangDau.ten_bang_dau;
        }
        row.innerHTML = `
            <td style="text-align: center;">${lay1giaiDau.ten_giai_dau}</td>
            <td style="text-align: center;">${lay1DoiBong_hienTai.ten_doi_bong}</td>
            <td style="text-align: center;">${item.ten_doi_bong}</td>
            <td style="text-align: center;">${tenBangDau}</td>
            <td style="text-align: center;">${item.quoc_gia}</td>
            <td style="text-align: center;"><img src="${hinh_anh}" alt="Logo" width="50"></td>
            <td style="text-align: center;">
                <select class="status-select form-control form-control-sm">
                    <option value="Co" ${item.hat_giong === 'co' ? 'selected' : ''} style="background-color: #f0ad4e; color: white;">Có</option>
                    <option value="Khong" ${item.hat_giong === 'khong' ? 'selected' : ''} style="background-color: #5bc0de; color: white;">Không</option>
                </select>
            </td>
        `;
        tableBody.appendChild(row);

        // Lắng nghe sự kiện change của select
        const select = row.querySelector('.status-select');
        const options = select.querySelectorAll('option');

        // Hàm thay đổi màu nền của select khi thay đổi giá trị
        select.addEventListener('change', (e) => {
            const selectedOption = e.target.options[e.target.selectedIndex];
            const selectedColor = selectedOption.style.backgroundColor;
            e.target.style.backgroundColor = selectedColor;
            // Cập nhật giá trị trang_thai khi người dùng thay đổi
            const newTrangThai = e.target.value;
            const maDoiBong = row.querySelector('td:nth-child(2)').textContent; // Lấy mã đội bóng (có thể thay đổi tuỳ theo cấu trúc dữ liệu)

            console.log(`Trạng thái đã thay đổi: ${newTrangThai} cho đội bóng: ${maDoiBong}`);
            const formData = {
                "ma_doi_bong": item.ma_doi_bong,
                "ma_giai_dau": item.ma_giai_dau,
                "hat_giong": newTrangThai
            };
            hamChung.sua(formData, "doi_bong_giai_dau");
            console.log(formData);

        });

        // Đặt màu nền ban đầu của select khi trang thái đã chọn
        const selectedOption = Array.from(options).find(option => option.selected);
        if (selectedOption) {
            select.style.backgroundColor = selectedOption.style.backgroundColor;
        }
    }));
}