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
const maDoiBong_chon_viewbody = document.getElementById("maDoiBong_chon_viewbody");
document.addEventListener("DOMContentLoaded", async function () {
    loadDanhSachViTri();
    loadDanhSachDoiBong();
    loadDanhSachDoiBong_chon_viewbody();
    await viewTbody();
    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);
    maDoiBong_chon_viewbody.addEventListener("change", async function () {
        console.log(maDoiBong_chon_viewbody.value);
        // maVongDau_chon_viewbody.value = "All";
        let data = await hamChung.layDanhSach("cau_thu");

        viewTbody(data);
    });
});

// Hiển thị danh sách cầu thủ
async function viewTbody(data) {
    if (data === undefined) {
        data = await hamChung.layDanhSach("cau_thu");
    }
    if (maDoiBong_chon_viewbody.value !== "All") {
        console.log(maDoiBong_chon_viewbody.value);
        data = data.filter(item => item.ma_doi_bong === maDoiBong_chon_viewbody.value);
    }
    console.log(data);
    const tableBody = document.getElementById("dataTable");
    tableBody.innerHTML = "";


    // Giới hạn chỉ lấy 20 cầu thủ
    data = data.slice(0, 20);

    for (let i = 0; i < data.length; i++) {
        //  for (const item of data) {
        const item = data[i];
        let hinh_anh;
        const row = document.createElement("tr");
        // C:\Users\vanti\Desktop\quan_ly_tran_dau\frontend\public\images\cat-2.png

        if (item.hinh_anh === null) {
            hinh_anh = "/frontend/public/images/cat-2.png";
        } else {
            hinh_anh = await hamChung.getImage(item.hinh_anh);
        }
        const lay1ViTri = await hamChung.layThongTinTheo_ID("vi_tri_cau_thu", item.ma_vi_tri);
        const lay1doiBong = await hamChung.layThongTinTheo_ID("doi_bong", item.ma_doi_bong);

        row.innerHTML = `
            <td style="text-align: center;">${lay1doiBong.ten_doi_bong}</td>
          
            <td style="text-align: center;">${item.ho_ten}</td>
            <td style="text-align: center;">${item.ngay_sinh}</td>
            <td style="text-align: center;">${item.so_ao}</td>
            <td style="text-align: center;">${item.gioi_tinh}</td>
            <td style="text-align: center;">${lay1ViTri.ten_vi_tri}</td>
            <td style="text-align: center;"><img src="${hinh_anh}" alt="Hình ảnh" width="50"></td>
            <td style="text-align: center;"><button class="edit-btn btn btn-warning btn-sm">Sửa</button></td>
            <td style="text-align: center;"><button class="delete-btn btn btn-danger btn-sm">Xóa</button></td>
        `;
        tableBody.appendChild(row);
    }


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
            hoTen.value = item.ho_ten;
            ngaySinh.value = item.ngay_sinh;
            soAo.value = item.so_ao;
            maGioiTinh.value = item.gioi_tinh;
            maViTri.value = item.ma_vi_tri;
            maDoiBong.value = item.ma_doi_bong;
            console.log(item);
            hinhAnh.value = item.hinh_anh;
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
    const data = await hamChung.layDanhSach("doi_bong");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_doi_bong;
        option.textContent = `${item.ten_doi_bong}`;
        selectElement.appendChild(option);
    });
}
async function loadDanhSachDoiBong_chon_viewbody() {
    const selectElement = document.getElementById("maDoiBong_chon_viewbody");
    selectElement.innerHTML = '<option value="All">Tất Cả</option>'; // Reset danh sách
    const data = await hamChung.layDanhSach("doi_bong");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_doi_bong;
        option.textContent = `${item.ten_doi_bong}`;
        selectElement.appendChild(option);
    });
}