const maTranDau = document.getElementById("maTranDau");
const maGiaiDau = document.getElementById("maGiaiDau");
const maDoi1 = document.getElementById("maDoi1");
const maDoi2 = document.getElementById("maDoi2");
const dateFrom = document.getElementById("startDate");
const dateTo = document.getElementById("endDate");
const ngayDienRa = document.getElementById("ngayDienRa");
const gioDienRa = document.getElementById("gioDienRa");
const sanVanDong = document.getElementById("sanVanDong");
const maTrongTai = document.getElementById("maTrongTai");
const trangThai = document.getElementById("trangThai");
const maVongDau = document.getElementById("maVongDau");
const locQuanLy = document.getElementById("upcomingOnly");


document.addEventListener("DOMContentLoaded", async function () {
    loadDanhSachGiaiDau();
    loadDanhSachDoiBong_maDoi1();
    loadDanhSachDoiBong_maDoi2();
    //loadDanhSachTrongTai();
    loadDanhSachVongDau();
    const data = await layDanhSachTranDau();
    viewTbody(data);

    locQuanLy.addEventListener("change", async function () {
        const data = await layDanhSachTranDau();
        viewTbody(data);
    });
});

async function layDanhSachTranDau() {
    const data = await hamChiTiet.layDsTranDau(locQuanLy.checked ? GlobalStore.getUsername() : null, 
                    maDoi1?.value || null,
                    maDoi2?.value || null,
                    maGiaiDau?.value || null,
                    maVongDau?.value || null,
                    sanVanDong?.value || null,
                    dateFrom?.value || null,
                    dateTo?.value || null);
    
    return data;
}

// async function layDanhSachTranDau(
//     id_ql = null,
//     id_doi1 = null,
//     id_doi2 = null,
//     id_giaidau = null,
//     id_vongdau = null,
//     id_sandau = null,
//     date_from = null,
//     date_to = null
// ) {
//     // const data = await hamChiTiet.layDsTranDau(id_ql, id_doi1, id_doi2, id_giaidau, id_vongdau, id_sandau, date_from, date_to);
//     const data = await layDanhSachTranDau(null, 
//                     maDoi1.selectElement.ma_doi_bong,
//                     maDoi2.selectElement.ma_doi_bong,
//                     maGiaiDau.selectElement.ma_giai_dau,
//                     maVongDau.selectElement.ma_vong_dau,
//                     sanVanDong.selectElement.ID,
//                     dateFrom.selectElement.Date,
//                     dateTo.selectElement.Date);
    
//     return data;
// }

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
    const tableBody = document.getElementById("dataTable");
    tableBody.innerHTML = "";

    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const ketQua = await layKetQua(item.ma_tran_dau);
        console.log(ketQua);
        const row = document.createElement("tr");
        row.innerHTML = `
            <td style="text-align: start;">${item.ma_tran_dau}</td>
            <td style="text-align: start;">${item.ten_giai_dau}</td>
            <td style="text-align: start;">${item.ten_vong}</td>
            <td style="text-align: start;">${item.ten_doi_quan_ly}</td>
            <td style="text-align: start;">${item.ten_doi_doi_thu}</td>
            <td style="text-align: start;">${new Date(item.ngay_dien_ra).toLocaleDateString('vi-VN')} - ${item.gio_dien_ra}</td>
            <td style="text-align: start;">${item.ten_san}</td>
            <td style="text-align: start;">${ketQua}</td>   
            
                 `;
        tableBody.appendChild(row);
    }
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

    selectElement.addEventListener("change", async function () {
        const data = await layDanhSachTranDau();
        viewTbody(data);
    })
}


async function loadDanhSachSanDau() {
    const selectElement = document.getElementById("maSanDau");
    selectElement.innerHTML = '<option value="">-- Chọn Mã Sân Đấu --</option>'; // Reset danh sách
    const data = await hamChung.layDanhSach("san_van_dong");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ID;
        option.textContent = `${item.ID} - ${item.ten}`;
        selectElement.appendChild(option);
    });

    selectElement.addEventListener("change", async function () {
        const data = await layDanhSachTranDau();
        viewTbody(data);
    })
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

    selectElement.addEventListener("change", async function () {
        const data = await layDanhSachTranDau();
        viewTbody(data);
    })
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

    selectElement.addEventListener("change", async function () {
        const data = await layDanhSachTranDau();
        viewTbody(data);
    })
}
// async function loadDanhSachTrongTai() {
//     const selectElement = document.getElementById("maTrongTai");
//     selectElement.innerHTML = '<option value="">-- Chọn Trọng Tài --</option>'; // Reset danh sách
//     const data = await hamChung.layDanhSach("trong_tai");
//     data.forEach(item => {
//         const option = document.createElement("option");
//         option.value = item.ma_trong_tai;
//         option.textContent = `${item.ma_trong_tai} - ${item.ho_ten}`;
//         selectElement.appendChild(option);
//     });
// }
async function loadDanhSachVongDau() {
    const selectElement = document.getElementById("maVongDau");
    selectElement.innerHTML = '<option value="">-- Chọn Vòng Đấu --</option>'; // Reset danh sách
    const data = await hamChung.layDanhSach("vong_dau");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_vong_dau;
        option.textContent = `${item.ma_vong_dau} - ${item.ten_vong}`;
        selectElement.appendChild(option);
    });

    selectElement.addEventListener("change", async function () {
        const data = await layDanhSachTranDau();
        viewTbody(data);
    })
}