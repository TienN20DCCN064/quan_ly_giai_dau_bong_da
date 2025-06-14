
const maGiaiDau_chon_viewbody = document.getElementById("maGiaiDau_chon_viewbody");

// const trangThai_ketQua_viewbody = document.getElementById("trangThai_ketQua_viewbody");

document.addEventListener("DOMContentLoaded", async function () {
    console.log("Đã vào trang qldt_dangKyGiaiDau");
    console.log(DoiTuyen.getDoiTuyen_dangChon());
    console.log(GlobalStore.getUsername());
    loadDanhSachGiaiDau_chon_viewbody(DoiTuyen.getDoiTuyen_dangChon());
    viewTbody();

    // document.getElementById("button_ALL_tranDau").addEventListener("click", async function () {
    //     location.reload();
    // });

    // // Xử lý sự kiện khi nhấn nút "Trận đấu chưa kết quả"
    // document.getElementById("button_chua_da").addEventListener("click", async function () {

    //     // Lọc các trận đấu chưa có kết quả
    //     const dsTranDauChuaKQ = danhSachTranDau_theoDoiTuyen.filter(tranDau =>
    //         !dsKetQua.some(kq => kq.ma_tran_dau === tranDau.ma_tran_dau)
    //     );
    //     console.log(maGiaiDau_chon_viewbody.value);
    //     // maVongDau_chon_viewbody.value = "All";
    //     let data = await hamChung.layDanhSach("ket_qua_tran_dau");

    //     viewTbody(data);    
    // });



    maGiaiDau_chon_viewbody.addEventListener("change", async function () {
        console.log(maGiaiDau_chon_viewbody.value);
        // maVongDau_chon_viewbody.value = "All";
        let data = await hamChung.layDanhSach("ket_qua_tran_dau");

        viewTbody(data);
    });
    // trangThai_ketQua_viewbody.addEventListener("change", async function () {
    //     console.log(trangThai_ketQua_viewbody.value);
    //     // maVongDau_chon_viewbody.value = "All";
    //     let data = await hamChung.layDanhSach("ket_qua_tran_dau");

    //     viewTbody(data);
    // });
    // btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    // btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);
});

// Hiển thị danh sách trận đấu
async function layKetQua(ma_tran_dau) {
    const dataKQTranDau = await hamChung.layDanhSach("ket_qua_tran_dau");
    const tonTaiTranDau = dataKQTranDau.some(item => item.ma_tran_dau === ma_tran_dau);
    let stringKetQua = "--";
    if (tonTaiTranDau) {
        const data1kq = await hamChung.layThongTinTheo_ID("ket_qua_tran_dau", ma_tran_dau);
        let doiThang = "";

        if (data1kq.ma_doi_thang != null) {
            const dataDoiThang = await hamChung.layThongTinTheo_ID("doi_bong", data1kq.ma_doi_thang);
            doiThang = dataDoiThang.ten_doi_bong;

        }
        stringKetQua = doiThang + " " + data1kq.so_ban_doi_1 + ":" + data1kq.so_ban_doi_2;
        return stringKetQua;
    } else {
        return stringKetQua;
    }


}
async function viewTbody(data) {
    //console.log("ma_tran_dau:New " + await hamChung.taoID_theoBang("tran_dau"));
    if (data == null || data.length === 0) {
        data = await hamChung.layDanhSach("tran_dau");
    }
    const data_tranDau = await hamChung.layDanhSach("tran_dau");

    // Lấy danh sách trận đấu mà ma_doi_1 hoặc ma_doi_2 === DoiTuyen.getDoiTuyen_dangChon()
    const doiTuyenDangChon = DoiTuyen.getDoiTuyen_dangChon();
    const danhSachTranDau_theoDoiTuyen = data_tranDau.filter(tranDau =>
        tranDau.ma_doi_1 === doiTuyenDangChon || tranDau.ma_doi_2 === doiTuyenDangChon
    );
    data = danhSachTranDau_theoDoiTuyen;

    console.log(data);
    console.log(danhSachTranDau_theoDoiTuyen);
    
    if (maGiaiDau_chon_viewbody.value !== "All") {
        data = data.filter(item => item.ma_giai_dau === maGiaiDau_chon_viewbody.value);
    }
    // if (maGiaiDau_chon_viewbody.value !== "All") {
    //     // Lọc các trận đấu chưa có kết quả
    //     const dsTranDauChuaKQ = data.filter(tranDau =>
    //         !dsKetQua.some(kq => kq.ma_tran_dau === tranDau.ma_tran_dau)
    //     );
    //     console.log(maGiaiDau_chon_viewbody.value);
    //     // maVongDau_chon_viewbody.value = "All";
    //     let data = await hamChung.layDanhSach("ket_qua_tran_dau");
    // }

    const tableBody = document.getElementById("dataTable");
    tableBody.innerHTML = "";

    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const ketQua = await layKetQua(item.ma_tran_dau);
        console.log(ketQua);
        const row = document.createElement("tr");
        const dataGiaiDau = await hamChung.layThongTinTheo_ID("giai_dau", item.ma_giai_dau);
        const dataDoiBong1 = await hamChung.layThongTinTheo_ID("doi_bong", item.ma_doi_1);
        const dataDoiBong2 = await hamChung.layThongTinTheo_ID("doi_bong", item.ma_doi_2);
        const dataVongDau = await hamChung.layThongTinTheo_ID("vong_dau", item.ma_vong_dau);
        const data1SVD = await hamChung.layThongTinTheo_ID("san_van_dong", item.ma_san);

        row.innerHTML = `
          
            <td style="text-align: center;">${dataGiaiDau.ten_giai_dau}</td>
            <td style="text-align: center;">${dataDoiBong1.ten_doi_bong}</td>
            <td style="text-align: center;">${dataDoiBong2.ten_doi_bong}</td>
            <td style="text-align: center;">${item.ngay_dien_ra}</td>
            <td style="text-align: center;">${item.gio_dien_ra}</td>
            <td style="text-align: center;">${data1SVD.ten_san}</td>
         
            <td style="text-align: center;">${dataVongDau.ten_vong}</td>
            <td style="text-align: center;">${ketQua}</td>
        `;
        tableBody.appendChild(row);
    }


}



async function loadDanhSachGiaiDau_chon_viewbody(maDoiBong) {
    const selectElement = document.getElementById("maGiaiDau_chon_viewbody");
    selectElement.innerHTML = '<option value="All">Tất Cả</option>'; // Reset danh sách
    let data = await hamChung.layDanhSach("doi_bong_giai_dau");
    data = data.filter(item => item.ma_doi_bong === maDoiBong);

    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const giaiDau = await hamChung.layThongTinTheo_ID("giai_dau", item.ma_giai_dau);
        const option = document.createElement("option");
        option.value = giaiDau.ma_giai_dau;
        option.textContent = `${giaiDau.ten_giai_dau}`;
        selectElement.appendChild(option);
    }
}

