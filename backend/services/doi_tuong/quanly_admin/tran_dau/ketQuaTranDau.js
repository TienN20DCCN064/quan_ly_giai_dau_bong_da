// Thêm/Sửa trận đấu
// cái này khác những cái khác 
// phải xem id đã tồn tại chưa/
// nếu tồn tại thì sửa còn không thì thêm mới
// có mấy phần load, chặt chẽ hơn nếu là thêm thì chỉ in ra những cái chưa

// document.getElementById("maKetQua").value = item.ma_ket_qua;
// document.getElementById("soBanDoi1").value = item.so_ban_doi_1;
// document.getElementById("soBanDoi2").value = item.so_ban_doi_2;
// document.getElementById("maTranDau").value = item.ma_tran_dau;
// document.getElementById("maDoiThang").value = item.ma_doi_thang;
// document.getElementById("ghiChu").value = item.ghi_chu || "";
// const maKetQua = document.getElementById("maKetQua");
const btnLuuThayDoi = document.getElementById("button_luu");
const btnTaiLaiTrang = document.getElementById("button_taiLaiTrang");

const maGiaiDau = document.getElementById("maGiaiDau");
const maTranDau = document.getElementById("maTranDau");
const soBanDoi1 = document.getElementById("soBanDoi1");
const soBanDoi2 = document.getElementById("soBanDoi2");

const maDoiThang = document.getElementById("maDoiThang");
const ghiChu = document.getElementById("ghiChu");


document.addEventListener("DOMContentLoaded", async function () {
    loadDanhSachGiaiDau();

    let data = await hamChung.layDanhSach("ket_qua_tran_dau");
    viewTbody(data);
    // Xử lý sự kiện khi nhấn nút "Trận đấu có kết quả"
    document.getElementById("button_co_kq").addEventListener("click", async function () {
        // Gọi hàm xử lý khi có kết quả
        data = await hamChung.layDanhSach("ket_qua_tran_dau");
        viewTbody(data);
    });

    // Xử lý sự kiện khi nhấn nút "Trận đấu chưa kết quả"
    document.getElementById("button_chua_kq").addEventListener("click", async function () {
        // Gọi hàm xử lý khi chưa có kết quả
        data = null;
        const dsTranDau = await hamChung.layDanhSach("tran_dau");
        const dsKetQua = await hamChung.layDanhSach("ket_qua_tran_dau");
        const dsTranDauChuaCoKetQua = dsTranDau.filter(tranDau =>
            !dsKetQua.some(ketQua => ketQua.ma_tran_dau === tranDau.ma_tran_dau)
        );
        viewTbody(dsTranDauChuaCoKetQua);
    });





    // bàn đầu thì hiện đủ 



    maGiaiDau.addEventListener("change", function () {
        loadDanhSachTranDau_chua_co_kq(maGiaiDau.value);
    });
    maTranDau.addEventListener("change", function () {
        loadDanhSachDoiBongThamGia(maTranDau.value);
    });

    // loc_Data();


    btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);

});

async function viewTbody(data) {
    console.log(data);
    const tableBody = document.getElementById("dataTable");
    tableBody.innerHTML = "";

    data.forEach(async item => {
        const row = document.createElement("tr");
        // const data_tranDau = hamChung.layThongTinTheo_ID("tran_dau", item.ma_tran_dau);
     //   const data_maDoi1 = await hamChung.layThongTinTheo_ID("doi_bong", item.ma_doi_thang);

        // console.log(item.ma_doi_thang);
        // console.log(data_maDoi1);
        row.innerHTML = `
            <td style="text-align: center;">${item.ma_tran_dau ?? "----"}</td>
            <td style="text-align: center;">${item.ma_doi_thang ?? "----"}</td>
            <td style="text-align: center;">${item.so_ban_doi_1 ?? "----"}</td>
            <td style="text-align: center;">${item.so_ban_doi_2 ?? "----"}</td>
            <td style="text-align: center;">${item.ghi_chu ?? "----"}</td>
            <td style="text-align: center;"><button class="edit-btn btn btn-warning btn-sm">Sửa</button></td>
            <td style="text-align: center;"><button class="delete-btn btn btn-danger btn-sm">Xóa</button></td>
        `;
        tableBody.appendChild(row);
    });


    button_sua(data);
    // button_xoa(data);

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

    // if (check_tranDau_co_kq_chua) {
    //    console.l
    // } else {
    //     console.log(`Mã trận đấu ${maTranDauValue} chưa có kết quả.`);
    // }

    // Kiểm tra xem trường maGiaiDau có đang disabled không
    // 1 trong 2 đều được á
    // đã khóa lựa chọn nên ===>>chăcc chắn ====> sửa
    // sai với trường hợp chọn  ==>> trận đấu chưa có kq
    // if (maGiaiDau.disabled && maTranDau.disabled) {
    //     await hamChung.sua(formData, "ket_qua_tran_dau");
    // } else  // đã khóa lựa chọn nên ===>>chăcc chắn ====> thêm
    // {
    //     await hamChung.them(formData, "ket_qua_tran_dau");
    //     console.log("Trường maGiaiDau không bị disabled");
    // }
    const dsKq_tranDau = await hamChung.layDanhSach("ket_qua_tran_dau");
    const check_tranDau_co_kq_chua = dsKq_tranDau.some(item => item.ma_tran_dau === maTranDau.value);
    if (check_tranDau_co_kq_chua) {
        // Nếu đã có kết quả thì sửa
        console.log("Trận đấu đã có kết quả, thực hiện sửa.");
        await hamChung.sua(formData, "ket_qua_tran_dau");
        // luôn trả về danh sách trận đấu  có kết quả
        viewTbody(dsKq_tranDau);
    }
    else {
        console.log("Trận đấu chưa có kết quả, thực hiện thêm mới.");
        await hamChung.them(formData, "ket_qua_tran_dau");
        // luôn trả về danh sách trận đấu chưa có kết quả
        // chưa sửa được phần này 
        const dsTranDau = await hamChung.layDanhSach("tran_dau");
        // const dsKetQua = await hamChung.layDanhSach("ket_qua_tran_dau");
        const dsTranDauChuaCoKetQua = dsTranDau.filter(tranDau =>
            !dsKq_tranDau.some(ketQua => ketQua.ma_tran_dau === tranDau.ma_tran_dau)
        );
        viewTbody(dsTranDauChuaCoKetQua);
    }
    console.log(check_tranDau_co_kq_chua);

    // await hamChung.sua(formData, "ket_qua_tran_dau");

    // await hamChung.sua(formData, "tran_dau");
    alert("Sửa thành công!");

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

async function loadDanhSachTranDau(maGiaiDau) {
    const selectElement = document.getElementById("maTranDau");
    selectElement.innerHTML = '<option value="">-- Chọn Trận Đấu --</option>'; // Reset danh sách
    const dataTranDau = await hamChung.layDanhSach("tran_dau");
    // console.log(dataTranDau);
    const tranDauCanTim = dataTranDau.filter(item => item.ma_giai_dau === maGiaiDau); // Nếu ma_tran_dau là chuỗi
    // console.log(tranDauCanTim);
    tranDauCanTim.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_tran_dau;
        option.textContent = `${item.ma_tran_dau} - ${item.ma_tran_dau}`;
        selectElement.appendChild(option);
    });
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

    // Thêm các trận đấu chưa có kết quả vào dropdown
    tranDauChuaKetQua.forEach(item => {
        const option = document.createElement("option");
        option.value = item.ma_tran_dau;
        option.textContent = `${item.ma_tran_dau} - ${item.ma_tran_dau}`;
        selectElement.appendChild(option);
    });
}


async function loadDanhSachDoiBongThamGia(maTranDau) {
    const selectElement = document.getElementById("maDoiThang");
    selectElement.innerHTML = '<option value="">-- Chọn Đội Thắng --</option>'; // Reset danh sách
    const dataTranDau = await hamChung.layThongTinTheo_ID("tran_dau", maTranDau);
    //  console.log(dataTranDau);
    if (dataTranDau) {
        const { ma_doi_1, ma_doi_2 } = dataTranDau;

        const option1 = new Option(`Đội ${ma_doi_1}`, ma_doi_1);
        const option2 = new Option(`Đội ${ma_doi_2}`, ma_doi_2);

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

