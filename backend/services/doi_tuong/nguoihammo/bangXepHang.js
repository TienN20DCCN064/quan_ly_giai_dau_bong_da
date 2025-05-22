
const chon_GiaiDau = document.getElementById("maGiaiDau_chon");
const chon_bangDau = document.getElementById("maBangDau_chon");


document.addEventListener("DOMContentLoaded", async function () {



    viewTbody();
    await loadDanhSachGiaiDau_chon();

    chon_GiaiDau.addEventListener("change", async function () {
        console.log(chon_GiaiDau.value);
        await loadDanhSachBangDau_1GiaiDau(chon_GiaiDau.value);
        viewTbody(chon_GiaiDau.value, chon_bangDau.value);
    });
    chon_bangDau.addEventListener("change", async function () {
        viewTbody(chon_GiaiDau.value, chon_bangDau.value);
    });


});



async function viewTbody(ma_giai_dau, ma_bang_dau) {
    let data = await hamChung.layDanhSach("doi_bong_giai_dau");
    console.log(ma_giai_dau);
    // trong bang_xep_hang_vong_loai có 
    if (ma_giai_dau != undefined && ma_giai_dau != "") {
        const filteredData = [];
        for (const item of data) {

            if (item.ma_giai_dau === ma_giai_dau) {
                filteredData.push(item);
            }
        }
        data = filteredData;
    }
    if (ma_bang_dau != undefined && ma_bang_dau != "") {
        console.log("loc lần 2");
        console.log(ma_bang_dau);

        const filteredData = [];
        for (const item of data) {

            if (item.ma_bang_dau === ma_bang_dau) {
                filteredData.push(item);
            }
        }
        data = filteredData;
    }

    data = await sapXep_danhDanh_bangXepHang_theoDiem(data);

    console.log(await hamChung.layDanhSach("doi_bong_giai_dau"));
    console.log(data);

    const tableBody = document.getElementById("dataTable");
    tableBody.innerHTML = "";

    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        //dada  const data1giaiDau = await layGiaiDau_theo_maBangDau(item.ma_bang_dau);
        // const data1BangDau = await hamChung.layThongTinTheo_ID("bang_dau", item.ma_bang_dau);
        const data1giaiDau = await hamChung.layThongTinTheo_ID("giai_dau", item.ma_giai_dau);
        const data1doiBong_giaiDau = await hamChung.layThongTinTheo_2_ID("doi_bong_giai_dau", item.ma_doi_bong, item.ma_giai_dau);
        let tenBangDau = "---";

        if (item.ma_bang_dau != null) {
            const data1bangDau = await hamChung.layThongTinTheo_ID("bang_dau", item.ma_bang_dau);
            tenBangDau = data1bangDau.ten_bang_dau;
        }



        const data_demThongSo = await tinhSoTran_hinhThucKetQua_theo_doiBongGiaiDau(item.ma_doi_bong, item.ma_giai_dau, "V1");

        const row = document.createElement("tr");
        row.innerHTML = `
                <td style="text-align: center;">${data1giaiDau.ten_giai_dau}</td>
                <td style="text-align: center;">${tenBangDau}</td>
                <td style="text-align: center;">${data1doiBong_giaiDau.ten_doi_bong}</td>


            <td style="text-align: center;">${data_demThongSo.soTranThang}</td>
            <td style="text-align: center;">${data_demThongSo.soTranHoa}</td>
            <td style="text-align: center;">${data_demThongSo.soTranThua}</td>

            <td style="text-align: center;">${data_demThongSo.soBanThang}</td>
            <td style="text-align: center;">${data_demThongSo.soBanThua}</td>

               
                <td style="text-align: center;">${item.diem_vong_loai}</td>

             
              
            `;
        tableBody.appendChild(row);
    }


}

function sapXep_danhDanh_bangXepHang_theoDiem(data) {
    return data.sort((a, b) => b.diem_vong_loai - a.diem_vong_loai);
}

async function loadDanhSachGiaiDau() {
    const selectElement = document.getElementById("maGiaiDau");
    selectElement.innerHTML = '<option value="">-- All giải --</option>'; // Reset danh sách
    const data = await hamChung.layDanhSach("giai_dau");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_giai_dau;
        option.textContent = `${item.ten_giai_dau}`;
        selectElement.appendChild(option);
    });
}
async function loadDanhSachBangDau(maGiaiDau) {
    const selectElement = document.getElementById("maBangDau");
    selectElement.innerHTML = '<option value="">-- All bảng --</option>'; // Reset danh sách
    const data = await hamChung.layDanhSach("bang_dau");
    const dataBangDau_theo_maGiaiDau = data.filter(item => item.ma_giai_dau === maGiaiDau);

    dataBangDau_theo_maGiaiDau.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_bang_dau;
        option.textContent = `${item.ten_bang_dau}`;
        selectElement.appendChild(option);
    });
}

async function loadDanhSachDoiBong_theoBangDau(maGiaiDau, maBangDau) {
    const selectElement = document.getElementById("maDoiBong");
    selectElement.innerHTML = '<option value="">-- All đội bóng --</option>'; // Reset danh sách
    const dataDBGD = await hamChung.layDanhSach("doi_bong_giai_dau");
    const dataTheoGiaiDau = dataDBGD.filter(item => item.ma_giai_dau === maGiaiDau);
    let data = dataTheoGiaiDau;
    if (maBangDau != null && maBangDau != "") {
        data = data.filter(item => item.ma_bang_dau === maBangDau);
    }
    console.log(maGiaiDau);
    console.log(maBangDau);
    console.log(dataDBGD);
    console.log(dataTheoGiaiDau);
    console.log(data);

    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        // const data1giaiDau = await hamChung.layThongTinTheo_ID("giai_dau", item.ma_giai_dau);
        const option = document.createElement("option");
        option.value = item.ma_doi_bong;
        option.textContent = `${item.ten_doi_bong}`;
        selectElement.appendChild(option);
    }
}

async function loadDanhSachGiaiDau_chon() {
    const selectElement = document.getElementById("maGiaiDau_chon");
    selectElement.innerHTML = '<option value="">-- All giải --</option>'; // Reset danh sách
    const data = await hamChung.layDanhSach("giai_dau");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_giai_dau;
        option.textContent = `${item.ten_giai_dau}`;
        selectElement.appendChild(option);
    });
}
async function loadDanhSachBangDau_1GiaiDau(ma_giai_dau) {
    const selectElement = document.getElementById("maBangDau_chon");
    const maGiaiDauChon = document.getElementById("maGiaiDau_chon");
    selectElement.innerHTML = '<option value="">-- All bảng --</option>'; // Reset danh sách
    let data = await hamChung.layDanhSach("bang_dau");
    console.log(data);
    console.log(selectElement.value);
    // console.log(selectElement.value === ma_BangDau_all);
    // console.log(ma_BangDau_all);
    if (maGiaiDauChon.value != "") {
        data = data.filter(item => item.ma_giai_dau == ma_giai_dau);
    }
    console.log("data");
    console.log(data);
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_bang_dau;
        option.textContent = `${item.ten_bang_dau}`;
        selectElement.appendChild(option);
    });
}

async function tinhSoTran_hinhThucKetQua_theo_doiBongGiaiDau(maDoiBong, maGiaiDau, maVongDau) {

    // laaays ra danh sachs  traanj daaus cuaur giari
    const datatran_dau = await hamChung.layDanhSach("tran_dau");
    const dataket_qua_tran_dau = await hamChung.layDanhSach("ket_qua_tran_dau");
    // danh sachs traanj ddaaus theo giair  
    const datatran_dau_theo_vongDau_GiaiDau = datatran_dau.filter(item => item.ma_giai_dau === maGiaiDau
        && item.ma_vong_dau === maVongDau
    );

    const maTranDauList_theoVD_GD = datatran_dau_theo_vongDau_GiaiDau.map(item => item.ma_tran_dau);

    const dataket_qua_tran_dau_theo_vongDau_GiaiDau = dataket_qua_tran_dau.filter(item =>
        maTranDauList_theoVD_GD.includes(item.ma_tran_dau)
    );

    console.log("ma doi bong : " + maDoiBong);
    console.log("ma giai dau: " + maGiaiDau);
    console.log(datatran_dau);
    console.log(dataket_qua_tran_dau);
    console.log(datatran_dau_theo_vongDau_GiaiDau);
    console.log(dataket_qua_tran_dau_theo_vongDau_GiaiDau);
    //    đếm xem mã đội bóng đó có mấy trấn thắng
    let form = {
        soTranThang: 0,
        soTranHoa: 0,
        soTranThua: 0,
        soBanThang: 0,
        soBanThua: 0
    };

    for (let i = 0; i < dataket_qua_tran_dau_theo_vongDau_GiaiDau.length; i++) {
        let dataXet = dataket_qua_tran_dau_theo_vongDau_GiaiDau[i];
        /// thêm số trận
        if (dataXet.ma_doi_thang === maDoiBong) {
            form.soTranThang += 1;
        }
        else if (dataXet.ma_doi_thang === null) {
            const data1tranDau = await hamChung.layThongTinTheo_ID("tran_dau", dataXet.ma_tran_dau);
            // console.log(data1tranDau);
            if (data1tranDau.ma_doi_1 === maDoiBong || data1tranDau.ma_doi_2 === maDoiBong) {
                form.soTranHoa += 1;
            }
        }
        // chỉ còn truơngf hợp kết quả trận đấu [i] ko có mà đội bóng đó
        else {
            const dataTranDau_xet = await hamChung.layThongTinTheo_ID("tran_dau", dataXet.ma_tran_dau);
            if (dataTranDau_xet.ma_doi_1 === maDoiBong || dataTranDau_xet.ma_doi_2 === maDoiBong) {
                form.soTranThua += 1;
            }

        }
        /// thêm số bàn
        if (dataXet.ma_doi_thang === maDoiBong) {
            // thêm kiểm tra là có trong giải đấu chưa
            const data1kqtranDau = await hamChung.layThongTinTheo_ID("ket_qua_tran_dau", dataXet.ma_tran_dau);
            let soBanLonHon = data1kqtranDau.so_ban_doi_1;
            if (data1kqtranDau.so_ban_doi_1 < data1kqtranDau.so_ban_doi_2) {
                soBanLonHon = data1kqtranDau.so_ban_doi_2;
            }
            form.soBanThang += soBanLonHon;
        }
        // chỉ còn trận đấu trường hợp ko có tên// là null hoặc là đội thua
        else {
            if (dataXet.ma_doi_thang === null) {
                const data1tranDau = await hamChung.layThongTinTheo_ID("tran_dau", dataXet.ma_tran_dau);
                // console.log(data1tranDau);
                // nếu nó thuộc 1 trong 2 đội
                if (data1tranDau.ma_doi_1 === maDoiBong || data1tranDau.ma_doi_2 === maDoiBong) {
                    // form.soTranHoa += 1;
                    const data1kqtranDau = await hamChung.layThongTinTheo_ID("ket_qua_tran_dau", dataXet.ma_tran_dau);
                    let soBanBeNhat = data1kqtranDau.so_ban_doi_1;
                    // lấy ra bé nhấtnhất
                    if (data1kqtranDau.so_ban_doi_1 > data1kqtranDau.so_ban_doi_2) {
                        soBanBeNhat = data1kqtranDau.so_ban_doi_2;
                    }

                    form.soBanThua += soBanBeNhat;
                    // nếu mà hòa thì đều cộng
                    if (data1kqtranDau.so_ban_doi_1 === data1kqtranDau.so_ban_doi_2) {
                        form.soBanThang += soBanBeNhat;
                        form.soBanThua += soBanBeNhat;
                    }
                }
            }
        }
    }
    return form;
    // const datatran_dau_theoDoiBongGiaiDau = datatran_dau.filter(item => item.ma_giai_dau === maGiaiDau && item.ma_tran_dau === maDoiBong);
}


