
const btnLuuThayDoi = document.getElementById("button_luu");
const btnTaiLaiTrang = document.getElementById("button_taiLaiTrang");

const maGiaiDau = document.getElementById("maGiaiDau");
const maTranDau = document.getElementById("maTranDau");
const soBanDoi1 = document.getElementById("soBanDoi1");
const soBanDoi2 = document.getElementById("soBanDoi2");

const maDoiThang = document.getElementById("maDoiThang");
const ghiChu = document.getElementById("ghiChu");

const maGiaiDau_chon_viewbody = document.getElementById("maGiaiDau_chon_viewbody");
// const checkKetQua_chon_viewbody = document.getElementById("checkKetQua_chon_viewbody");


document.addEventListener("DOMContentLoaded", async function () {
    loadDanhSachGiaiDau();

    let data = await hamChung.layDanhSach("ket_qua_tran_dau");
    await viewTbody(data);





    // bàn đầu thì hiện đủ 


    loadDanhSachGiaiDau_chon_viewbody();
    //  loadDanhSachVongDau_chon_viewbody();
    maGiaiDau.addEventListener("change", async function () {
        await loadDanhSachTranDau_chua_co_kq(maGiaiDau.value);
    });
    maTranDau.addEventListener("change", function () {
        loadDanhSachDoiBongThamGia(maTranDau.value);
    });

    // loc_Data();


    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);
    maGiaiDau_chon_viewbody.addEventListener("change", async function () {
        console.log(maGiaiDau_chon_viewbody.value);
        // maVongDau_chon_viewbody.value = "All";
        let data = await hamChung.layDanhSach("ket_qua_tran_dau");

        viewTbody(data);
    });
    // checkKetQua_chon_viewbody.addEventListener("change", async function () {
    //     let data = await hamChung.layDanhSach("ket_qua_tran_dau");
    //     console.log(checkKetQua_chon_viewbody.value);

    //     viewTbody(data);
    // });

});
// async function check_maTranDau_co_ketQuaChua(ma_tran_dau) {
//     const dsKq_tranDau = await hamChung.layDanhSach("ket_qua_tran_dau");
//     return dsKq_tranDau.some(item => item.ma_tran_dau === ma_tran_dau);
// }

async function layGiaiDau_theo_maTranDau(ma_tran_dau) {
    const data1tranDau = await hamChung.layThongTinTheo_ID("tran_dau", ma_tran_dau);
    const data1GiaiDau = await hamChung.layThongTinTheo_ID("giai_dau", data1tranDau.ma_giai_dau);
    console.log(data1GiaiDau);
    return data1GiaiDau;
}

async function viewTbody(data) {
    let dataLoc = data;

    if (maGiaiDau_chon_viewbody.value !== "All") {
        console.log(maGiaiDau_chon_viewbody.value);
        dataLoc = [];
        for (const item of data) {
            const giaiDau = await layGiaiDau_theo_maTranDau(item.ma_tran_dau);
            if (giaiDau.ma_giai_dau === maGiaiDau_chon_viewbody.value) {
                dataLoc.push(item);
            }
        }
    }
    // if (checkKetQua_chon_viewbody.value === "chua_kq") {
    //     console.log(maGiaiDau_chon_viewbody.value);
    //     dataLoc = [];
    //     for (const item of data) {
    //         const giaiDau = await layGiaiDau_theo_maTranDau(item.ma_tran_dau);
    //         if (giaiDau.ma_giai_dau === maGiaiDau_chon_viewbody.value) {
    //             dataLoc.push(item);
    //         }
    //     }
    // }

    console.log(data);
    console.log(dataLoc);


    // if (maVongDau_chon_viewbody.value !== "All") {
    //     data = data.filter(item => item.ma_vong_dau === maVongDau_chon_viewbody.value);
    // }



    const tableBody = document.getElementById("dataTable");
    tableBody.innerHTML = "";
    for (const item of dataLoc) {
        const row = document.createElement("tr");
        //  console.log(item);
        // Lấy thông tin giải đấu và đội bóng từ mã
        const lay1TranDau = await hamChung.layThongTinTheo_ID("tran_dau", item.ma_tran_dau);
        const lay1giaiDau = await hamChung.layThongTinTheo_ID("giai_dau", lay1TranDau.ma_giai_dau)
        //  console.log(lay1giaiDau);
        let ten_doi_bong = "---";
        if (item.ma_doi_thang) {
            const lay1doiBong = await hamChung.layThongTinTheo_2_ID("doi_bong_giai_dau", item.ma_doi_thang, lay1TranDau.ma_giai_dau);
            ten_doi_bong = lay1doiBong.ten_doi_bong;
        }

        //console.log(lay1doiBong);
        row.innerHTML = `
            <td style="text-align: center;">${lay1giaiDau.ten_giai_dau ?? "----"}</td>
            <td style="text-align: center;">${item.ma_tran_dau ?? "----"}</td>
            <td style="text-align: center;">${ten_doi_bong}</td>
            <td style="text-align: center;">${item.so_ban_doi_1 ?? "----"}</td>
            <td style="text-align: center;">${item.so_ban_doi_2 ?? "----"}</td>
            <td style="text-align: center;">${item.ghi_chu ?? "----"}</td>
            <td style="text-align: center;"><button class="edit-btn btn btn-warning btn-sm">Sửa</button></td>
            <td style="text-align: center;"><button class="delete-btn btn btn-danger btn-sm">Xóa</button></td>
        `;
        tableBody.appendChild(row);
    }


    button_sua(dataLoc);
    button_xoa(dataLoc);

}
// Thêm/Sửa trận đấu
// cái này khác những cái khác 
// phải xem id đã tồn tại chưa/
// nếu tồn tại thì sửa còn không thì thêm mới
// trường hợp Chọn Giải Đâu ko khóa
//          th1: thêm
//          th2: sửa
// trường hợp Chọn Giải Đâu khóa
//          th1: thêm
//          th2: sửa   ===> phần load secsion phần trận đấu (chỉ cho hiện những trận đấu chưa có kết quả)
async function handleLuuThayDoi(event) {
    event.preventDefault();

    const form = document.getElementById("inputForm");

    // Kiểm tra xem maTranDau.value có trong danh sách kết quả trận đấu
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    let formData = {};


    formData = {
        // maGiaiDau: maGiaiDau.value,
        ma_tran_dau: maTranDau.value,
        ma_doi_thang: maDoiThang.value,
        so_ban_doi_1: soBanDoi1.value,
        so_ban_doi_2: soBanDoi2.value,
        ghi_chu: ghiChu.value,
    };
    if(maDoiThang.value === "") {
        formData.ma_doi_thang = null; // Nếu không chọn đội thắng thì để là null
        if(soBanDoi1.value != soBanDoi2.value) {
            alert("Nếu không chọn đội thắng thì số bàn của hai đội phải bằng nhau!");
            return;
        }
    }
  

    const dsKq_tranDau = await hamChung.layDanhSach("ket_qua_tran_dau");
    const check_tranDau_co_kq_chua = dsKq_tranDau.some(item => item.ma_tran_dau === maTranDau.value);
    if (check_tranDau_co_kq_chua) {
        // Nếu đã có kết quả thì sửa
        console.log("Trận đấu đã có kết quả, thực hiện sửa.");
        await hamChung.sua(formData, "ket_qua_tran_dau");
        // luôn trả về danh sách trận đấu  có kết quả
        alert("Sửa thành công!");

    }
    else {
        console.log("Trận đấu chưa có kết quả, thực hiện thêm mới.");
        await hamChung.them(formData, "ket_qua_tran_dau");

        const dsTranDau = await hamChung.layDanhSach("tran_dau");
        // const dsKetQua = await hamChung.layDanhSach("ket_qua_tran_dau");

        alert("Thêm thành công!");

    }
    console.log(check_tranDau_co_kq_chua);
    await viewTbody(dsKq_tranDau);

    // await hamChung.sua(formData, "ket_qua_tran_dau");

    // await hamChung.sua(formData, "tran_dau");


    console.log(formData);


}

// Xử lý tải lại trang
function handleTaiLaiTrang(event) {
    event.preventDefault();
    location.reload();
}
function button_sua(data) {
    document.querySelectorAll(".edit-btn").forEach((btn, index) => {
        btn.addEventListener("click", async () => {
            const item = data[index];
            // trận đáu thuộc giải đấu nào thì hiện giải đấu đó

            const giaiDauTT = await hamChung.layThongTinTheo_ID("tran_dau", item.ma_tran_dau);

            await loadDanhSachTranDau(giaiDauTT.ma_giai_dau);
            await loadDanhSachDoiBongThamGia(item.ma_tran_dau);

            maGiaiDau.disabled = true;  // Làm cho trường không thể chỉnh sửa
            maTranDau.disabled = true;  // Làm cho trường không thể chỉnh sửa
            //  console.log(giaiDauTT);
            maGiaiDau.value = giaiDauTT.ma_giai_dau;
            maTranDau.value = item.ma_tran_dau;
            // maKetQua.value = item.ma_ket_qua;
            soBanDoi1.value = item.so_ban_doi_1;
            soBanDoi2.value = item.so_ban_doi_2;
            maTranDau.value = item.ma_tran_dau;
            maDoiThang.value = item.ma_doi_thang;
            ghiChu.value = item.ghi_chu || "";


            // Scroll lên đầu trang
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });
    });
}

// function button_xoa(data) {
//     document.querySelectorAll(".delete-btn").forEach((btn, index) => {
//         btn.addEventListener("click", () => {
//             if (confirm(`Bạn có chắc chắn muốn xóa kết quả ${data[index].ma_tran_dau}?`)) {
//                 data.splice(index, 1);
//                 viewTbody();
//             }
//         });
//     });
// }

// Xử lý nút "Xóa"
function button_xoa(data) {
    document.querySelectorAll(".delete-btn").forEach((btn, index) => {
        btn.addEventListener("click", async () => {
            if (confirm(`Bạn có chắc chắn muốn xóa kết quả ${data[index].ma_tran_dau} khỏi giải đấu?`)) {
                const formData = {
                    ma_tran_dau: data[index].ma_tran_dau
                };
                await hamChung.xoa(formData, "ket_qua_tran_dau");
                alert("Xóa thành công!");
                // Cập nhật lại danh sách kết quả trận đấu  

                const dsKq_tranDau = await hamChung.layDanhSach("ket_qua_tran_dau");
                viewTbody(dsKq_tranDau);
            }
        });
    });
}
async function loadDanhSachGiaiDau() {
    const selectElement = document.getElementById("maGiaiDau");
    selectElement.innerHTML = '<option value="">-- Chọn Giải Đấu --</option>'; // Reset danh sách
    const data = await hamChung.layDanhSach("giai_dau");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_giai_dau;
        option.textContent = `${item.ten_giai_dau}`;
        selectElement.appendChild(option);
    });
}

async function loadDanhSachTranDau(maGiaiDau) {
    const selectElement = document.getElementById("maTranDau");
    selectElement.innerHTML = '<option value="">-- Chọn Trận Đấu --</option>'; // Reset danh sách
    const dataTranDau = await hamChung.layDanhSach("tran_dau");
    // console.log(dataTranDau);
    const tranDauCanTim = dataTranDau.filter(item => item.ma_giai_dau === maGiaiDau); // Nếu ma_tran_dau là chuỗi

    for (const item of tranDauCanTim) {
        const option = document.createElement("option");
        console.log(item);
        const doi1 = await hamChung.layThongTinTheo_2_ID("doi_bong_giai_dau", item.ma_doi_1, item.ma_giai_dau);
        const doi2 = await hamChung.layThongTinTheo_2_ID("doi_bong_giai_dau", item.ma_doi_2, item.ma_giai_dau);
        option.value = item.ma_tran_dau;
        option.textContent = `${item.ma_tran_dau} - ${doi1.ten_doi_bong} -${doi2.ten_doi_bong} `;
        selectElement.appendChild(option);
    }
}
async function loadDanhSachTranDau_chua_co_kq(maGiaiDau) {
    const selectElement = document.getElementById("maTranDau");
    selectElement.innerHTML = '<option value="">-- Chọn Trận Đấu --</option>'; // Reset danh sách

    // Lấy danh sách các trận đấu
    const dataTranDau = await hamChung.layDanhSach("tran_dau");

    // Lấy danh sách kết quả trận đấu
    const layDanhSach_kqTranDau = await hamChung.layDanhSach("ket_qua_tran_dau");

    // Lọc các trận đấu thuộc giải đấu và chưa có kết quả
    const tranDauChuaKetQua = dataTranDau
        .filter(item => item.ma_giai_dau === maGiaiDau)  // Lọc theo giải đấu
        .filter(item => !layDanhSach_kqTranDau.some(kq => kq.ma_tran_dau === item.ma_tran_dau));  // Lọc trận đấu chưa có kết quả



    for (const item of tranDauChuaKetQua) {
        const option = document.createElement("option");
        // const doi1 = await hamChung.layThongTinTheo_ID("doi_bong", item.ma_doi_1);
        // const doi2 = await hamChung.layThongTinTheo_ID("doi_bong", item.ma_doi_2);
        console.log(item);
        const doi1 = await hamChung.layThongTinTheo_2_ID("doi_bong_giai_dau", item.ma_doi_1, item.ma_giai_dau);
        const doi2 = await hamChung.layThongTinTheo_2_ID("doi_bong_giai_dau", item.ma_doi_2, item.ma_giai_dau);
        option.value = item.ma_tran_dau;
        option.textContent = `${item.ma_tran_dau} - ${doi1.ten_doi_bong} -${doi2.ten_doi_bong} `;
        selectElement.appendChild(option);
    }
}


async function loadDanhSachDoiBongThamGia(maTranDau) {
    const selectElement = document.getElementById("maDoiThang");
    selectElement.innerHTML = '<option value="">-- Chọn Đội Thắng --</option>'; // Reset danh sách
    const dataTranDau = await hamChung.layThongTinTheo_ID("tran_dau", maTranDau);
    //  console.log(dataTranDau);
    if (dataTranDau) {
        const { ma_doi_1, ma_doi_2 } = dataTranDau;

        // Lấy thông tin chi tiết của hai đội bóng
        const doi1 = await hamChung.layThongTinTheo_2_ID("doi_bong_giai_dau", ma_doi_1, dataTranDau.ma_giai_dau);
        const doi2 = await hamChung.layThongTinTheo_2_ID("doi_bong_giai_dau", ma_doi_2, dataTranDau.ma_giai_dau);

        const tenDoi1 = doi1?.ten_doi_bong || `Đội ${ma_doi_1}`;
        const tenDoi2 = doi2?.ten_doi_bong || `Đội ${ma_doi_2}`;

        // Tạo option với tên đội bóng
        const option1 = new Option(tenDoi1, ma_doi_1);
        const option2 = new Option(tenDoi2, ma_doi_2);

        selectElement.appendChild(option1);
        selectElement.appendChild(option2);
    }
    //const tranDauCanTim = dataTranDau.filter(item => item.ma_giai_dau === maTranDau); // Nếu ma_tran_dau là chuỗi
    // tranDauCanTim.forEach(item => {
    //     const option = document.createElement("option");
    //     option.value = item.ma_tran_dau;
    //     option.textContent = `${item.ma_tran_dau} - ${item.ma_tran_dau}`;
    //     selectElement.appendChild(option);
    // });

}

async function loadDanhSachGiaiDau_chon_viewbody() {
    const selectElement = document.getElementById("maGiaiDau_chon_viewbody");
    selectElement.innerHTML = '<option value="All">Tất Cả</option>'; // Reset danh sách
    const data = await hamChung.layDanhSach("giai_dau");
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_giai_dau;
        option.textContent = `${item.ten_giai_dau}`;
        selectElement.appendChild(option);
    });
}
// async function loadDanhSachVongDau_chon_viewbody() {
//     const selectElement = document.getElementById("maVongDau_chon_viewbody");
//     selectElement.innerHTML = '<option value="All">Tất Cả</option>'; // Reset danh sách
//     const data = await hamChung.layDanhSach("vong_dau");
//     data.forEach(item => {
//         const option = document.createElement("option");
//         option.value = item.ma_vong_dau;
//         option.textContent = `${item.ten_vong}`;
//         selectElement.appendChild(option);
//     });
// }