
const btnTaiLaiTrang = document.getElementById("button_taiLaiTrang");


document.addEventListener("DOMContentLoaded", function () {
    console.log("Đã vào trang quản lý đội bóng");
    console.log(DoiTuyen.getDoiTuyen_dangChon());
    console.log(GlobalStore.getUsername());
    viewTbody();
    // Gán sự kiện cho nút


});

// Hiển thị danh sách giải đấu
async function viewTbody() {
    const giaiDauThamGia = await tim_giaiDau_doiBong_da_thamGia(DoiTuyen.getDoiTuyen_dangChon());
    console.log(giaiDauThamGia);
    const tableBody = document.getElementById("dataTable");
    tableBody.innerHTML = "";

    giaiDauThamGia.forEach(async item => {
        const row = document.createElement("tr");

        const data_1GiaiDau = await hamChung.layThongTinTheo_ID("giai_dau", item.ma_giai_dau);
        console.log(data_1GiaiDau);
        row.innerHTML = `
            <td style="text-align: center;">${data_1GiaiDau.ten_giai_dau}</td>
            <td style="text-align: center;">${data_1GiaiDau.ten_to_chuc}</td>
            <td style="text-align: center;">${data_1GiaiDau.ngay_bat_dau}</td>
            <td style="text-align: center;">${data_1GiaiDau.ngay_ket_thuc}</td>
            <td style="text-align: center;">${data_1GiaiDau.gioi_tinh}</td>
            <td style="text-align: center;"><button class="edit-btn btn btn-warning btn-sm">Thông tin giải</button></td>
            <td style="text-align: center;"><button class="delete-btn btn btn-danger btn-sm">Xem danh sách </button></td>
        `;
        tableBody.appendChild(row);


        // Gắn sự kiện cho nút "Thông tin giải" ngay tại đây
        const editBtn = row.querySelector(".edit-btn");
        const deleteBtn = row.querySelector(".delete-btn");
        editBtn.addEventListener("click", () => {
            console.log("Bạn đã click vào:", data_1GiaiDau);
            document.getElementById("name_giai_dau").textContent = "Giải Đấu : " + data_1GiaiDau.ten_giai_dau;
            document.getElementById("thongTinGiai").classList.remove("hidden");
            console.log(data_1GiaiDau.ma_giai_dau);
            viewbody_thongTinGiai(data_1GiaiDau.ma_giai_dau);
        });
        deleteBtn.addEventListener("click", async () => {
            console.log("Bạn đã click vào:", data_1GiaiDau);

            document.getElementById("name_giai_dau").textContent = "Giải Đấu : " + data_1GiaiDau.ten_giai_dau;
            document.getElementById("danhSachCauThu").classList.remove("hidden");
            const data = await tim_dsCauThu_doiBong_thamGia_giai(DoiTuyen.getDoiTuyen_dangChon(), data_1GiaiDau.ma_giai_dau);
            viewbody_danhSachCauThu(data);
        });
    });
    document.getElementById("closePopup1").addEventListener("click", function () {
        // Ẩn bảng khi nhấn nút "Đóng"
        document.getElementById("danhSachCauThu").classList.add("hidden");
    });
    document.getElementById("closePopup2").addEventListener("click", function () {
        // Ẩn bảng khi nhấn nút "Đóng"
        document.getElementById("thongTinGiai").classList.add("hidden");
    });

}

async function viewbody_thongTinGiai(ma_giai_dau) {
    console.log(ma_giai_dau);
    const tableBody = document.getElementById("dataTable_thongTinGiaiDau").getElementsByTagName('tbody')[0];
    // console.log(data_doiBong_giaiDau);

    tableBody.innerHTML = ""; // Xóa dữ liệu hiện tại
    console.log(await hamChung.layDanhSach("giai_dau"));
    console.log(ma_giai_dau);
    const data = await hamChung.layThongTinTheo_ID("giai_dau", ma_giai_dau);
    console.log(data);
    // Lặp qua dữ liệu và tạo các dòng cho bảng

    const row = document.createElement("tr");
    row.innerHTML = `
            <td style="text-align: center;">${data.ten_giai_dau}</td>
            <td style="text-align: center;">${data.mo_ta}</td>
        `;
    tableBody.appendChild(row);

}
async function viewbody_danhSachCauThu(data) {
    console.log(data);
    const tableBody = document.getElementById("dataTable_danhSachCauThu").getElementsByTagName('tbody')[0];
    // console.log(data_doiBong_giaiDau);

    tableBody.innerHTML = ""; // Xóa dữ liệu hiện tại

    // Lặp qua dữ liệu và tạo các dòng cho bảng
    data.forEach(async item => {
        const vitri = await hamChung.layThongTinTheo_ID("vi_tri_cau_thu", item.ma_vi_tri);
        let hinh_anh;

        if (item.hinh_anh === null) {
            hinh_anh = "/frontend/public/images/cat-2.png";
        } else {
            hinh_anh = await hamChung.getImage(item.hinh_anh);
        }

        const row = document.createElement("tr");
        row.innerHTML = `
            <td style="text-align: center;">${item.ho_ten}</td>
            <td style="text-align: center;">${item.so_ao}</td>
            <td style="text-align: center;"><img src="${hinh_anh}" alt="Hình ảnh" width="50"></td>
             <td style="text-align: center;">${vitri.ten_vi_tri}</td>
        `;
        tableBody.appendChild(row);
    });
}
async function tim_dsCauThu_doiBong_thamGia_giai(ma_doi_bong, ma_giai_dau) {

    const data = await hamChung.layDanhSach("cau_thu_giai_dau");

    // Lọc ra những bản ghi khớp với cả 2 điều kiện
    const ketQua = data.filter(item =>
        item.ma_giai_dau === ma_giai_dau &&
        item.ma_doi_bong === ma_doi_bong
    );

    return ketQua;
}

async function tim_giaiDau_doiBong_da_thamGia(ma_doi_bong) {
    const data = await hamChung.layDanhSach("dang_ky_tham_gia_giai");

    // Lọc ra những bản ghi khớp với cả 2 điều kiện
    const ketQua = data.filter(item =>
        item.ma_doi_bong === ma_doi_bong
    );

    return ketQua;
}
