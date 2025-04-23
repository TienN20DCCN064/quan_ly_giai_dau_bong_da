
const btnLuuThayDoi = document.getElementById("button_luu");
const btnTaiLaiTrang = document.getElementById("button_taiLaiTrang");

const maVaiTro = document.getElementById("maVaiTro");
const tenVaiTro = document.getElementById("tenVaiTro");

document.addEventListener("DOMContentLoaded", function () {
    viewTbody();
    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);
});

// Hiển thị danh sách vai trò
async function viewTbody() {
    const data = await hamChung.layDanhSach("vai_tro");
    console.log(data);
    const tableBody = document.getElementById("dataTable");
    tableBody.innerHTML = "";

    data.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td style="text-align: center;">${item.ma_vai_tro}</td>
            <td style="text-align: center;">${item.ten_vai_tro}</td>
            <td style="text-align: center;"><button class="edit-btn btn btn-warning btn-sm">Sửa</button></td>
            <td style="text-align: center;"><button class="delete-btn btn btn-danger btn-sm">Xóa</button></td>
        `;
        tableBody.appendChild(row);
    });

    button_sua(data);
    button_xoa(data);
}

// Thêm/Sửa vai trò
async function handleLuuThayDoi(event) {
    event.preventDefault();

    const form = document.getElementById("inputForm");
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    let formData = {};
    if (maVaiTro.value === "") {
        formData = {
            ma_vai_tro: await hamChung.taoID_theoBang("vai_tro"),
            ten_vai_tro: tenVaiTro.value
        };
        // await hamChung.them(formData, "vai_tro");
        // alert("Thêm thành công!");
    } else {
        formData = {
            ma_vai_tro: maVaiTro.value,
            ten_vai_tro: tenVaiTro.value
        };
        await hamChung.sua(formData, "vai_tro");
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
            maVaiTro.value = item.ma_vai_tro;
            tenVaiTro.value = item.ten_vai_tro;
            
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
            if (confirm(`Bạn có chắc chắn muốn xóa vai trò ${data[index].ten_vai_tro}?`)) {
                const formData = { ma_vai_tro: data[index].ma_vai_tro };
                await hamChung.xoa(formData, "vai_tro");
                viewTbody();
            }
        });
    });
}
