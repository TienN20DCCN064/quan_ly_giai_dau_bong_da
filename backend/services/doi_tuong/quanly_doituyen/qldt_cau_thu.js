const btnLuuThayDoi = document.getElementById("button_luu");
const btnTaiLaiTrang = document.getElementById("button_taiLaiTrang");

const maCauThu = document.getElementById("maCauThu");
const hoTen = document.getElementById("hoTen");
const ngaySinh = document.getElementById("ngaySinh");
const soAo = document.getElementById("soAo");
const maGioiTinh = document.getElementById("maGioiTinh");
const maViTri = document.getElementById("maViTri");
const maDoiBong = document.getElementById("maDoiBong");
const hinhAnh = document.getElementById("hinhAnh");
const inputFile = document.getElementById("hinhAnhFile");
const form = document.getElementById("inputForm");

document.addEventListener("DOMContentLoaded", async function () {
    console.log("Đã vào trang quản lý đội bóng");
    console.log(DoiTuyen.getDoiTuyen_dangChon());
    console.log(GlobalStore.getUsername());
    loadDanhSachViTri();
    loadDanhSachDoiBong();
    await viewTbody();
    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);
});

// Hiển thị danh sách cầu thủ
async function viewTbody() {
    const allCauThu = await hamChung.layDanhSach("cau_thu");

    const maDoiBongDangChon = DoiTuyen.getDoiTuyen_dangChon();

    const data = allCauThu.filter(cauThu => cauThu.ma_doi_bong === maDoiBongDangChon);
    console.log(data);
    const tableBody = document.getElementById("dataTable");
    tableBody.innerHTML = "";

    // Dùng Promise.all để chờ tất cả hình ảnh tải xong
    // const rows = await Promise.all(data.map(async item => {
    for (let i = 0; i < data.length; i++) {
        // const row = document.createElement("tr");
        // const hinh_anh = await hamChung.getImage(item.hinh_anh);
        // console.log(item.hinh_anh);
        const item = data[i];
        let hinh_anh;
        const row = document.createElement("tr");
        // C:\Users\vanti\Desktop\quan_ly_tran_dau\frontend\public\images\cat-2.png

        if (item.hinh_anh === null) {
            hinh_anh = "/frontend/public/images/cat-2.png";
        } else {
            hinh_anh = await hamChung.getImage(item.hinh_anh);
        }
        // console.log(item.maGioiTinh)
        const dataDoiBong1 = await hamChung.layThongTinTheo_ID("doi_bong", item.ma_doi_bong);
        const data1VT = await hamChung.layThongTinTheo_ID("vi_tri_cau_thu", item.ma_vi_tri);

        row.innerHTML = `
            <td style="text-align: center;">${item.ma_cau_thu}</td>
            <td style="text-align: center;">${item.ho_ten}</td>
            <td style="text-align: center;">${item.ngay_sinh}</td>
            <td style="text-align: center;">${item.so_ao}</td>
            <td style="text-align: center;">${item.gioi_tinh}</td>
            <td style="text-align: center;">${data1VT.ten_vi_tri}</td>
            <td style="text-align: center;">${dataDoiBong1.ten_doi_bong}</td>
            <td style="text-align: center;"><img src="${hinh_anh}" alt="Hình ảnh" width="50"></td>
            <td style="text-align: center;"><button class="edit-btn btn btn-warning btn-sm">Sửa</button></td>
            <td style="text-align: center;"><button class="delete-btn btn btn-danger btn-sm">Xóa</button></td>
        `;
        tableBody.appendChild(row);
    }

    // Thêm tất cả hàng vào bảng cùng lúc
    // rows.forEach(row => tableBody.appendChild(row));

    button_sua(data);
    button_xoa(data);
}

// Thêm/Sửa cầu thủ
// Thêm/Sửa cầu thủ
async function handleLuuThayDoi(event) {
    event.preventDefault();
    // const inputFile = document.getElementById('hinhAnhFile'); // Thẻ input file

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
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

    console.log(id_Hinh_anh_thay);
    if (maCauThu.value === "") {
        formData = {
            ma_cau_thu: await hamChung.taoID_theoBang("cau_thu"),
            ho_ten: hoTen.value,
            ngay_sinh: ngaySinh.value,
            so_ao: soAo.value,
            gioi_tinh: maGioiTinh.value,
            ma_vi_tri: maViTri.value,
            ma_doi_bong: maDoiBong.value,
            hinh_anh: id_Hinh_anh_thay
        };
        await hamChung.them(formData, "cau_thu");
        alert("Thêm thành công!");

        // update ảnh nếu cócó
    } else {
        formData = {
            ma_cau_thu: maCauThu.value,
            ho_ten: hoTen.value,
            ngay_sinh: ngaySinh.value,
            so_ao: soAo.value,
            gioi_tinh: maGioiTinh.value,
            ma_vi_tri: maViTri.value,
            ma_doi_bong: maDoiBong.value,
            hinh_anh: id_Hinh_anh_thay
        };
        await hamChung.sua(formData, "cau_thu");
        alert("Sửa thành công!");
    }

    console.log(formData);
    // phần này là phần cập nhật ảnh lên server
    if (inputFile.value != "") {
        await hamChung.uploadImage(inputFile.files[0]);
    }

    //viewTbody();
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
            hoTen.value = item.ho_ten;
            ngaySinh.value = item.ngay_sinh;
            soAo.value = item.so_ao;
            maGioiTinh.value = item.gioi_tinh;
            maViTri.value = item.ma_vi_tri;
            maDoiBong.value = item.ma_doi_bong;
            console.log(item);
            hinhAnh.value = item.hinh_anh;
        });
    });
}

// Xử lý nút "Xóa"
function button_xoa(data) {
    document.querySelectorAll(".delete-btn").forEach((btn, index) => {
        btn.addEventListener("click", async () => {
            if (confirm(`Bạn có chắc chắn muốn xóa cầu thủ ${data[index].ma_cau_thu}?`)) {
                const formData = { ma_cau_thu: data[index].ma_cau_thu };
                await hamChung.xoa(formData, "cau_thu");
                viewTbody();
            }
        });
    });
}

async function loadDanhSachViTri() {
    const selectElement = document.getElementById("maViTri");
    selectElement.innerHTML = '<option value="">-- Chọn Vị Trí --</option>'; // Reset danh sách
    const data = await hamChung.layDanhSach("vi_tri_cau_thu");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_vi_tri;
        option.textContent = `${item.ma_vi_tri} - ${item.ten_vi_tri}`;
        selectElement.appendChild(option);
    });
}

async function loadDanhSachDoiBong() {
    const selectElement = document.getElementById("maDoiBong");
    selectElement.innerHTML = '<option value="">-- Chọn Đội Bóng --</option>'; // Reset danh sách

    const doiTuyenDangChon = await DoiTuyen.getDoiTuyen_dangChon();

    selectElement.innerHTML = '<option value=""></option>'; // Reset

    // Giả sử doiTuyenDangChon = 'VN'
    const option = document.createElement('option');
    option.value = doiTuyenDangChon;
    option.textContent = doiTuyenDangChon;
    selectElement.appendChild(option);

    // Đặt giá trị mặc định
    selectElement.value = doiTuyenDangChon;


    // const option = document.createElement("option");
    // option.value = doiTuyenDangChon.ma_doi_bong;
    // option.textContent = `${doiTuyenDangChon.ma_doi_bong} - ${doiTuyenDangChon.ten_doi_bong}`;
    // option.selected = true; // Chọn mặc định
    // selectElement.appendChild(option);

    // const data = await hamChung.layDanhSach("doi_bong");
    // data.forEach(item => {
    //     const option = document.createElement("option");
    //     option.value = item.ma_doi_bong;
    //     option.textContent = `${item.ma_doi_bong} - ${item.ten_doi_bong}`;
    //     selectElement.appendChild(option);
    // });
}