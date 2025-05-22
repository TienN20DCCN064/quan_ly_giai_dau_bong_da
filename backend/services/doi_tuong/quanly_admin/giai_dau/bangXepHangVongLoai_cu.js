const btnLuuThayDoi = document.getElementById("button_luu");
const btnTaiLaiTrang = document.getElementById("button_taiLaiTrang");
const maGiaiDau = document.getElementById("maGiaiDau");
const maBangDau = document.getElementById("maBangDau");
const maDoiBong = document.getElementById("maDoiBong");
const madiem = document.getElementById("diem");
const ghiChu = document.getElementById("ghiChu");
const chon_GiaiDau = document.getElementById("maGiaiDau_chon");
const chon_bangDau = document.getElementById("maBangDau_chon");
// const urlParams = new URLSearchParams(window.location.search);
// let ma_giai_dau_param = urlParams.get('ma_giai_dau'); // 123
// const ma_GiaiDau_all = "ALL_giaiDau";
// const ma_BangDau_all = "ALL_bangDau";


document.addEventListener("DOMContentLoaded", async function () {
    // if (ma_giai_dau_param === null) {

    //     const url = `/frontend/view/quanly_admin/giai_dau/bangXepHangVongLoai.html?ma_giai_dau=${ma_GiaiDau_all}`;
    //     window.location.href = url;
    // }



    viewTbody();
    await loadDanhSachGiaiDau_chon();
    await loadDanhSachGiaiDau();


    await loadDanhSachBangDau_1GiaiDau();


    maGiaiDau.addEventListener("change", async function () {
        await loadDanhSachBangDau(document.getElementById("maGiaiDau").value);
        await loadDanhSachDoiBong_theoBangDau();
    })
    maBangDau.addEventListener("change", async function () {

        await loadDanhSachDoiBong_theoBangDau(document.getElementById("maBangDau").value);
    })

    chon_GiaiDau.addEventListener("change", async function () {
        console.log(chon_GiaiDau.value);
        await loadDanhSachBangDau_1GiaiDau(chon_GiaiDau.value);
        // const url = `/frontend/view/quanly_admin/giai_dau/bangXepHangVongLoai.html?ma_giai_dau=${chon_GiaiDau.value}`;
        // window.location.href = url;
        viewTbody(chon_GiaiDau.value, chon_bangDau.value);
    });
    chon_bangDau.addEventListener("change", async function () {

        // await loadDanhSachBangDau_1GiaiDau(chon_GiaiDau.value);
        // // const url = `/frontend/view/quanly_admin/giai_dau/bangXepHangVongLoai.html?ma_giai_dau=${chon_GiaiDau.value}`;
        // // window.location.href = url;
        viewTbody(chon_GiaiDau.value, chon_bangDau.value);
    });

    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);



});

async function viewTbody(ma_giai_dau, ma_bang_dau) {
    let data = await hamChung.layDanhSach("bang_xep_hang_vong_loai");
    let data_chuaXep = await hamChung.layDanhSach("doi_bong_giai_dau");
    console.log("ma_giai_dau");
    console.log("ma_bang_dau");
    console.log(ma_giai_dau);
    console.log(ma_bang_dau);
    console.log(ma_bang_dau === "")
    // trong bang_xep_hang_vong_loai có 
    if (ma_giai_dau != undefined && ma_giai_dau != "") {
        const filteredData = [];
        for (const item of data) {

            const giaiDau = await layGiaiDau_theo_maBangDau(item.ma_bang_dau);
            if (giaiDau.ma_giai_dau == ma_giai_dau) {
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
            // const giaiDau = await layGiaiDau_theo_maBangDau(item.ma_bang_dau);
            // if (giaiDau.ma_giai_dau == ma_giai_dau) {
            //     filteredData.push(item);
            // }
            // console.log(ma_bang_dau);
            if (item.ma_bang_dau === ma_bang_dau) {
                filteredData.push(item);
            }
        }
        data = filteredData;
    }

    data = await sapXep_danhDanh_bangXepHang_theoDiem(data);
    console.log(data);




    const tableBody = document.getElementById("dataTable");
    tableBody.innerHTML = "";

    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const data1giaiDau = await layGiaiDau_theo_maBangDau(item.ma_bang_dau);

        const dbgd = await hamChung.layDanhSach("doi_bong_giai_dau");
        let tenDoiBong_trongGiai = "---";
        const tonTai = dbgd.some(itemDBGD =>
            itemDBGD.ma_doi_bong === item.ma_doi_bong &&
            itemDBGD.ma_giai_dau === data1giaiDau.ma_giai_dau
        );
        if (tonTai) {
            const data1DoiBong_giaiDau = await hamChung.layThongTinTheo_2_ID("doi_bong_giai_dau", item.ma_doi_bong, data1giaiDau.ma_giai_dau);
            tenDoiBong_trongGiai = data1DoiBong_giaiDau.ten_doi_bong;
        }
        // else {
        //     const data1DoiBong = await hamChung.layThongTinTheo_ID("doi_bong", item.ma_doi_bong);
        //     tenDoiBong_trongGiai = data1DoiBong.ten_doi_bong;

        // }

        const data1BangDau = await hamChung.layThongTinTheo_ID("bang_dau", item.ma_bang_dau);


        const data_demThongSo = await tinhSoTran_hinhThucKetQua_theo_doiBongGiaiDau(item.ma_doi_bong, data1BangDau.ma_giai_dau);
        // console.log(data_demThongSo);



        const row = document.createElement("tr");
        row.innerHTML = `
            <td style="text-align: center;">${data1giaiDau.ten_giai_dau}</td>
            <td style="text-align: center;">${data1BangDau.ten_bang_dau}</td>
            <td style="text-align: center;">${tenDoiBong_trongGiai}</td>
           
             
            
            <td style="text-align: center;">${data_demThongSo.soTranThang}</td>
            <td style="text-align: center;">${data_demThongSo.soTranHoa}</td>
            <td style="text-align: center;">${data_demThongSo.soTranThua}</td>

            <td style="text-align: center;">${data_demThongSo.soBanThang}</td>
            <td style="text-align: center;">${data_demThongSo.soBanThua}</td>
            <td style="text-align: center;">${item.diem}</td>
            
            <td style="text-align: center;"><button class="edit-btn btn btn-warning btn-sm">Sửa</button></td>
            <td style="text-align: center;"><button class="delete-btn btn btn-danger btn-sm">Xóa</button></td>
        `;
        tableBody.appendChild(row);
    }


    // trong bang_xep_hang_vong_loai có 
    if (ma_giai_dau != undefined && ma_giai_dau != "") {
        const filteredData = [];
        for (const item of data_chuaXep) {

            if (item.ma_giai_dau == ma_giai_dau) {
                filteredData.push(item);
            }
        }
        data_chuaXep = filteredData;
    }
    if (ma_bang_dau != undefined && ma_bang_dau != "") {
        console.log("loc lần 222");
        console.log(ma_bang_dau);

        const filteredData = [];
        for (const item of data_chuaXep) {
            if (item.ma_bang_dau === ma_bang_dau) {
                filteredData.push(item);
            }
        }
        data_chuaXep = filteredData;
    }
    // data_chuaXep lúc này à bảng _đổi bóng giải đấu_ lọc theo (giải và bảng)
    // bao gồm đã xếp và chưa xêp
    // const databang_xep_hang_vong_loai = await hamChung.layDanhSach("bang_xep_hang_vong_loai");
    for (let i = data_chuaXep.length - 1; i >= 0; i--) {
        const item = data_chuaXep[i];
        const check = await check_doiBongGiaiDau_trongKo_bangXepHangVongLoai(item.ma_bang_dau, item.ma_doi_bong);
        if (check) {
            // Xóa phần tử khỏi mảng
            data_chuaXep.splice(i, 1);
        }
    }

    for (let i = 0; i < data_chuaXep.length; i++) {


        const item = data_chuaXep[i];
        const check = await check_doiBongGiaiDau_trongKo_bangXepHangVongLoai(item.ma_bang_dau, item.ma_doi_bong);
        console.log(check);
        // nếu chưa có ở trong thì in vào 
        if (!check) {
            console.log(item);
            const dbgd = await hamChung.layDanhSach("doi_bong_giai_dau");
            const data1giaiDau = await layGiaiDau_theo_maBangDau(item.ma_bang_dau);
            // const data1DoiBong = await hamChung.layThongTinTheo_ID("doi_bong", item.ma_doi_bong);
            const data1BangDau = await hamChung.layThongTinTheo_ID("bang_dau", item.ma_bang_dau);

            let tenDoiBong_trongGiai = "---";
            const tonTai = dbgd.some(itemDBGD =>
                itemDBGD.ma_doi_bong === item.ma_doi_bong &&
                itemDBGD.ma_giai_dau === data1giaiDau.ma_giai_dau
            );
            if (tonTai) {
                const data1DoiBong_giaiDau = await hamChung.layThongTinTheo_2_ID("doi_bong_giai_dau", item.ma_doi_bong, data1giaiDau.ma_giai_dau);
                tenDoiBong_trongGiai = data1DoiBong_giaiDau.ten_doi_bong;
            }



            const row = document.createElement("tr");
            let giaTriIn = "---";
            row.innerHTML = `
            <td style="text-align: center;">${data1giaiDau.ten_giai_dau}</td>
            <td style="text-align: center;">${data1BangDau.ten_bang_dau}</td>
            <td style="text-align: center;">${tenDoiBong_trongGiai}</td>
           
             
            
            <td style="text-align: center;">${giaTriIn}</td>
            <td style="text-align: center;">${giaTriIn}</td>
            <td style="text-align: center;">${giaTriIn}</td>

            <td style="text-align: center;">${giaTriIn}</td>
            <td style="text-align: center;">${giaTriIn}</td>
            <td style="text-align: center;">${giaTriIn}</td>
            
            <td style="text-align: center;"><button class="editChuaSua-btn btn btn-warning btn-sm">Sửa</button></td>
            <td style="text-align: center;"><button class="deleteChuaSua-btn btn btn-danger btn-sm">Xóa</button></td>
        `;
            tableBody.appendChild(row);
        }




    }
    console.log(data);
    console.log(data_chuaXep);

    button_sua(data);
    button_xoa(data);
    button_sua_tt(data_chuaXep);
    button_xoa_tt(data_chuaXep);
}

// Thêm/Sửa trận đấu
async function handleLuuThayDoi(event) {
    event.preventDefault();

    const form = document.getElementById("inputForm");
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    let formData = {
        ma_doi_bong: maDoiBong.value,
        ma_bang_dau: maBangDau.value,
        diem: madiem.value,
        ghi_chu: ghiChu.value

    };
    const checkTonTai = await check_doiBongGiaiDau_trongKo_bangXepHangVongLoai(maBangDau.value, maDoiBong.value);
    console.log(formData);
    console.log(checkTonTai);
    // đang ở chế độ readOnly => sửa
    if (maDoiBong.value != "") {
        if (maGiaiDau.readOnly) {
            await hamChung.sua(formData, "bang_xep_hang_vong_loai");
            alert("Sửa thành công");
            console.log("sua _ cc readOnly");
        }
        // đang thêm // chưa chắc
        else {
            // trường hợp đã in// là đã tồn tại
            if (!checkTonTai) {
                await hamChung.them(formData, "bang_xep_hang_vong_loai");
                alert("Thêm thành công");
                console.log("them _ ko readOnly");
            }
            else {
                await hamChung.sua(formData, "bang_xep_hang_vong_loai");
                alert("Sửa thành công");
                console.log("sua _ ko readOnly");
            }

            // trường hợp chưa in

        }

    }
    else {
        alert("Lỗi đội bóng chưa thêm vào giải!");
    }
    viewTbody(chon_GiaiDau.value, chon_bangDau.value);
}


// Xử lý tải lại trang
function handleTaiLaiTrang(event) {
    event.preventDefault();
    location.reload();
}

function button_sua(dataChung) {
    document.querySelectorAll(".edit-btn").forEach((btn, index) => {
        btn.addEventListener("click", async () => {
            document.getElementById("maGiaiDau").disabled = true;
            document.getElementById("maBangDau").disabled = true;
            document.getElementById("maDoiBong").disabled = true;

            console.log(dataChung)
            const item = dataChung[index];
            console.log(item);
            const tttt = await layGiaiDau_theo_maBangDau(item.ma_bang_dau);
            await loadDanhSachGiaiDau();
            await loadDanhSachBangDau(tttt.ma_giai_dau);

            console.log(tttt.ten_giai_dau);
            document.getElementById("maGiaiDau").value = tttt.ma_giai_dau;

            document.getElementById("maBangDau").value = item.ma_bang_dau;


            await loadDanhSachDoiBong_theoBangDau(document.getElementById("maBangDau").value);
            console.log(item);
            console.log(item.ma_doi_bong);


            document.getElementById("maDoiBong").value = item.ma_doi_bong;


            document.getElementById("diem").value = item.diem;
            document.getElementById("ghiChu").value = item.ghi_chu;
            // Scroll lên đầu trang
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    });

}
function button_sua_tt(dataChung) {
    document.querySelectorAll(".editChuaSua-btn").forEach((btn, index) => {
        btn.addEventListener("click", async () => {

            document.getElementById("maGiaiDau").disabled = true;
            document.getElementById("maBangDau").disabled = true;
            document.getElementById("maDoiBong").disabled = true;


            console.log(dataChung)
            const item = dataChung[index];
            console.log(item);
            const tttt = await layGiaiDau_theo_maBangDau(item.ma_bang_dau);
            await loadDanhSachGiaiDau();
            await loadDanhSachBangDau(tttt.ma_giai_dau);

            console.log(tttt.ten_giai_dau);
            document.getElementById("maGiaiDau").value = tttt.ma_giai_dau;

            document.getElementById("maBangDau").value = item.ma_bang_dau;


            await loadDanhSachDoiBong_theoBangDau(document.getElementById("maBangDau").value);
            console.log(item);
            console.log(item.ma_doi_bong);


            document.getElementById("maDoiBong").value = item.ma_doi_bong;


            document.getElementById("diem").value = 0;
            document.getElementById("ghiChu").value = "";
            // Scroll lên đầu trang
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    });

}

function button_xoa(data) {
    document.querySelectorAll(".delete-btn").forEach((btn, index) => {
        btn.addEventListener("click", async (event) => {
            let formData = {
                ma_doi_bong: data[index].ma_doi_bong,
                ma_bang_dau: data[index].ma_bang_dau
            }
            if (confirm(`Bạn muốn xóa kết quả trong bảng xếp hạng?`)) {

                // const row = event.target.closest("tr");
                // if (row) row.remove();
                await hamChung.xoa(formData, "bang_xep_hang_vong_loai");
            }


        });
    });
}


function button_xoa_tt(data) {
    document.querySelectorAll(".deleteChuaSua-btn").forEach((btn, index) => {
        btn.addEventListener("click", async () => {
            let formData = {
                ma_doi_bong: data[index].ma_doi_bong,
                ma_bang_dau: data[index].ma_bang_dau
            }
            confirm(`Bạn muốn xóa kết quả trong bảng xếp hạng?`);
        });
    });
}

// lấy thông tin giải đấu theo bảng
async function layGiaiDau_theo_maBangDau(ma_bang_dau) {
    console.log(ma_bang_dau);
    const data1BangDau = await hamChung.layThongTinTheo_ID("bang_dau", ma_bang_dau);

    const maGiaiDau = data1BangDau.ma_giai_dau;
    const giaiDau = await hamChung.layThongTinTheo_ID("giai_dau", maGiaiDau);
    return giaiDau;
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
    console.log(data);
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_bang_dau;
        option.textContent = `${item.ten_bang_dau}`;
        selectElement.appendChild(option);
    });
}

function sapXep_danhDanh_bangXepHang_theoDiem(data) {
    return data.sort((a, b) => b.diem - a.diem);
}

async function tinhSoTran_hinhThucKetQua_theo_doiBongGiaiDau(maDoiBong, maGiaiDau) {

    // laaays ra danh sachs  traanj daaus cuaur giari
    const datatran_dau = await hamChung.layDanhSach("tran_dau");
    const dataket_qua_tran_dau = await hamChung.layDanhSach("ket_qua_tran_dau");
    // danh sachs traanj ddaaus theo giair  
    const datatran_dau_theoGiaiDau = datatran_dau.filter(item => item.ma_giai_dau === maGiaiDau);
    // laays ra danh sachs ket qua tran dau, co tran dau ben tren
    // Lấy mảng ma_tran_dau từ danh sách datatran_dau_theoGiaiDau
    const maTranDauTheoGiaiDau = datatran_dau_theoGiaiDau.map(item => item.ma_tran_dau);

    // Lọc danh sách ket_qua_tran_dau sao cho ma_tran_dau tồn tại trong maTranDauTheoGiaiDau
    const dataket_qua_tran_dau_theoGiaiDau = dataket_qua_tran_dau.filter(item =>
        maTranDauTheoGiaiDau.includes(item.ma_tran_dau)
    );
    // console.log("ma doi bong : " + maDoiBong);
    // console.log("ma giai dau: " + maGiaiDau);
    // console.log(datatran_dau_theoGiaiDau);
    // console.log(dataket_qua_tran_dau);
    // console.log(dataket_qua_tran_dau_theoGiaiDau);
    // đếm xem mã đội bóng đó có mấy trấn thắng
    let form = {
        soTranThang: 0,
        soTranHoa: 0,
        soTranThua: 0,
        soBanThang: 0,
        soBanThua: 0
    };

    for (let i = 0; i < dataket_qua_tran_dau_theoGiaiDau.length; i++) {
        let dataXet = dataket_qua_tran_dau_theoGiaiDau[i];
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
async function loadDanhSachDoiBong_theoBangDau(maBangDau) {

    const selectElement = document.getElementById("maDoiBong");
    selectElement.innerHTML = '<option value="">-- All đội --</option>'; // Reset danh sách
    const data = await hamChung.layDanhSach("doi_bong_giai_dau");
    if (maBangDau != null) {
        const data1GiaiDau = await layGiaiDau_theo_maBangDau(maBangDau);
        const dataDoiBong_theo_maGiaiDau = data.filter(item => item.ma_giai_dau === data1GiaiDau.ma_giai_dau);
        const dataDoiBong_theo_maBangDau = data.filter(item => item.ma_bang_dau === maBangDau);
        console.log(data1GiaiDau);
        console.log(dataDoiBong_theo_maGiaiDau);
        console.log(dataDoiBong_theo_maBangDau);
    }

    const dataDoiBong_theo_maGiaiDau = data.filter(item => item.ma_bang_dau === maBangDau);

    let data1giaiDau;

    if (maBangDau != undefined && maBangDau != "") {
        data1giaiDau = await layGiaiDau_theo_maBangDau(maBangDau);
    }
    console.log(maBangDau);
    console.log(data);
    console.log(dataDoiBong_theo_maGiaiDau);
    for (let i = 0; i < dataDoiBong_theo_maGiaiDau.length; i++) {
        let item = dataDoiBong_theo_maGiaiDau[i];
        const data1DoiBong = await hamChung.layThongTinTheo_ID("doi_bong", item.ma_doi_bong);


        let tenDoiBongTrongGiai = "---";
        if (data1giaiDau.ma_giai_dau != null) {
            const data1DoiBong_giaiDau = await hamChung.layThongTinTheo_2_ID("doi_bong_giai_dau", item.ma_doi_bong, data1giaiDau.ma_giai_dau);
            tenDoiBongTrongGiai = data1DoiBong_giaiDau.ten_doi_bong;
        }



        const option = document.createElement("option");
        option.value = data1DoiBong.ma_doi_bong;
        option.textContent = `${tenDoiBongTrongGiai}`;
        selectElement.appendChild(option);
    }
}

async function check_doiBongGiaiDau_trongKo_bangXepHangVongLoai(maBangDau, maDoiBong) {
    const dataBangXepHang = await hamChung.layDanhSach("bang_xep_hang_vong_loai");

    // Tìm xem có dòng nào khớp cả ma_bang_dau và ma_doi_bong
    const timThay = dataBangXepHang.some(item =>
        item.ma_bang_dau === maBangDau && item.ma_doi_bong === maDoiBong
    );

    return timThay; // true nếu có, false nếu không
}
