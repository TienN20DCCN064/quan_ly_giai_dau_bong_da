const btnLuuThayDoi = document.getElementById("button_luu");
const btnTaiLaiTrang = document.getElementById("button_taiLaiTrang");
const button_xepLich = document.getElementById("button_xepLich");

const maTranDau = document.getElementById("maTranDau");
const maGiaiDau = document.getElementById("maGiaiDau");
const maDoi1 = document.getElementById("maDoi1");
const maDoi2 = document.getElementById("maDoi2");
const ngayDienRa = document.getElementById("ngayDienRa");
const gioDienRa = document.getElementById("gioDienRa");
const sanVanDong = document.getElementById("sanVanDong");
// const maTrongTai = document.getElementById("maTrongTai");
const button_xem_ds_trongTai = document.getElementById("button_xem_ds_trongTai");

const button_luu_danhSachTranDau = document.getElementById("bt_luuDanhSachTranDau_tuDong");
const trangThai = document.getElementById("trangThai");
const maVongDau = document.getElementById("maVongDau");
// const link = "http://localhost:5000/";

let danhSach_doiBong_theoBang;

document.addEventListener("DOMContentLoaded", async function () {
    loadDanhSachGiaiDau();
    loadDanhSachDoiBong_maDoi1();
    loadDanhSachDoiBong_maDoi2();
    // loadDanhSachTrongTai();
    loadDanhSachVongDau();
    loadDanhSachSanVanDong();
    loadDanhSach_hinhThuc_xepTranDau();
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

        // Tìm các mã trận đấu chưa có trong bảng kết quả
        const dsTranDauChuaKQ = dsTranDau
            .filter(tranDau =>
                !dsKetQua.some(kq => kq.ma_tran_dau === tranDau.ma_tran_dau)
            )

        console.log(dsTranDauChuaKQ);
        // Gọi hàm hiển thị danh sách trận đấu chưa có kết quả
        viewTbody(dsTranDauChuaKQ);
    });


    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);
    button_xepLich.addEventListener("click", handleXepLich);
    button_xem_ds_trongTai.addEventListener("click", handleXemDanhSachTrongTai);
    button_luu_danhSachTranDau.addEventListener("click", themDanhSachTranDau_vaoDaTa);

    document.getElementById("chon_hinhThuc_tao_tran").addEventListener("change", async function () {
        // console.log(document.getElementById("chon_hinhThuc_tao_tran").value);
        thongBao_tonTaiTranDau();
    });
});
async function thongBao_tonTaiTranDau() {
    document.getElementById("thong_bao").innerText = "";
    if (document.getElementById("chon_hinhThuc_tao_tran").value === "chia-bang") {
        const tonTai = await check_giaiDau_coTrong_tranDau(document.getElementById("maGiaiDau_chon").value);
        if (tonTai) {
            document.getElementById("thong_bao").innerText = "Đã tồn tại trận đấu trong giải!";
        }
    }
}
async function check_giaiDau_coTrong_tranDau(ma_giai_dau) {
    const data_tranDau = await hamChung.layDanhSach("tran_dau");

    // Kiểm tra xem có trận đấu nào có ma_giai_dau trùng không
    return data_tranDau.some(tranDau => tranDau.ma_giai_dau === ma_giai_dau);
}


// Hiển thị danh sách trận đấu
async function layKetQua(ma_tran_dau) {
    const data_kqTranDau = await hamChung.layDanhSach("ket_qua_tran_dau");

    const tranDau = data_kqTranDau.find(data => data.ma_tran_dau === ma_tran_dau);
    let stringKetQua = "--";

    if (!tranDau) {
        console.log("Không tìm thấy trận đấu với mã:", ma_tran_dau);
        return stringKetQua;
    }
    // nếu có trận đấu thì
    const data = await hamChung.layThongTinTheo_ID("ket_qua_tran_dau", ma_tran_dau);
    console.log(ma_tran_dau);
    const data_doiThang = await hamChung.layThongTinTheo_ID("doi_bong", data.ma_doi_thang);
    if (data != null) {

        stringKetQua = data_doiThang.ten_doi_bong + " " + data.so_ban_doi_1 + ":" + data.so_ban_doi_2;
    }
    console.log(stringKetQua);
    return stringKetQua;

}
async function viewTbody(data) {
    //console.log("ma_tran_dau:New " + await hamChung.taoID_theoBang("tran_dau"));
    if (data == null || data.length === 0) {
        data = await hamChung.layDanhSach("tran_dau");
    }
    const tableBody = document.getElementById("dataTable");
    console.log("tien tien tien tien");
    console.log(data);
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
            <td style="text-align: center;">${item.ma_san}</td>
            <td style="text-align: center;"><button class="xemTrongTai-btn btn btn-warning btn-sm">Xem ds</button></td>
            <td style="text-align: center;">${item.trang_thai}</td>
            <td style="text-align: center;">${item.ma_vong_dau}</td>
            <td style="text-align: center;">${ketQua}</td>
            <td style="text-align: center;"><button class="edit-btn btn btn-warning btn-sm">Sửa thông tin</button></td>
            <td style="text-align: center;"><button class="edit-kq-btn btn btn-warning btn-sm">Sửa kết quả </button></td>
            <td style="text-align: center;"><button class="delete-btn btn btn-danger btn-sm">Xóa</button></td>
        `;
        tableBody.appendChild(row);
    }
    button_xemDs_trongTai_table();
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
            ma_san: sanVanDong.value,
            // ma_trong_tai: maTrongTai.value,
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
            ma_san: sanVanDong.value,
            // ma_trong_tai: maTrongTai.value,
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
            sanVanDong.value = item.ma_san;
            // maTrongTai.value = item.ma_trong_tai;
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

function handleXemDanhSachTrongTai(event) {
    event.preventDefault();
    console.log("Chưa làm này chưa làm này ");

}
// function handleXepLich(event) {
//     event.preventDefault();
//     console.log("Xếp lịch");

// }
// Xử lý nút "Xóa"
function button_xemDs_trongTai_table() {
    document.querySelectorAll(".xemTrongTai-btn").forEach((btn) => {
        btn.addEventListener("click", async () => {
            const tranDauId = btn.closest("tr").children[0].textContent;
            console.log(tranDauId);
            const dataTrongTai = await hamChung.layDanhSach("trong_tai_tran_dau");
            const dsTrongTaiCuaTranDau = dataTrongTai.filter(item => item.ma_tran_dau === tranDauId);
            console.log(dsTrongTaiCuaTranDau);
            const modal = document.getElementById("modalKetQua");
            modal.style.display = "block";
            const tt_chinh = document.getElementById("tt_chinh");
            const tt_phu = document.getElementById("tt_phu");
            const tt_ban = document.getElementById("tt_ban");
            const tt_var = document.getElementById("tt_var");
            const btnLuuKetQua = document.getElementById("bt_luu_tt");
            const btnHuyThayDoi = document.getElementById("bt_huy_luu_tt");
            loadDanhSachTrongTai("tt_chinh");
            loadDanhSachTrongTai("tt_phu");
            loadDanhSachTrongTai("tt_ban");
            loadDanhSachTrongTai("tt_var");
            console.log(tranDauId);
            btnHuyThayDoi.addEventListener("click", () => {
                console.log("tienbloc");
                modal.style.display = "none"; // Đóng modal khi nhấn nút hủy
            });
            btnLuuKetQua.addEventListener("click", () => {
                console.log("Lưu trọng tài");

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



async function loadDanhSachSanVanDong() {
    const selectElement = document.getElementById("sanVanDong");
    selectElement.innerHTML = '<option value="">-- Chọn Sân Vận Động --</option>'; // Reset danh sách
    const data = await hamChung.layDanhSach("san_van_dong");
    console.log(data);
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_san;
        option.textContent = `${item.ma_san} - ${item.ten_san}`;
        selectElement.appendChild(option);
    });
}
async function loadDanhSachTrongTai(id) {
    const selectElement = document.getElementById(id);
    console.log(id);
    selectElement.innerHTML = '<option value="">-- Chọn--</option>'; // Reset danh sách
    const data = await hamChung.layDanhSach("loai_trong_tai");
    // console.log(data);
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_loai_trong_tai;
        option.textContent = `${item.ma_loai_trong_tai} - ${item.ten_loai_trong_tai}`;
        selectElement.appendChild(option);
    });
}
/////////////////////////////////////////

function handleXepLich(event) {
    loadDanhSachGiaiDau_chon();

    const vongDauTruocDiv = document.getElementById("vongDauTruocContainer");
    const hinhThucTaoTran = document.getElementById("chon_hinhThuc_tao_tran").value;
    if (hinhThucTaoTran === "chia-bang") {
        vongDauTruocDiv.style.display = "none";
    } else {
        vongDauTruocDiv.style.display = "block"; // hoặc "flex" nếu dùng flexbox
    }

    console.log("tien");
    event.preventDefault();
    // const trangThaiDuyet = document.getElementById("trangThai_chon");
    // Hiển thị bảng popupOverlay
    document.getElementById("popupOverlay").classList.remove("hidden");
    // Sự kiện khi nhấn nút "Đóng" trong bảng
    document.getElementById("closePopup").addEventListener("click", function () {
        // Ẩn bảng khi nhấn nút "Đóng"
        document.getElementById("popupOverlay").classList.add("hidden");
    });

    document.getElementById("maGiaiDau_chon").addEventListener("change", function () {
        loadDanhSachVongDau_Da_Da(document.getElementById("maVongDau_chon"));
    });


    // Gắn sự kiện cho cả hai
    document.getElementById("maGiaiDau_chon").addEventListener("change", async function () {
        console.log(document.getElementById("chon_hinhThuc_tao_tran").value);
        thongBao_tonTaiTranDau();
        if (document.getElementById("chon_hinhThuc_tao_tran").value === "chia-bang") {
            document.getElementById("danhSachBangContainer").style.display = "block";

            const danhSachBang = document.getElementById("danhSachBang");

            const data_bangDau = await hamChung.layDanhSach("bang_dau");
            const data_bangDau_giaiDau = data_bangDau.filter(item => item.ma_giai_dau === document.getElementById("maGiaiDau_chon").value);
            const danhSachBangTen = data_bangDau_giaiDau.map(item => item.ten_bang_dau);

            danhSachBang.innerHTML = '';  // Clear dữ liệu cũ

            // Duyệt qua danh sách bảng và hiển thị
            danhSachBangTen.forEach(bang => {
                const li = document.createElement('li');
                li.textContent = bang;
                danhSachBang.appendChild(li);
            });
        }
        handleSelectionChange();
    });
    document.getElementById("maVongDau_chon").addEventListener("change", async function () {

        handleSelectionChange();
    });
    // document.getElementById("maVongDau_chon").addEventListener("change", handleSelectionChange);

    document.getElementById("chon_hinhThuc_tao_tran").addEventListener("change", async function () {

        // console.log(vongDauTruocDiv);
        const vongDauTruocDiv = document.getElementById("vongDauTruocContainer");
        const danhSachBangContainer = document.getElementById("danhSachBangContainer");

        // Kiểm tra giá trị của hình thức tạo trận
        if (document.getElementById("chon_hinhThuc_tao_tran").value === "chia-bang") {
            // Ẩn vòng đấu trước
            vongDauTruocDiv.style.display = "none";
            danhSachBangContainer.style.display = "block";




        } else {
            // Nếu không phải chia bảng, ẩn danh sách bảng
            vongDauTruocDiv.style.display = "block"; // Hiện lại phần vòng đấu trước
            danhSachBangContainer.style.display = "none"; // Ẩn danh sách bảng
        }
        handleSelectionChange()

    });

    // document.getElementById("button_tao_tran").addEventListener("click", function () {
    //     // Làm trống nội dung bảng
    //     const tbody = document.getElementById("bodyBangTaoTran");
    //     tbody.innerHTML = '';  // Xóa hết các dòng trong tbody
    //     taoTranDau(document.getElementById("chon_hinhThuc_tao_tran").value);
    // });

    document.getElementById("button_tao_tran").addEventListener("click", function () {
        // Làm mờ popupOverlay
        document.getElementById("popupOverlay").classList.add("disabled-overlay");

        // Xóa nội dung bảng tạo trận
        const tbody = document.getElementById("bodyBangTaoTran");
        tbody.innerHTML = '';

        // Gọi hàm tạo trận đấu
        taoTranDau(document.getElementById("chon_hinhThuc_tao_tran").value);




    });



    document.getElementById("button_chon_tat_ca").addEventListener("click", function (e) {
        const checkboxes = document.querySelectorAll('.checkbox-chon');
        checkboxes.forEach(checkbox => {
            checkbox.checked = true; // Đánh dấu tất cả các checkbox là checked
        });
    });



}
// chỉ cần có hình thức thì nó làm được hết
async function taoTranDau(hinhThucTaoTran) {

    document.getElementById("btnCloseBangTaoTran").addEventListener("click", function (event) {
        event.preventDefault(); // Ngăn không cho reload trang
        document.getElementById("bangTaoTran").classList.add("hidden"); // Ẩn thẻ <div id="bangTaoTran">
        document.getElementById("popupOverlay").classList.remove("disabled-overlay");
    });

    // Hiển thị bảng tạo trận đấu
    console.log("Hình thưc tạo trận đấu: " + hinhThucTaoTran);
    if (hinhThucTaoTran === "chia-bang") {

        // Thêm chữ "Lê Văn Tiến" vào thẻ <div class="card-header" id="danhSachDoiBong_theoBang">
        const maGiaiDau = document.getElementById("maGiaiDau_chon");

        const data_bangDau = await hamChung.layDanhSach("bang_dau");
        const data_bangDau_giaiDau = data_bangDau.filter(item => item.ma_giai_dau === maGiaiDau.value);
        console.log(data_bangDau_giaiDau.length);
        console.log(getSelectedCheckboxes());
        console.log(getSelectedCheckboxes_hatGiong());

        const bangDau_tranDau = await hamChung.taoTranDau_chiaBang(getSelectedCheckboxes(), getSelectedCheckboxes_hatGiong(), data_bangDau_giaiDau, false);
        console.log(bangDau_tranDau);
        danhSach_doiBong_theoBang = bangDau_tranDau;
        // Tạo danh sách bảng đấu với đội bóng
        let danhSachBang = "<ul>"; // Bắt đầu danh sách

        // Lặp qua mảng 'bangs' để in thông tin từng bảng
        console.log(bangDau_tranDau.bangs);
        bangDau_tranDau.bangs.forEach((bang, index) => {
            // Kiểm tra nếu 'bang' và 'bang.bang' có dữ liệu hợp lệ
            if (bang && bang.bang && bang.bang.ten_bang_dau) {
                // Thêm thông tin bảng vào danh sách
                danhSachBang += `<li><strong>Bảng ${index + 1} (${bang.bang.ten_bang_dau}):</strong><ul>`;

                // Kiểm tra xem 'bang.doi' có phải là mảng không và chứa các đội bóng
                if (Array.isArray(bang.doi) && bang.doi.length > 0) {
                    bang.doi.forEach((doi, doiIndex) => {
                        // Hiển thị thông tin đội bóng. Giả sử 'doi' là mã đội, bạn có thể thay đổi nếu có thêm thông tin đội.
                        danhSachBang += `<li>Đội ${doiIndex + 1}: ${doi}</li>`;
                    });
                } else {
                    // Nếu không có đội bóng, hiển thị thông báo
                    danhSachBang += `<li>Không có đội bóng trong bảng</li>`;
                }

                danhSachBang += "</ul></li>"; // Kết thúc danh sách đội bóng trong bảng
            } else {
                // Nếu dữ liệu bảng không hợp lệ, hiển thị cảnh báo
                console.warn("Dữ liệu bảng không hợp lệ:", bang);
            }
        });

        danhSachBang += "</ul>"; // Kết thúc danh sách bảng

        // Cập nhật nội dung của thẻ div
        document.getElementById("danhSachDoiBong_theoBang").innerHTML = "Danh sách đội bóng theo bảng đấu" + danhSachBang;
        // Ẩn bảng tạo trận
        document.getElementById("bangTaoTran").classList.add("hidden");

        const dataSanVanDong = await hamChung.layDanhSach("san_van_dong");
        // chỉ lấy mã sân
        const danhSachSan = dataSanVanDong.map(item => item.ma_san);

        const danhSachDoiBong_theoBang = bangDau_tranDau.bangs;

        console.log(await taoTranDau_theoNhieuBang(danhSachDoiBong_theoBang));
        // const test =  await hamChung.taoTranDau_vongTron(danhSachDoiBong_theoBang[0].doi);
        // console.log(test);


        const danhSanhTranDau_theoBang = await taoTranDau_theoNhieuBang(danhSachDoiBong_theoBang);
        const danhSachTranDau_theoBang_coNgayGio = await themNgayGioSan_choData(danhSanhTranDau_theoBang);


        //let danhSachSan = ['Sân 1', 'Sân 2', 'Sân 3']; // Các sân có sẵn
        const ngayBatDau = document.getElementById("chon_ngayBatDau").value; // Ngày bắt đầu từ input
        const gioBatDau = document.getElementById("chon_gioBatDau").value; // Giờ bắt đầu từ input
        const danhSach_LichThiDauTuDong = await taoLichThiDauTuDong(danhSachTranDau_theoBang_coNgayGio, ngayBatDau, gioBatDau, danhSachSan); // Gọi hàm với ngày và giờ bắt đầu


        view_danhSachTranDau_duocTao(danhSach_LichThiDauTuDong);


        // Bắt sự kiện khi thay đổi ngày
        document.getElementById("chon_ngayBatDau").addEventListener("change", async function () {
            //let danhSachSan = ['Sân 1', 'Sân 2', 'Sân 3']; // Các sân có sẵn
            const ngayBatDau = document.getElementById("chon_ngayBatDau").value; // Ngày bắt đầu từ input
            const gioBatDau = document.getElementById("chon_gioBatDau").value; // Giờ bắt đầu từ input
            const danhSach_LichThiDauTuDong = await taoLichThiDauTuDong(danhSachTranDau_theoBang_coNgayGio, ngayBatDau, gioBatDau, danhSachSan); // Gọi hàm với ngày và giờ bắt đầu

            view_danhSachTranDau_duocTao(danhSach_LichThiDauTuDong);
        });

        // Bắt sự kiện khi thay đổi giờ
        document.getElementById("chon_gioBatDau").addEventListener("change", async function () {
            //let danhSachSan = ['Sân 1', 'Sân 2', 'Sân 3']; // Các sân có sẵn
            const ngayBatDau = document.getElementById("chon_ngayBatDau").value; // Ngày bắt đầu từ input
            const gioBatDau = document.getElementById("chon_gioBatDau").value; // Giờ bắt đầu từ input
            const danhSach_LichThiDauTuDong = await taoLichThiDauTuDong(danhSachTranDau_theoBang_coNgayGio, ngayBatDau, gioBatDau, danhSachSan); // Gọi hàm với ngày và giờ bắt đầu

            view_danhSachTranDau_duocTao(danhSach_LichThiDauTuDong);
        });


        console.log("Vòng tròn chia bảng");
    }
    else if (hinhThucTaoTran === "vong-tron") {

        console.log("Vòng tròn");
        const bangDau_tranDau = await hamChung.taoTranDau_chiaBang(getSelectedCheckboxes(), getSelectedCheckboxes_hatGiong(), "A", false);
        console.log(bangDau_tranDau);


        const dataSanVanDong = await hamChung.layDanhSach("san_van_dong");
        // chỉ lấy mã sân
        const danhSachSan = dataSanVanDong.map(item => item.ma_san);

        const danhSachDoiBong_theoBang = bangDau_tranDau.bangs;

        console.log(await taoTranDau_theoNhieuBang(danhSachDoiBong_theoBang));
        // const test =  await hamChung.taoTranDau_vongTron(danhSachDoiBong_theoBang[0].doi);
        // console.log(test);


        const danhSanhTranDau_theoBang = await taoTranDau_theoNhieuBang(danhSachDoiBong_theoBang);
        const danhSachTranDau_theoBang_coNgayGio = await themNgayGioSan_choData(danhSanhTranDau_theoBang);


        //let danhSachSan = ['Sân 1', 'Sân 2', 'Sân 3']; // Các sân có sẵn
        const ngayBatDau = document.getElementById("chon_ngayBatDau").value; // Ngày bắt đầu từ input
        const gioBatDau = document.getElementById("chon_gioBatDau").value; // Giờ bắt đầu từ input
        const danhSach_LichThiDauTuDong = await taoLichThiDauTuDong(danhSachTranDau_theoBang_coNgayGio, ngayBatDau, gioBatDau, danhSachSan); // Gọi hàm với ngày và giờ bắt đầu


        view_danhSachTranDau_duocTao(danhSach_LichThiDauTuDong);
        // Bắt sự kiện khi thay đổi ngày
        document.getElementById("chon_ngayBatDau").addEventListener("change", async function () {
            //let danhSachSan = ['Sân 1', 'Sân 2', 'Sân 3']; // Các sân có sẵn
            const ngayBatDau = document.getElementById("chon_ngayBatDau").value; // Ngày bắt đầu từ input
            const gioBatDau = document.getElementById("chon_gioBatDau").value; // Giờ bắt đầu từ input
            const danhSach_LichThiDauTuDong = await taoLichThiDauTuDong(danhSachTranDau_theoBang_coNgayGio, ngayBatDau, gioBatDau, danhSachSan); // Gọi hàm với ngày và giờ bắt đầu

            view_danhSachTranDau_duocTao(danhSach_LichThiDauTuDong);
        });

        // Bắt sự kiện khi thay đổi giờ
        document.getElementById("chon_gioBatDau").addEventListener("change", async function () {
            //let danhSachSan = ['Sân 1', 'Sân 2', 'Sân 3']; // Các sân có sẵn
            const ngayBatDau = document.getElementById("chon_ngayBatDau").value; // Ngày bắt đầu từ input
            const gioBatDau = document.getElementById("chon_gioBatDau").value; // Giờ bắt đầu từ input
            const danhSach_LichThiDauTuDong = await taoLichThiDauTuDong(danhSachTranDau_theoBang_coNgayGio, ngayBatDau, gioBatDau, danhSachSan); // Gọi hàm với ngày và giờ bắt đầu

            view_danhSachTranDau_duocTao(danhSach_LichThiDauTuDong);
        });


    }
    else if (hinhThucTaoTran === "loai-truc-tiep") {
        const bangDau_tranDau = await hamChung.taoTranDau_chiaBang(getSelectedCheckboxes(), getSelectedCheckboxes_hatGiong(), "A", false);
        console.log(bangDau_tranDau);


        const dataSanVanDong = await hamChung.layDanhSach("san_van_dong");
        // chỉ lấy mã sân
        const danhSachSan = dataSanVanDong.map(item => item.ma_san);

        const danhSachDoiBong_theoBang = bangDau_tranDau.bangs;

        console.log(await taoTranDau_theo_loaiTrucTiep(danhSachDoiBong_theoBang));
        // const test =  await hamChung.taoTranDau_vongTron(danhSachDoiBong_theoBang[0].doi);
        // console.log(test);


        const danhSanhTranDau_theoBang = await taoTranDau_theo_loaiTrucTiep(danhSachDoiBong_theoBang);
        const danhSachTranDau_theoBang_coNgayGio = await themNgayGioSan_choData(danhSanhTranDau_theoBang);


        //let danhSachSan = ['Sân 1', 'Sân 2', 'Sân 3']; // Các sân có sẵn
        const ngayBatDau = document.getElementById("chon_ngayBatDau").value; // Ngày bắt đầu từ input
        const gioBatDau = document.getElementById("chon_gioBatDau").value; // Giờ bắt đầu từ input
        const danhSach_LichThiDauTuDong = await taoLichThiDauTuDong(danhSachTranDau_theoBang_coNgayGio, ngayBatDau, gioBatDau, danhSachSan); // Gọi hàm với ngày và giờ bắt đầu


        view_danhSachTranDau_duocTao(danhSach_LichThiDauTuDong);


        // Bắt sự kiện khi thay đổi ngày
        document.getElementById("chon_ngayBatDau").addEventListener("change", async function () {
            //let danhSachSan = ['Sân 1', 'Sân 2', 'Sân 3']; // Các sân có sẵn
            const ngayBatDau = document.getElementById("chon_ngayBatDau").value; // Ngày bắt đầu từ input
            const gioBatDau = document.getElementById("chon_gioBatDau").value; // Giờ bắt đầu từ input
            const danhSach_LichThiDauTuDong = await taoLichThiDauTuDong(danhSachTranDau_theoBang_coNgayGio, ngayBatDau, gioBatDau, danhSachSan); // Gọi hàm với ngày và giờ bắt đầu

            view_danhSachTranDau_duocTao(danhSach_LichThiDauTuDong);
        });

        // Bắt sự kiện khi thay đổi giờ
        document.getElementById("chon_gioBatDau").addEventListener("change", async function () {
            //let danhSachSan = ['Sân 1', 'Sân 2', 'Sân 3']; // Các sân có sẵn
            const ngayBatDau = document.getElementById("chon_ngayBatDau").value; // Ngày bắt đầu từ input
            const gioBatDau = document.getElementById("chon_gioBatDau").value; // Giờ bắt đầu từ input
            const danhSach_LichThiDauTuDong = await taoLichThiDauTuDong(danhSachTranDau_theoBang_coNgayGio, ngayBatDau, gioBatDau, danhSachSan); // Gọi hàm với ngày và giờ bắt đầu

            view_danhSachTranDau_duocTao(danhSach_LichThiDauTuDong);
        });
    }

    document.getElementById("bangTaoTran").classList.remove("hidden");







}


async function taoTranDau_theoNhieuBang(danhSachDoiBong_theoBang) {
    let danhSanhTranDau_theoBang = [];

    for (let i = 0; i < danhSachDoiBong_theoBang.length; i++) {
        const doi = danhSachDoiBong_theoBang[i].doi;
        const bang = danhSachDoiBong_theoBang[i].bang;
        console.log(`Đội: ${doi}, Bảng: ${bang}`);

        // Gọi hàm tạo trận đấu cho từng bảng
        const tranDau_xepTheoBang = await hamChung.taoTranDau_vongTron(doi);

        // Thêm bảng vào trận đấu và thêm trận đấu vào danh sách
        tranDau_xepTheoBang.bang = bang; // Thêm thông tin bảng vào trận đấu
        danhSanhTranDau_theoBang.push(tranDau_xepTheoBang);
    }

    // Trả về danh sách trận đấu
    return danhSanhTranDau_theoBang;
}
async function taoTranDau_theo_loaiTrucTiep(danhSachDoiBong_theoBang) {
    let danhSanhTranDau_theoBang = [];

    for (let i = 0; i < danhSachDoiBong_theoBang.length; i++) {
        const doi = danhSachDoiBong_theoBang[i].doi;
        const bang = danhSachDoiBong_theoBang[i].bang;
        console.log(`Đội: ${doi}, Bảng: ${bang}`);

        // Gọi hàm tạo trận đấu cho từng bảng
        const tranDau_xepTheoBang = await hamChung.taoTranDau_loaiTrucTiep(doi);

        // Thêm bảng vào trận đấu và thêm trận đấu vào danh sách
        tranDau_xepTheoBang.bang = bang; // Thêm thông tin bảng vào trận đấu
        danhSanhTranDau_theoBang.push(tranDau_xepTheoBang);
    }

    // Trả về danh sách trận đấu
    return danhSanhTranDau_theoBang;
}

async function themNgayGioSan_choData(danhSachTranDau_theoBang) {
    danhSachTranDau_theoBang.forEach((tran) => {
        tran.lich_thi_dau.forEach((lichThiDau) => {
            lichThiDau.ngay = lichThiDau.ngay || ""; // Nếu chưa có ngày thì gán "Chưa xác định"
            lichThiDau.gio = lichThiDau.gio || "";   // Nếu chưa có giờ thì gán "Chưa xác định"
            lichThiDau.san = lichThiDau.san || "";   // Nếu chưa có sân thì gán "Chưa xác định"
        });
    });
    return danhSachTranDau_theoBang; // Trả về danh sách đã được cập nhật

}
// tôi muốn tạo 1 hàm có chức năng tự động sắp xệp ngày đá và giờ đá cho các trận đấu trong bảng đấu với đầu vào là danhSachTranDau_theoBang, ngày đá và giờ đá
async function taoLichThiDauTuDong(danhSachTranDau_theoBang, ngayBatDau, gioBatDau, danhSachSan) {
    let currentDate = new Date(ngayBatDau); // Chuyển đổi ngày bắt đầu thành đối tượng Date
    let currentTime = gioBatDau; // Giữ lại giờ bắt đầu
    let currentSanIndex = 0; // Biến chỉ mục cho danh sách sân

    // Lặp qua từng bảng đấu
    danhSachTranDau_theoBang.forEach((bangData) => {
        const lichThiDau = bangData.lich_thi_dau; // Danh sách các trận đấu của bảng

        // Lặp qua từng trận đấu trong bảng
        lichThiDau.forEach((tran, indexTran) => {
            // Tự động gán ngày, giờ cho trận đấu
            tran.ngay = currentDate.toISOString().split('T')[0]; // Lấy ngày từ đối tượng Date
            tran.gio = currentTime; // Gán giờ
            tran.san = danhSachSan[currentSanIndex] || "Chưa xác định"; // Gán sân (dùng sân theo vòng tuần hoàn)

            // Cập nhật chỉ mục sân (quay lại đầu danh sách sân nếu hết)
            currentSanIndex = (currentSanIndex + 1) % danhSachSan.length;

            // Nếu đã duyệt hết các sân, tăng giờ lên 1
            if (currentSanIndex === 0) {
                currentTime = incrementTime(currentTime, 2); // Tăng giờ lên 2h
            }
        });
    });

    return danhSachTranDau_theoBang; // Trả về danh sách đã được cập nhật
}

// Hàm giúp tăng giờ (mỗi trận cách nhau N giờ)
function incrementTime(time, soGioTangThem = 1) {
    let [hours, minutes] = time.split(':').map(Number);
    hours += soGioTangThem;
    if (hours >= 24) {
        hours = hours % 24;
    }
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

async function view_danhSachTranDau_duocTao(danhSanhTranDau_theoBang) {
    const tbody = document.getElementById("bodyBangTaoTran");
    tbody.innerHTML = ""; // ❗️XÓA TOÀN BỘ CŨ

    // Duyệt qua tất cả các bảng và trận đấu trong mỗi bảng
    const dataSanVanDong = await hamChung.layDanhSach("san_van_dong");
    // chỉ lấy mã sân
    const danhSachSan = dataSanVanDong.map(item => item.ma_san);



    danhSanhTranDau_theoBang.forEach((bangData, indexBang) => {
        const bang = bangData.bang; // Thông tin về bảng
        const lichThiDau = bangData.lich_thi_dau; // Danh sách các trận đấu của bảng

        // Tạo một dòng cho thông tin bảng (mỗi bảng có thể có một dòng riêng)
        lichThiDau.forEach((tran, indexTran) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${bangData.bang.ten_bang_dau || '---'} </td> <!-- Số thứ tự bảng -->
                <td>${tran.tran}</td> <!-- Số trận đấu -->
                <td>${tran.doi1}</td>
                <td>${tran.doi2}</td>
                <td><input type="date" value="${tran.ngay || ''}" data-field="ngay" data-index="${indexBang}-${indexTran}"></td>
                <td><input type="time" value="${tran.gio || ''}" data-field="gio" data-index="${indexBang}-${indexTran}"></td>
                <td>
                    <select data-field="san" data-index="${indexBang}-${indexTran}">
                        ${dataSanVanDong.map(san => `
                        <option value="${san.ma_san}" ${tran.san === san.ma_san ? 'selected' : ''}>
                            ${san.ma_san} - ${san.ten_san}
                        </option>
                        `).join('')}
                    </select>
                </td>

            `;

            // Lắng nghe sự kiện khi người dùng thay đổi giá trị
            row.querySelectorAll('input').forEach(input => {
                input.addEventListener('change', function () {
                    const field = input.getAttribute('data-field');
                    const [indexBang, indexTran] = input.getAttribute('data-index').split('-').map(Number);

                    // Cập nhật thông tin trong mảng tranDauData
                    danhSanhTranDau_theoBang[indexBang].lich_thi_dau[indexTran][field] = input.value;
                });
            });

            tbody.appendChild(row);
        });
    });
}


// Hàm xử lý khi 1 trong 2 thay đổi
async function handleSelectionChange() {
    const maGiaiDau = document.getElementById("maGiaiDau_chon");
    const maVongDau = document.getElementById("maVongDau_chon");



    console.log("Giải đấu:", maGiaiDau.value);
    console.log("Vòng đấu:", maVongDau.value);

    // sau khi nhập đội tuyển
    const data_doiBongGiaiDau = await hamChung.layDanhSach("doi_bong_giai_dau");

    let data_doiBong_giaiDau;
    let dataDoiBongTrongVong = [];


    if (maGiaiDau.value !== "All") {
        // mặc định là tất cả
        if (maVongDau.value == "All" || document.getElementById("chon_hinhThuc_tao_tran").value === "chia-bang") {
            console.log(document.getElementById("chon_hinhThuc_tao_tran").value);
            data_doiBong_giaiDau = data_doiBongGiaiDau.filter(item => item.ma_giai_dau === maGiaiDau.value);
            console.log(data_doiBong_giaiDau);
            viewTbody_chon(data_doiBong_giaiDau);
        }
        // nếu chọn mã
        else {
            const data11 = await lay_data_doiBong_vong_giaiDau(maGiaiDau.value, maVongDau.value);
            console.log(data11);
            viewTbody_chon(data11);
            //  viewTbody_chon(dataDoiBongTrongVong);
        }
    }
    else {
        const tableBody = document.getElementById("dataTable_chon").getElementsByTagName('tbody')[0];
        tableBody.innerHTML = ""; // Xóa dữ liệu hiện tại
    }



}
async function lay_data_doiBong_vong_giaiDau(maGiaiDau, maVongDau) {
    // sau khi nhập đội tuyển
    const data_doiBongGiaiDau = await hamChung.layDanhSach("doi_bong_giai_dau");
    let data_doiBong_giaiDau;
    let dataDoiBongTrongVong = [];
    data_doiBong_giaiDau = data_doiBongGiaiDau.filter(item => item.ma_giai_dau === maGiaiDau);
    const dataDoiBong = await hamChung.layDanhSach("doi_bong");
    const dataTranDau = await hamChung.layDanhSach("tran_dau");
    const dataTranDau_theoVong = dataTranDau.filter(item => item.ma_vong_dau === maVongDau);
    const dataTranDau_theoVong_giaiDau = dataTranDau_theoVong.filter(item => item.ma_giai_dau === maGiaiDau);
    console.log(dataTranDau_theoVong_giaiDau);

    // Lấy danh sách mã đội bóng xuất hiện trong ma_doi_1 và ma_doi_2
    const danhSachMaDoiBong = [
        ...new Set(
            dataTranDau_theoVong_giaiDau.flatMap(item => [item.ma_doi_1, item.ma_doi_2])
        )
    ];
    console.log(danhSachMaDoiBong);
    // Lọc đội bóng từ data_doiBong_giaiDau theo danh sách mã đội bóng

    for (let i = 0; i < danhSachMaDoiBong.length; i++) {
        const data = await hamChung.layThongTinTheo_2_ID("doi_bong_giai_dau", danhSachMaDoiBong[i], maGiaiDau);
        dataDoiBongTrongVong.push(data);
    }

    return dataDoiBongTrongVong;
}
// còn trường hợp click vào loại thì chưa được
async function viewTbody_chon(data_doiBong_giaiDau) {
    const tableBody = document.getElementById("dataTable_chon").getElementsByTagName('tbody')[0];
    // console.log(data_doiBong_giaiDau);

    tableBody.innerHTML = ""; // Xóa dữ liệu hiện tại

    // Lặp qua dữ liệu và tạo các dòng cho bảng
    data_doiBong_giaiDau.forEach(item => {
        const checked = item.hat_giong === "co" ? "checked" : "";
        const row = document.createElement("tr");
        row.innerHTML = `
            <td style="text-align: center;">
                <input type="checkbox" class="checkbox-chon" value="${item.ma_doi_bong}">
            </td>
            <td style="text-align: center;">
                <input type="checkbox" class="checkbox-hatGiong" value="${item.ma_doi_bong}" ${checked}>
            </td>
            <td style="text-align: center;">${item.ma_doi_bong}</td>
            <td style="text-align: center;">${item.logo}</td>
            <td style="text-align: center;">${item.quoc_gia}</td>
        `;
        tableBody.appendChild(row);
    });
}




async function loadDanhSachGiaiDau_chon() {
    const selectElement = document.getElementById("maGiaiDau_chon");
    selectElement.innerHTML = '<option value="All">Tất Cả</option>'; // Reset danh sách
    const data = await hamChung.layDanhSach("giai_dau");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_giai_dau;
        option.textContent = `${item.ma_giai_dau} - ${item.ten_giai_dau}`;
        selectElement.appendChild(option);
    });
}
async function loadDanhSachVongDau_Da_Da(maVongDau_chon) {
    maVongDau_chon.innerHTML = '<option value="All">Tất Cả</option>'; // Reset danh sách

    const data = await hamChung.layDanhSach("vong_dau");
    const dataTranDau = await hamChung.layDanhSach("tran_dau");
    const maGiaiDau = document.getElementById("maGiaiDau_chon").value;

    // Lọc các trận đấu theo giải đấu
    const tranDauCuaGiai = dataTranDau.filter(td => td.ma_giai_dau === maGiaiDau);

    // Lấy danh sách ma_vong_dau duy nhất từ các trận đấu
    const danhSachMaVongDau = [...new Set(tranDauCuaGiai.map(td => td.ma_vong_dau))];

    // Lọc vòng đấu theo danh sách vừa lấy
    const vongDauCoTranDau = data.filter(vd => danhSachMaVongDau.includes(vd.ma_vong_dau));

    // Đổ vào combobox
    vongDauCoTranDau.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_vong_dau;
        option.textContent = `${item.ma_vong_dau} - ${item.ten_vong}`;
        maVongDau_chon.appendChild(option);
    });
}

async function loadDanhSach_hinhThuc_xepTranDau() {
    const selectElement = document.getElementById("chon_hinhThuc_tao_tran");
    selectElement.innerHTML = ''; // Reset danh sách

    const data_tao = await hamChung.taoTranDau_getHinhThucTaoDoi();
    console.log(data_tao);
    if (!data_tao) return;

    // 🧠 Lưu vào sessionStorage
    sessionStorage.setItem("hinh_thuc_tao_tran", JSON.stringify(data_tao));

    // 🧩 Giả sử mỗi item là { key: "/api/chia-bang", value: "chia-bang" }
    Object.entries(data_tao).forEach(([ten, duong_dan]) => {
        const option = document.createElement("option");
        option.value = ten;
        option.textContent = `${duong_dan.ten} - ${duong_dan.url}`;
        // console.log(da)
        selectElement.appendChild(option);
    });
}



function getSelectedCheckboxes() {
    const checkboxes = document.querySelectorAll('.checkbox-chon'); // Lấy tất cả các checkbox
    const selectedTeams = [];

    // Lặp qua tất cả checkbox và kiểm tra xem cái nào được chọn
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) { // Nếu checkbox được chọn
            selectedTeams.push(checkbox.value); // Thêm giá trị vào mảng
        }
    });

    return selectedTeams; // Trả về mảng chứa các giá trị của các checkbox đã chọn
}
function getSelectedCheckboxes_hatGiong() {
    const checkboxes = document.querySelectorAll('.checkbox-hatGiong'); // Lấy tất cả các checkbox
    const selectedTeams = [];

    // Lặp qua tất cả checkbox và kiểm tra xem cái nào được chọn
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) { // Nếu checkbox được chọn
            selectedTeams.push(checkbox.value); // Thêm giá trị vào mảng
        }
    });

    return selectedTeams; // Trả về mảng chứa các giá trị của các checkbox đã chọn
}
async function callAll_taoTranDau(url, form) {
    console.log(url);
    console.log(form);
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(form)
        });

        // Nếu muốn trả ra dữ liệu JSON đã parse:
        const data = await response.json();
        return data;

        // Nếu bạn muốn trả raw Response:
        // return response;

    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        return { error: "Gọi API thất bại" };
    }
}

async function themDanhSachTranDau_vaoDaTa() {

    document.getElementById("bangTaoTran").classList.add("hidden"); // Ẩn thẻ <div id="bangTaoTran">
    document.getElementById("popupOverlay").classList.remove("disabled-overlay");
    const tbody = document.getElementById("bodyBangTaoTran");
    const rows = tbody.querySelectorAll("tr");
    //const danhSachTranDauDaChon = [];

    const ma_giai_dau = document.getElementById("maGiaiDau_chon").value;

    let formData_so2;
    let index = 0; // Khởi tạo biến đếm

    for (const row of rows) {

        const cells = row.querySelectorAll("td");

        const ma_tran_dau = await hamChung.taoID_theoBang("tran_dau");
        const ma_doi_1 = cells[2]?.innerText.trim();
        const ma_doi_2 = cells[3]?.innerText.trim();
        const ngay_dien_ra = cells[4]?.querySelector("input")?.value || null;

        const gio_dien_ra_raw = cells[5]?.querySelector("input")?.value || null;
        const gio_dien_ra = gio_dien_ra_raw ? gio_dien_ra_raw + ":00" : null;

        const ma_san = cells[6]?.querySelector("select")?.value || null;
        const ma_vong_dau = "V1"; // Cứng mã vòng đấu
        let formData = {
            ma_tran_dau: ma_tran_dau,
            ma_giai_dau: ma_giai_dau,
            ma_doi_1: ma_doi_1,
            ma_doi_2: ma_doi_2,
            ngay_dien_ra: ngay_dien_ra,
            gio_dien_ra: gio_dien_ra,
            ma_san: ma_san,
            ma_vong_dau: ma_vong_dau
        };
        console.log(index);
        console.log(formData);

        if (index === 1) {
            formData_so2 = formData;
        }
        else {
            hamChung.them(formData, "tran_dau");
        }

        // console.log("✅ Dữ liệu trận đấu lấy từ DOM:", danhSachTranDauDaChon);

        // //    Nếu bạn muốn thêm từng trận vào database:
        // for (const tran of danhSachTranDauDaChon) {
        //     await hamChung.them(tran, "tran_dau");
        // }

        // Hoặc nếu API chấp nhận danh sách:
        // await hamChung.themNhieu(danhSachTranDauDaChon, "tran_dau");
        index++;
    }
    if (index >= 1) {
        const ma_tran_dau_2 = await hamChung.taoID_theoBang("tran_dau");
        formData_so2.ma_tran_dau = ma_tran_dau_2;
        console.log(formData_so2);
        hamChung.them(formData_so2, "tran_dau");

    }

    // nếu là trường hợp tảo bảng thì phải đổi bảng cho cái kia 

    if ((document.getElementById("chon_hinhThuc_tao_tran").value) === "chia-bang") {
        // console.log(danhSach_doiBong_theoBang);
        await capNhat_bangDau_doi_bong_giai_dau(danhSach_doiBong_theoBang);
    }

}
async function capNhat_bangDau_doi_bong_giai_dau(danhSach_doiBong_theoBang) {
    console.log(danhSach_doiBong_theoBang.bangs);
    const data = danhSach_doiBong_theoBang.bangs;
    let form_update_bang_cho_doiBongGiaiDau = {
        ma_bang_dau: "",
        ma_giai_dau: "",
        ma_doi_bong: ""
    }

    data.forEach((bang, index) => {

        form_update_bang_cho_doiBongGiaiDau.ma_bang_dau = bang.bang.ma_bang_dau;
        form_update_bang_cho_doiBongGiaiDau.ma_giai_dau = bang.bang.ma_giai_dau;


        bang.doi.forEach(async (doi) => {
            // Hiển thị thông tin đội bóng. Giả sử 'doi' là mã đội, bạn có thể thay đổi nếu có thêm thông tin đội.
            // danhSachBang += `<li>Đội ${doiIndex + 1}: ${doi}</li>`;
            form_update_bang_cho_doiBongGiaiDau.ma_doi_bong = doi;
            console.log(form_update_bang_cho_doiBongGiaiDau);
            await hamChung.sua(form_update_bang_cho_doiBongGiaiDau, "doi_bong_giai_dau");
        });


    });
}

