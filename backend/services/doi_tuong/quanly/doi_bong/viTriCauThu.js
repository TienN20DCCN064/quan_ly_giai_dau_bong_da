const btnLuuThayDoi = document.getElementById("button_luu");
const btnTaiLaiTrang = document.getElementById("button_taiLaiTrang");

const maViTri = document.getElementById("maViTri");
const tenViTri = document.getElementById("tenViTri");

document.addEventListener("DOMContentLoaded", function () {
    viewTbody();
    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);
});

// Hiển thị danh sách vị trí cầu thủ
async function viewTbody() {
    const data = await hamChung.layDanhSach("vi_tri_cau_thu");
    console.log(data);
    const tableBody = document.getElementById("dataTable");
    tableBody.innerHTML = "";

    data.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td style="text-align: center;">${item.ma_vi_tri}</td>
            <td style="text-align: center;">${item.ten_vi_tri}</td>
            <td style="text-align: center;"><button class="edit-btn btn btn-warning btn-sm">Sửa</button></td>
            <td style="text-align: center;"><button class="delete-btn btn btn-danger btn-sm">Xóa</button></td>
        `;
        tableBody.appendChild(row);
    });

    button_sua(data);
    button_xoa(data);
}

// Thêm/Sửa vị trí
async function handleLuuThayDoi(event) {
    event.preventDefault();

    const form = document.getElementById("inputForm");
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    let formData = {};
    if (maViTri.value === "") {
        formData = {
            ma_vi_tri: await hamChung.taoID_theoBang("vi_tri_cau_thu"),
            ten_vi_tri: tenViTri.value
        };
        await hamChung.them(formData, "vi_tri_cau_thu");
        alert("Thêm thành công!");
    } else {
        formData = {
            ma_vi_tri: maViTri.value,
            ten_vi_tri: tenViTri.value
        };
        await hamChung.sua(formData, "vi_tri_cau_thu");
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
            maViTri.value = item.ma_vi_tri;
            tenViTri.value = item.ten_vi_tri;
        });
    });
}

// Xử lý nút "Xóa"
function button_xoa(data) {
    document.querySelectorAll(".delete-btn").forEach((btn, index) => {
        btn.addEventListener("click", async () => {
            if (confirm(`Bạn có chắc chắn muốn xóa vị trí ${data[index].ten_vi_tri}?`)) {
                const formData = { ma_vi_tri: data[index].ma_vi_tri };
                await hamChung.xoa(formData, "vi_tri_cau_thu");
                viewTbody();
            }
        });
    });
}