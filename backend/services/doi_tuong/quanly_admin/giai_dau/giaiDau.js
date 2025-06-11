const btnLuuThayDoi = document.getElementById("button_luu");
const btnTaiLaiTrang = document.getElementById("button_taiLaiTrang");

const maGiaiDau = document.getElementById("maGiaiDau");
const tenGiaiDau = document.getElementById("tenGiaiDau");
const tenToChuc = document.getElementById("tenToChuc");
const ngayBatDau = document.getElementById("ngayBatDau");
const ngayKetThuc = document.getElementById("ngayKetThuc");
const ngayHetDangKy = document.getElementById("ngayHetDangKy");
const maGioiTinh = document.getElementById("maGioiTinh");
const hinhAnh = document.getElementById("hinhAnh");
const inputFile = document.getElementById("hinhAnhFile");
const moTa = document.getElementById("moTa");
const maGioiTinh_viewBody = document.getElementById("maGioiTinh_viewBody");


// Lấy các phần tử
const btnLocDanhSach = document.getElementById("button_locDanhSach");
const popupOverlay = document.getElementById("popupOverlay");
const closePopup = document.getElementById("closePopup");


const ngayBatDau_chon_viewbody = document.getElementById("ngayBatDau_chon_viewbody");
const ngayKetThuc_chon_viewbody = document.getElementById("ngayKetThuc_chon_viewbody");

document.addEventListener("DOMContentLoaded", function () {
    viewTbody();
    // Gán sự kiện cho nút
    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);
    btnLocDanhSach.addEventListener("click", handle_view_locDanhSach);
    ngayBatDau_chon_viewbody.addEventListener("change", async function () {
        console.log(ngayBatDau_chon_viewbody.value);
        // maVongDau_chon_viewbody.value = "All";
        let data = await hamChung.layDanhSach("giai_dau");

        viewTbody(data);
    });
    ngayKetThuc_chon_viewbody.addEventListener("change", async function () {
        console.log(ngayKetThuc_chon_viewbody.value);
        // maVongDau_chon_viewbody.value = "All";
        let data = await hamChung.layDanhSach("giai_dau");

        viewTbody(data);
    });
    maGioiTinh_viewBody.addEventListener("change", async function () {
        console.log(maGioiTinh_viewBody.value);
        // maVongDau_chon_viewbody.value = "All";
        let data = await hamChung.layDanhSach("giai_dau");

        viewTbody(data);
    });
});

// Hiển thị danh sách giải đấu
async function viewTbody(data) {
    if (data === undefined) {
        data = await hamChung.layDanhSach("giai_dau");
    }
    console.log(ngayBatDau_chon_viewbody.value);
    console.log(ngayKetThuc_chon_viewbody.value);
    if (ngayBatDau_chon_viewbody.value !== "") {
        data = data.filter(item => item.ngay_bat_dau >= ngayBatDau_chon_viewbody.value);
    }
    if (ngayKetThuc_chon_viewbody.value !== "") {
        data = data.filter(item => item.ngay_ket_thuc <= ngayKetThuc_chon_viewbody.value);
    }
    if (maGioiTinh_viewBody.value != "All") {
        data = data.filter(item => item.gioi_tinh === maGioiTinh_viewBody.value);

    }
    console.log(data);
    const tableBody = document.getElementById("dataTable");
    tableBody.innerHTML = "";

    for (const item of data) {
        let hinh_anh;
        if (item.hinh_anh === null) {
            hinh_anh = "/frontend/public/images/cat-2.png";
        } else {
            hinh_anh = await hamChung.getImage(item.hinh_anh);
        }

        const row = document.createElement("tr");
        row.innerHTML = `
            <td style="text-align: center;">${item.ma_giai_dau}</td>
            <td style="text-align: center;">${item.ten_giai_dau}</td>
            <td style="text-align: center;">${item.ten_to_chuc}</td>
            <td style="text-align: center;">${item.ngay_bat_dau}</td>
            <td style="text-align: center;">${item.ngay_ket_thuc}</td>
            <td style="text-align: center;">${item.ngay_ket_thuc_dang_ky_giai}</td>
            <td style="text-align: center;">${item.gioi_tinh}</td>
             <td style="text-align: center;"><img src="${hinh_anh}" alt="Hình ảnh" width="50"></td>
            <td style="text-align: center;">${item.mo_ta || ""}</td>
            <td style="text-align: center;"><button class="edit-btn btn btn-warning btn-sm">Sửa</button></td>
            <td style="text-align: center;"><button class="delete-btn btn btn-danger btn-sm">Xóa</button></td>
        `;
        tableBody.appendChild(row);

    }


    button_sua(data);
    button_xoa(data);


}
async function handleLuuThayDoi(event) {
    event.preventDefault(); // Ngăn chặn form reload

    const form = document.getElementById("inputForm");
    if (ngayBatDau.value >= ngayKetThuc.value) {
        alert("Ngày bắt đầu phải bé hơn ngày kết thúc");
        return;
    }
    if (ngayHetDangKy.value >= ngayBatDau.value) {
        alert("Ngày hết đăng ký phải bé hơn ngày bắt đầu");
        return;
    }


    // Kiểm tra xem form có hợp lệ không
    if (!form.checkValidity()) {
        form.reportValidity(); // Hiển thị thông báo lỗi nếu có ô chưa điền
        return; // Dừng hàm nếu form không hợp lệ
    }

    let formData = {};
    let id_Hinh_anh_thay = "";
    // nếu có hình ảnh mới thì lấy tên hình ảnh đó ra 
    if (inputFile.value === "")
        id_Hinh_anh_thay = hinhAnh.value;
    else {
        id_Hinh_anh_thay = inputFile.files[0].name; // Lấy tệp đầu tiên (nếu có)
    }
    id_Hinh_anh_thay = hamChung.doiKhoangTrangThanhGachDuoi(id_Hinh_anh_thay);
    if (maGiaiDau.value === "") {
        formData = {
            ma_giai_dau: await hamChung.taoID_theoBang("giai_dau"),
            ten_giai_dau: tenGiaiDau.value,
            ten_to_chuc: tenToChuc.value,
            ngay_bat_dau: ngayBatDau.value,
            ngay_ket_thuc: ngayKetThuc.value,
            ngay_ket_thuc_dang_ky_giai: ngayHetDangKy.value,
            gioi_tinh: maGioiTinh.value,
            hinh_anh: id_Hinh_anh_thay,
            mo_ta: moTa.value,
        };
        console.log("dang them " + await hamChung.taoID_theoBang("giai_dau"));
    } else {
        formData = {
            ma_giai_dau: maGiaiDau.value,
            ten_giai_dau: tenGiaiDau.value,
            ten_to_chuc: tenToChuc.value,
            ngay_bat_dau: ngayBatDau.value,
            ngay_ket_thuc: ngayKetThuc.value,
            ngay_ket_thuc_dang_ky_giai: ngayHetDangKy.value,
            gioi_tinh: maGioiTinh.value,
            hinh_anh: id_Hinh_anh_thay,
            mo_ta: moTa.value
        };
        console.log("dang sửa");
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
    if (inputFile.value != "") {
        await hamChung.uploadImage(inputFile.files[0]);
    }
    await viewTbody();
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
            ngayHetDangKy.value = item.ngay_ket_thuc_dang_ky_giai;
            maGioiTinh.value = item.gioi_tinh;
            hinhAnh.value = item.hinh_anh;
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
                await hamChung.xoa(formData, "giai_dau");
                viewTbody(); // Refresh danh sách sau khi xóa
            }
        });
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