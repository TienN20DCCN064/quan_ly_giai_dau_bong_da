const btnLuuThayDoi = document.getElementById("button_luu");
const btnTaiLaiTrang = document.getElementById("button_taiLaiTrang");

const maTranDau = document.getElementById("maTranDau");
const maGiaiDau = document.getElementById("maGiaiDau");
const maDoi1 = document.getElementById("maDoi1");
const maDoi2 = document.getElementById("maDoi2");
const ngayDienRa = document.getElementById("ngayDienRa");
const gioDienRa = document.getElementById("gioDienRa");
const sanVanDong = document.getElementById("sanVanDong");
const maTrongTai = document.getElementById("maTrongTai");
const trangThai = document.getElementById("trangThai");
const maVongDau = document.getElementById("maVongDau");


document.addEventListener("DOMContentLoaded", async function () {
    loadDanhSachGiaiDau();
    loadDanhSachDoiBong_maDoi1();
    loadDanhSachDoiBong_maDoi2();
    loadDanhSachTrongTai();
    loadDanhSachVongDau();
    const data = await hamChung.layDanhSach("tran_dau");
    console.log(data);
    viewTbody(data);
    // hiện thị danh sách trận đấu có kq
    // Gọi danh sách các trận đấu và kết quả trận đấu
    const dsTranDau = await hamChung.layDanhSach("tran_dau");
    const dsKetQua = await hamChung.layDanhSach("ket_qua_tran_dau");

    document.getElementById("button_co_kq").addEventListener("click", async function () {


        // Lọc các trận đấu có kết quả
        const dsTranDauCoKQ = dsTranDau.filter(tranDau =>
            dsKetQua.some(kq => kq.ma_tran_dau === tranDau.ma_tran_dau)
        );

        // Gọi hàm hiển thị danh sách trận đấu có kết quả
        viewTbody(dsTranDauCoKQ);
    });

    // Xử lý sự kiện khi nhấn nút "Trận đấu chưa kết quả"
    document.getElementById("button_chua_kq").addEventListener("click", async function () {

        // Lọc các trận đấu chưa có kết quả
        const dsTranDauChuaKQ = dsTranDau.filter(tranDau =>
            !dsKetQua.some(kq => kq.ma_tran_dau === tranDau.ma_tran_dau)
        );

        // Gọi hàm hiển thị danh sách trận đấu chưa có kết quả
        viewTbody(dsTranDauChuaKQ);
    });


    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);
});

// Hiển thị danh sách trận đấu
async function layKetQua(ma_tran_dau) {
    const data = await hamChung.layThongTinTheo_ID("ket_qua_tran_dau", ma_tran_dau);
    let stringKetQua = "--";
    if (data != null) {

        stringKetQua = data.ma_doi_thang + " " + data.so_ban_doi_1 + ":" + data.so_ban_doi_2;
    }

    return stringKetQua;

}
async function viewTbody(data) {
    //console.log("ma_tran_dau:New " + await hamChung.taoID_theoBang("tran_dau"));
    if(data == null || data.length === 0) {
        data = await hamChung.layDanhSach("tran_dau");
    }
    const tableBody = document.getElementById("dataTable");
    tableBody.innerHTML = "";

    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const ketQua = await layKetQua(item.ma_tran_dau);
        console.log(ketQua);
        const row = document.createElement("tr");
        row.innerHTML = `
            <td style="text-align: center;">${item.ma_tran_dau}</td>
            <td style="text-align: center;">${item.ma_giai_dau}</td>
            <td style="text-align: center;">${item.ma_doi_1}</td>
            <td style="text-align: center;">${item.ma_doi_2}</td>
            <td style="text-align: center;">${item.ngay_dien_ra}</td>
            <td style="text-align: center;">${item.gio_dien_ra}</td>
            <td style="text-align: center;">${item.san_van_dong}</td>
            <td style="text-align: center;">${item.ma_trong_tai}</td>
            <td style="text-align: center;">${item.trang_thai}</td>
            <td style="text-align: center;">${item.ma_vong_dau}</td>
            <td style="text-align: center;">${ketQua}</td>
            <td style="text-align: center;"><button class="edit-btn btn btn-warning btn-sm">Sửa thông tin</button></td>
            <td style="text-align: center;"><button class="edit-kq-btn btn btn-warning btn-sm">Sửa kết quả </button></td>
            <td style="text-align: center;"><button class="delete-btn btn btn-danger btn-sm">Xóa</button></td>
        `;
        tableBody.appendChild(row);
    }

    button_sua(data);
    button_sua_ket_qua();
    button_xoa(data);
}


// Thêm/Sửa trận đấu
async function handleLuuThayDoi(event) {
    event.preventDefault();

    const form = document.getElementById("inputForm");
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    let formData = {};
    if (maTranDau.value === "") {
        formData = {
            ma_tran_dau: await hamChung.taoID_theoBang("tran_dau"),
            ma_giai_dau: maGiaiDau.value,
            ma_doi_1: maDoi1.value,
            ma_doi_2: maDoi2.value,
            ngay_dien_ra: ngayDienRa.value,
            gio_dien_ra: gioDienRa.value,
            san_van_dong: sanVanDong.value,
            ma_trong_tai: maTrongTai.value,
            trang_thai: trangThai.value,
            ma_vong_dau: maVongDau.value
        };
        await hamChung.them(formData, "tran_dau");
        alert("Thêm thành công!");
    } else {
        formData = {
            ma_tran_dau: maTranDau.value,
            ma_giai_dau: maGiaiDau.value,
            ma_doi_1: maDoi1.value,
            ma_doi_2: maDoi2.value,
            ngay_dien_ra: ngayDienRa.value,
            gio_dien_ra: gioDienRa.value,
            san_van_dong: sanVanDong.value,
            ma_trong_tai: maTrongTai.value,
            trang_thai: trangThai.value,
            ma_vong_dau: maVongDau.value
        };
        await hamChung.sua(formData, "tran_dau");
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
            console.log("Sửa thông tin trận đấu");
            const item = data[index];
            maTranDau.value = item.ma_tran_dau;
            maGiaiDau.value = item.ma_giai_dau;
            maDoi1.value = item.ma_doi_1;
            maDoi2.value = item.ma_doi_2;
            ngayDienRa.value = item.ngay_dien_ra;
            gioDienRa.value = item.gio_dien_ra;
            sanVanDong.value = item.san_van_dong;
            maTrongTai.value = item.ma_trong_tai;
            trangThai.value = item.trang_thai;
            maVongDau.value = item.ma_vong_dau;

            // Scroll lên đầu trang
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    });
}
function button_sua_ket_qua() {
    document.querySelectorAll(".edit-kq-btn").forEach((btn) => {

        btn.addEventListener("click", async () => {
            const tranDauId = btn.closest("tr").children[0].textContent;
            const btnLuuKetQua = document.getElementById("bt_luuKQ");
            const btnHuyThayDoi = document.getElementById("bt_huyThayDoi");
            const item = await hamChung.layThongTinTheo_ID("tran_dau", tranDauId);

            const modal = document.getElementById("modalKetQua");

            const soBanDoi1 = document.getElementById("soBanDoi1");
            const soBanDoi2 = document.getElementById("soBanDoi2");
            const doiThang = document.getElementById("doiThang");
            const ghiChu = document.getElementById("ghiChu");
            const optionDoi1 = document.getElementById("optionDoi1");
            const optionDoi2 = document.getElementById("optionDoi2");


            const doi1 = await hamChung.layThongTinTheo_ID("doi_bong", item.ma_doi_1);
            const doi2 = await hamChung.layThongTinTheo_ID("doi_bong", item.ma_doi_2);

            let ghiChuText = "";

            // const layDanhSach_kqTranDau = await hamChung.layDanhSach("ket_qua_tran_dau");
            // const tonTai = layDanhSach_kqTranDau.some(kq => kq.ma_tran_dau === tranDauId);
            // if (tonTai) {
            //     console.log("Trận đấu đã có kết quả, tiến hành sửa");
            //    ghiChuText = (await hamChung.layThongTinTheo_ID("ket_qua_tran_dau", tranDauId)).ghi_chu;
            // } 

            // console.log(tranDauId);
            // const kq_tranDau = await hamChung.layThongTinTheo_ID("ket_qua_tran_dau", tranDauId);
            // console.log(kq_tranDau);

            // Reset kết quả
            soBanDoi1.value = 0;
            soBanDoi2.value = 0;
            doiThang.value = "";
            ghiChu.value = ghiChuText; // Gán giá trị ghi chú nếu có
            // if(kq_tranDau != null){
            //     console.log(kq_tranDau);
            // }   
            // Gán dữ liệu vào các option đội thắng
            optionDoi1.value = item.ma_doi_1;
            optionDoi1.textContent = `${doi1.ma_doi_bong} - ${doi1.ten_doi_bong}`;

            optionDoi2.value = item.ma_doi_2;
            optionDoi2.textContent = `${doi2.ma_doi_bong} - ${doi2.ten_doi_bong}`;


            // Hiển thị modal
            modal.style.display = "block";
            console.log(doiThang.value);
            btnLuuKetQua.addEventListener("click", async () => {
                // Kiểm tra hợp lệ
                if (doiThang.value === "") {
                    alert("Vui lòng chọn đội thắng!");
                    return;
                }
                const formData = {
                    ma_tran_dau: tranDauId,
                    so_ban_doi_1: soBanDoi1.value,
                    so_ban_doi_2: soBanDoi2.value,
                    ma_doi_thang: doiThang.value,
                    ghi_chu: ghiChu.value
                };

                //  await hamChung.them(formData, "ket_qua_tran_dau");
                alert("Lưu kết quả thành công!");
                modal.style.display = "none"; // Đóng modal sau khi lưu
                console.log(formData);
                // await hamChung.sua(formData, "ket_qua_tran_dau");
                // nếu ID trận đấu chứa tôn tại trong bảng kêts quả thì là thêm 
                const ketQuaTranDau = await hamChung.layDanhSach("ket_qua_tran_dau");
                const tonTai = ketQuaTranDau.some(item => item.ma_tran_dau === tranDauId);

                if (tonTai) {
                    console.log("Trận đấu đã có kết quả, tiến hành sửa");
                    await hamChung.sua(formData, "ket_qua_tran_dau");
                } else {
                    console.log("Chưa có kết quả, tiến hành thêm");
                    await hamChung.them(formData, "ket_qua_tran_dau");
                }
                viewTbody();
            });
            btnHuyThayDoi.addEventListener("click", () => {
                modal.style.display = "none"; // Đóng modal khi nhấn nút hủy
            });
        });
    });
    // button_luu_sua_ket_qua();
}


// Xử lý nút "Xóa"
function button_xoa(data) {
    document.querySelectorAll(".delete-btn").forEach((btn, index) => {
        btn.addEventListener("click", async () => {
            if (confirm(`Bạn có chắc chắn muốn xóa trận đấu ${data[index].ma_tran_dau}?`)) {
                const formData = { ma_tran_dau: data[index].ma_tran_dau };
                await hamChung.xoa(formData, "tran_dau");
                viewTbody();
            }
        });
    });
}

async function loadDanhSachGiaiDau() {
    const selectElement = document.getElementById("maGiaiDau");
    selectElement.innerHTML = '<option value="">-- Chọn Mã Giải Đấu --</option>'; // Reset danh sách
    const data = await hamChung.layDanhSach("giai_dau");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_giai_dau;
        option.textContent = `${item.ma_giai_dau} - ${item.ten_giai_dau}`;
        selectElement.appendChild(option);
    });
}
async function loadDanhSachDoiBong_maDoi1() {
    const selectElement = document.getElementById("maDoi1");
    selectElement.innerHTML = '<option value="">-- Chọn Đội 1 --</option>'; // Reset danh sách
    const data = await hamChung.layDanhSach("doi_bong");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_doi_bong;
        option.textContent = `${item.ma_doi_bong} - ${item.ten_doi_bong}`;
        selectElement.appendChild(option);
    });
}
async function loadDanhSachDoiBong_maDoi2() {
    const selectElement = document.getElementById("maDoi2");
    selectElement.innerHTML = '<option value="">-- Chọn Đội 2 --</option>'; // Reset danh sách
    const data = await hamChung.layDanhSach("doi_bong");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_doi_bong;
        option.textContent = `${item.ma_doi_bong} - ${item.ten_doi_bong}`;
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
        option.textContent = `${item.ma_trong_tai} - ${item.ho_ten}`;
        selectElement.appendChild(option);
    });
}
async function loadDanhSachVongDau() {
    const selectElement = document.getElementById("maVongDau");
    selectElement.innerHTML = '<option value="">-- Chọn Vòng Đấu --</option>'; // Reset danh sách
    const data = await hamChung.layDanhSach("vong_dau");
    console.log(data);
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_vong_dau;
        option.textContent = `${item.ma_vong_dau} - ${item.ten_vong}`;
        selectElement.appendChild(option);
    });
}