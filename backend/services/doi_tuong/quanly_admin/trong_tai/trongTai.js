const btnLuuThayDoi = document.getElementById("button_luu");
const btnTaiLaiTrang = document.getElementById("button_taiLaiTrang");

const maTrongTai = document.getElementById("maTrongTai");
const hoTen = document.getElementById("hoTen");
const ngaySinh = document.getElementById("ngaySinh");
const maGioiTinh = document.getElementById("maGioiTinh");

const hinhAnh = document.getElementById("hinhAnh");
const inputFile = document.getElementById("hinhAnhFile");
const form = document.getElementById("inputForm");
const gioiTinh_chon_viewbody = document.getElementById("gioiTinh_chon_viewbody");

document.addEventListener("DOMContentLoaded", async function () {
    await viewTbody();


    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);
    gioiTinh_chon_viewbody.addEventListener("change", async function () {
        console.log(gioiTinh_chon_viewbody.value);
        // maVongDau_chon_viewbody.value = "All";
        let data = await hamChung.layDanhSach("trong_tai");

        viewTbody(data);
    });
});

// Hiển thị danh sách trọng tài
// Hiển thị danh sách trọng tài
async function viewTbody(data) {
    if (data === undefined) {
        data = await hamChung.layDanhSach("trong_tai");
    }
    if (gioiTinh_chon_viewbody.value !== "All") {
        data = data.filter(item => item.gioi_tinh === gioiTinh_chon_viewbody.value);
    }
    console.log(data);
    const tableBody = document.getElementById("dataTable");
    tableBody.innerHTML = "";


    for (let i = 0; i < data.length; i++) {

        const item = data[i];
        // const hinh_anh = await hamChung.getImage(item.hinh_anh);
        // console.log(item.hinh_anh);
        let hinh_anh;
        const row = document.createElement("tr");
        // C:\Users\vanti\Desktop\quan_ly_tran_dau\frontend\public\images\cat-2.png

        if (item.hinh_anh === null) {
            hinh_anh = "/frontend/public/images/cat-2.png";
        } else {
            hinh_anh = await hamChung.getImage(item.hinh_anh);
        }
        // console.log(hinh_anh);
        row.innerHTML = `
          
            <td style="text-align: center;">${item.ho_ten}</td>
            <td style="text-align: center;">${item.ngay_sinh}</td>
            <td style="text-align: center;">${item.gioi_tinh}</td>
            <td style="text-align: center;">
                <img src="${hinh_anh}" alt="Hình ảnh" style="width: 50px; height: 50px; border-radius: 50%;">
            </td>
            <td style="text-align: center;"><button class="edit-btn btn btn-warning btn-sm">Sửa</button></td>
            <td style="text-align: center;"><button class="delete-btn btn btn-danger btn-sm">Xóa</button></td>
        `;
        tableBody.appendChild(row);
    }

    // // Thêm tất cả hàng vào bảng cùng lúc
    // rows.forEach(row => tableBody.appendChild(row));

    // Gán lại sự kiện cho các nút sau khi bảng đã cập nhật
    button_sua(data);
    button_xoa(data);
}


// Thêm/Sửa trọng tài
async function handleLuuThayDoi(event) {
    event.preventDefault(); // Ngừng hành động gửi form mặc định

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    let formData = {};
    let id_Hinh_anh_thay = "";
    //  không chọn hình ảnh mới
    if (inputFile.value === "")
        id_Hinh_anh_thay = hinhAnh.value;
    // chọn hình ảnh mới thì đưa ảnh mới lên và lấy id
    else {
        id_Hinh_anh_thay = inputFile.files[0].name; // Lấy tệp đầu tiên (nếu có)
    }
    id_Hinh_anh_thay = hamChung.doiKhoangTrangThanhGachDuoi(id_Hinh_anh_thay);
    // thêm mới
    if (maTrongTai.value === "") {
        formData = {
            ma_trong_tai: await hamChung.taoID_theoBang("trong_tai"),
            ho_ten: hoTen.value,
            ngay_sinh: ngaySinh.value,
            gioi_tinh: maGioiTinh.value,
            hinh_anh: id_Hinh_anh_thay
        };
        await hamChung.them(formData, "trong_tai");
        alert("Thêm thành công!");
    } else {
        // nếu là sửa thì hình ảnh có thể thay và không thay

        formData = {
            ma_trong_tai: maTrongTai.value,
            ho_ten: hoTen.value,
            ngay_sinh: ngaySinh.value,
            gioi_tinh: maGioiTinh.value,
            hinh_anh: id_Hinh_anh_thay
        };
        await hamChung.sua(formData, "trong_tai");
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
            maTrongTai.value = item.ma_trong_tai;
            hoTen.value = item.ho_ten;
            ngaySinh.value = item.ngay_sinh;
            maGioiTinh.value = item.gioi_tinh;
            hinhAnh.value = item.hinh_anh;

            // // Hiển thị đường dẫn ảnh trong input text
            // hinhAnhText.value = item.hinh_anh;
            // // Xóa giá trị của input file (nếu có)
            // hinhAnh.value = "";

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
            if (confirm(`Bạn có chắc chắn muốn xóa trọng tài ${data[index].ho_ten}?`)) {
                const formData = { ma_trong_tai: data[index].ma_trong_tai };
                await hamChung.xoa(formData, "trong_tai");
                viewTbody();
            }
        });
    });

}
