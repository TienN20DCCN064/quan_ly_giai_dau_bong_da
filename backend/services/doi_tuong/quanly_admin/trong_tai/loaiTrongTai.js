const btnLuuThayDoi = document.getElementById("button_luu");
const btnTaiLaiTrang = document.getElementById("button_taiLaiTrang");

const maLoaiTrongTai = document.getElementById("maLoaiTrongTai");
const tenLoaiTrongTai = document.getElementById("tenLoaiTrongTai");
const form = document.getElementById("inputForm");


document.addEventListener("DOMContentLoaded", async function () {
    await viewTbody();


    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);
});

// Hiển thị danh sách trọng tài
// Hiển thị danh sách trọng tài
async function viewTbody() {
    const data = await hamChung.layDanhSach("loai_trong_tai");
    console.log(data);
    const tableBody = document.getElementById("dataTable");
    tableBody.innerHTML = "";

    // Dùng Promise.all để chờ tất cả hình ảnh tải xong
    const rows = await Promise.all(data.map(async item => {

        const row = document.createElement("tr");
        row.innerHTML = `
            <td style="text-align: center;">${item.ma_loai_trong_tai}</td>
            <td style="text-align: center;">${item.ten_loai_trong_tai}</td>
            <td style="text-align: center;"><button class="edit-btn btn btn-warning btn-sm">Sửa</button></td>
            <td style="text-align: center;"><button class="delete-btn btn btn-danger btn-sm">Xóa</button></td>
        `;
        return row;
    }));

    // Thêm tất cả hàng vào bảng cùng lúc
    rows.forEach(row => tableBody.appendChild(row));

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
    if (maLoaiTrongTai.value === "") {
        formData = {
            ma_loai_trong_tai: await hamChung.taoID_theoBang("loai_trong_tai"),
            ten_loai_trong_tai: tenLoaiTrongTai.value,
        };
        await hamChung.them(formData, "loai_trong_tai");
        alert("Thêm thành công!");
    } else {
        // nếu là sửa thì hình ảnh có thể thay và không thay

        formData = {
            ma_loai_trong_tai: maLoaiTrongTai.value,
            ten_loai_trong_tai: tenLoaiTrongTai.value,
        };
        await hamChung.sua(formData, "loai_trong_tai");
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
            maLoaiTrongTai.value = item.ma_loai_trong_tai;
            tenLoaiTrongTai.value = item.ten_loai_trong_tai;
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
            if (confirm(`Bạn có chắc chắn muốn xóa loại trọng tài ${data[index].ten_loai_trong_tai}?`)) {
                const formData = { ma_loai_trong_tai: data[index].ma_loai_trong_tai };
                await hamChung.xoa(formData, "loai_trong_tai");
                await viewTbody();
            }
        });
    });
}
