const maTranDau = document.getElementById("maTranDau");
const maGiaiDau = document.getElementById("maGiaiDau");
const maDoi1 = document.getElementById("maDoi1");
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
    loadDanhSachSanDau();
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
                    maGiaiDau?.value || null,
                    maVongDau?.value || null,
                    sanVanDong?.value || null,
                    dateFrom?.value || null,
                    dateTo?.value || null);
    
    return data;
}
async function layKetQua(ma_tran_dau) {
    const data = await hamChung.layThongTinTheo_ID("ket_qua_tran_dau", ma_tran_dau);
    let stringKetQua = "--";
    if (data != null) {
        stringKetQua = data.so_ban_doi_1 + ":" + data.so_ban_doi_2;

        // stringKetQua = data.ma_doi_thang + " " + data.so_ban_doi_1 + ":" + data.so_ban_doi_2;
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
        option.textContent = `${item.ten_giai_dau}`;
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
        option.textContent = `${item.ten_san}`;
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
        option.textContent = `${item.ten_doi_bong}`;
        selectElement.appendChild(option);
    });

    selectElement.addEventListener("change", async function () {
        const data = await layDanhSachTranDau();
        viewTbody(data);
    })
}
async function loadDanhSachVongDau() {
    const selectElement = document.getElementById("maVongDau");
    selectElement.innerHTML = '<option value="">-- Chọn Vòng Đấu --</option>'; // Reset danh sách
    const data = await hamChung.layDanhSach("vong_dau");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_vong_dau;
        option.textContent = `${item.ten_vong}`;
        selectElement.appendChild(option);
    });

    selectElement.addEventListener("change", async function () {
        const data = await layDanhSachTranDau();
        viewTbody(data);
    })
}