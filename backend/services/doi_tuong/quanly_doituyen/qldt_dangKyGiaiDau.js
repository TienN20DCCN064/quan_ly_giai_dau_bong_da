const btnLuuThayDoi = document.getElementById("button_luu");
const btnTaiLaiTrang = document.getElementById("button_taiLaiTrang");
let currentButtonState = ""; // Biến toàn cục
document.addEventListener("DOMContentLoaded", function () {
    console.log("Đã vào trang qldt_dangKyGiaiDau");
    console.log(DoiTuyen.getDoiTuyen_dangChon());
    console.log(GlobalStore.getUsername());
    viewTbody();
    // Gán sự kiện cho nút
    // btnLuuThayDoi.addEventListener("click", handleLuuThayDoi);
    // btnTaiLaiTrang.addEventListener("click", handleTaiLaiTrang);
    // Đóng modal

    //  document.getElementById("closeModal").onclick = () => {
    //     document.getElementById("modalDangKy").style.display = "none";
    // };

    document.getElementById("huyDangKy").onclick = () => {
        document.getElementById("modalDangKy").style.display = "none";
    };

    // Đóng modal khi nhấn vào dấu "x" trong modal đăng ký
    document.getElementById('closeModal').addEventListener('click', function () {
        document.getElementById('modalDangKy').style.display = 'none';
    });
    // Đóng modal khi click vào nút đóng
    document.getElementById('closeModalBtn').addEventListener('click', () => {
        document.getElementById('modalDanhSachCauThu').style.display = 'none';
    });
    // Xử lý khi nhấn nút gửi yêu cầu
    document.getElementById('xacNhanDangKy').addEventListener('click', function () {
        // Lấy danh sách các cầu thủ đã chọn
        const selectedPlayers = [];
        document.querySelectorAll('.player-checkbox:checked').forEach(checkbox => {
            selectedPlayers.push(checkbox.getAttribute('data-player-id'));
        });

        // thêm cầu thủ vào bảng cầu thủ _ giải đấu
        if (selectedPlayers.length > 0) {
            console.log('Danh sách cầu thủ đã chọn:', selectedPlayers);
            // Bạn có thể thực hiện các hành động khác với danh sách cầu thủ đã chọn ở đây
            selectedPlayers.forEach(async (ma_cauThu) => {
                //  console.log(`${ma_cauThu}`); // hoặc player.ten nếu player là object
                const data_cauThu = await hamChung.layThongTinTheo_ID("cau_thu", ma_cauThu);
                //    console.log("Giải đấu đang đăng ký: ", window.giaiDauDangChon);
                const giaiDauDangChon = window.giaiDauDangChon;

                const formData = {
                    "ma_cau_thu": data_cauThu.ma_cau_thu,
                    "ma_giai_dau": giaiDauDangChon.ma_giai_dau,
                    "ma_doi_bong": data_cauThu.ma_doi_bong,
                    "ho_ten": data_cauThu.ho_ten,
                    "so_ao": data_cauThu.so_ao,
                    "hinh_anh": data_cauThu.hinh_anh,
                    "ma_vi_tri": data_cauThu.ma_vi_tri
                }
                // Kiểm tra nếu hình ảnh null hoặc undefined thì xóa khỏi formData
                if (formData.hinh_anh == null) {
                    delete formData.hinh_anh;
                }
                hamChung.them(formData, "cau_thu_giai_dau");
                console.log(formData);
            });
            alert('Đã lưu cầu thủ tham gia!');
            document.getElementById('modalDanhSachCauThu').style.display = 'none';
            viewTbody(); // Cập nhật lại danh sách giải đấu sau khi lưu cầu thủ
        } else {
            alert('Vui lòng chọn ít nhất một cầu thủ!');
        }

        // // Đóng modal sau khi lưu
        // document.getElementById('modalDanhSachCauThu').style.display = 'none';
    });
    document.getElementById('dangKyGiai').addEventListener('click', async function () {
        console.log("đangư ký giải");
        // Kiểm tra xem giải đấu nào đang được đăng ký

        console.log("Giải đấu đang đăng ký: ", window.giaiDauDangChon);
        const giaiDauDangChon = window.giaiDauDangChon;
        // Lấy thông tin từ form
        const formData = {
            "ma_giai_dau": giaiDauDangChon.ma_giai_dau,
            "ma_doi_bong": DoiTuyen.getDoiTuyen_dangChon()
        };
        console.log(formData);
        await hamChung.them(formData, "dang_ky_tham_gia_giai");
        alert("Đăng Ký thành công!");
        document.getElementById("modalDangKy").style.display = "none";
        viewTbody(); // Cập nhật lại danh sách giải đấu sau khi đăng ký

    });

});



// Hàm xử lý tải lại trang
function handleTaiLaiTrang(event) {
    event.preventDefault();
    location.reload(); // Bỏ comment dòng này nếu muốn tải lại trang
}



async function viewTbody() {
    const data = await hamChung.layDanhSach("giai_dau"); // Lấy danh sách giải đấu
    const tableBody = document.getElementById("dataTable");
    tableBody.innerHTML = "";

    const doiTuyenDangChon = DoiTuyen.getDoiTuyen_dangChon();

    for (const item of data) {
        const row = document.createElement("tr");

        // Ngày hôm nay & ngày hết hạn đăng ký
        const today = new Date();
        const endDate = new Date(item.ngay_ket_thuc_dang_ky_giai);

        // Trạng thái đăng ký của đội
        const thongTinDangKy = await layTrangThaiDangKy(item.ma_giai_dau, doiTuyenDangChon);
        const daNhapCauThu = await check_doiBong_daNhap_cauThu_giaiDau_chua(item.ma_giai_dau, doiTuyenDangChon);

        // Trả về true nếu đã có cầu thủ được nhập

        // => ví dụ {trang_thai: 'pending' | 'approved' | 'rejected' | 'completed' | null}

        let buttonText = "";
        let buttonColor = "";
        let buttonDisabled = false;

        if (today > endDate && (!thongTinDangKy || thongTinDangKy.trang_thai === null)) {
            buttonText = "Đã hết hạn đăng ký";
            buttonColor = "#dc3545"; // đỏ
            buttonDisabled = true;
        } else if (!thongTinDangKy || thongTinDangKy.trang_thai === null) {
            buttonText = "Đăng ký";
            buttonColor = "#007bff"; // xanh dương
            buttonDisabled = false;
        } else {
            switch (thongTinDangKy.trang_thai) {
                case "Chờ duyệt":
                    buttonText = "Chờ phê duyệt";
                    buttonColor = "#ffc107";
                    buttonDisabled = true;
                    break;
                case "Đã duyệt":
                    console.log(daNhapCauThu);
                    if (daNhapCauThu) {
                        buttonText = "Đã nhập cầu thủ";
                        buttonColor = "#17a2b8"; // xanh cyan
                        buttonDisabled = true;
                    } else {
                        buttonText = "Nhập cầu thủ";
                        buttonColor = "#28a745";
                        buttonDisabled = false;
                    }
                    break;
                case "Từ chối":
                    buttonText = "Bị từ chối";
                    buttonColor = "#dc3545";
                    buttonDisabled = true;
                    break;
                case "Đã hoàn tất":
                    buttonText = "Hoàn tất";
                    buttonColor = "#6c757d";
                    buttonDisabled = true;
                    break;
                default:
                    buttonText = "Không xác định";
                    buttonColor = "#6c757d";
                    buttonDisabled = true;
                    break;
            }

        }


        row.innerHTML = `
            <td style="text-align: center;">${item.ten_giai_dau}</td>
            <td style="text-align: center;">${item.ten_to_chuc}</td>
            <td style="text-align: center;">${item.ngay_bat_dau}</td>
            <td style="text-align: center;">${item.ngay_ket_thuc}</td>
            <td style="text-align: center;">${item.gioi_tinh}</td>
            <td style="text-align: center;">${item.mo_ta || ""}</td>
            <td style="text-align: center;">
                <button class="sign_up-btn btn btn-warning btn-sm" 
                        style="background-color: ${buttonColor};" 
                        ${buttonDisabled ? "disabled" : ""}
                        data-magiaidau="${item.ma_giai_dau}">
                    ${buttonText}
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    }

    button_dangKy(data); // Gắn sự kiện cho nút
}
async function layTrangThaiDangKy(ma_giai_dau, ma_doi_bong) {
    const danhSach = await hamChung.layDanhSach("dang_ky_tham_gia_giai");
    return danhSach.find(row =>
        row.ma_giai_dau === ma_giai_dau && row.ma_doi_bong === ma_doi_bong
    ) || null;
}



function button_dangKy(data) {
    document.querySelectorAll(".sign_up-btn").forEach((btn, index) => {
        btn.addEventListener("click", () => {

            const item = data[index];
            // 🔥 In ra loại button
            const buttonType = btn.innerText.trim();
            console.log("Loại button được click:", buttonType);
            // Lưu tạm dữ liệu giải đấu nếu cần xử lý xác nhận
            window.giaiDauDangChon = item;
            if (buttonType === "Đăng ký") {
                // Hiển thị thông tin vào modal
                document.getElementById("thongTinGiaiDau").innerHTML = `
               
                <p><strong>Tên Giải Đấu:</strong> ${item.ten_giai_dau}</p>
                <p><strong>Tên Tổ Chức:</strong> ${item.ten_to_chuc}</p>
                <p><strong>Ngày Bắt Đầu:</strong> ${item.ngay_bat_dau}</p>
                <p><strong>Ngày Kết Thúc:</strong> ${item.ngay_ket_thuc}</p>
                <p><strong>Giới Tính:</strong> ${item.gioi_tinh}</p>
                <p><strong>Mô Tả:</strong> ${item.mo_ta || ""}</p>
            `;



                // Hiển thị modal
                document.getElementById("modalDangKy").style.display = "flex";
            }
            else if (buttonType === "Nhập cầu thủ") {
                openPlayerList();
            }
        });
    });

}

async function check_doiBong_daDangKy_Giai_chua(maGiaiDau, maDoiBong) {
    const data_dangKyThamGiaGiai = await hamChung.layDanhSach("dang_ky_tham_gia_giai");

    // Kiểm tra xem maDoiBong có tồn tại trong danh sách đăng ký với maGiaiDau hay không
    const isDoiBongDaDangKy = data_dangKyThamGiaGiai.some(item => item.ma_giai_dau === maGiaiDau && item.ma_doi_bong === maDoiBong);

    // đã đăng ký
    if (isDoiBongDaDangKy)
        return true;
    return false;

}
async function check_doiBong_daNhap_cauThu_giaiDau_chua(maGiaiDau, maDoiBong) {
    const data_dangKyThamGiaGiai = await hamChung.layDanhSach("cau_thu_giai_dau");
    console.log(maGiaiDau + " " + maDoiBong);
    console.log(data_dangKyThamGiaGiai)
    // Kiểm tra xem đội bóng đã đăng ký giải đấu chưa
    const isDoiBong_nhap_cauThu = data_dangKyThamGiaGiai.some(item =>
        item.ma_giai_dau === maGiaiDau && item.ma_doi_bong === maDoiBong
    );
    console.log(isDoiBong_nhap_cauThu);

    // đã đăng ký
    if (isDoiBong_nhap_cauThu)
        return true;
    return false;
}



// Mở Modal danh sách cầu thủ
async function openPlayerList() {
    // Thực hiện logic để mở modal danh sách cầu thủ
    document.getElementById('modalDanhSachCauThu').style.display = 'flex';  // Sử dụng 'flex' để căn giữa
    const data_cau_thu = await hamChung.layDanhSach("cau_thu");
    const data_cauThu_cua_DoiBong = data_cau_thu.filter(cauThu => cauThu.ma_doi_bong === DoiTuyen.getDoiTuyen_dangChon());
    // Dữ liệu mẫu về cầu thủ (có thể lấy từ API hoặc database)

    console.log(data_cauThu_cua_DoiBong);
    // Chèn danh sách cầu thủ vào bảng
    const playerListBody = document.getElementById('playerListBody');
    playerListBody.innerHTML = ''; // Xóa các dữ liệu cũ (nếu có)
    for (let i = 0; i < data_cauThu_cua_DoiBong.length; i++) {
        const player = data_cauThu_cua_DoiBong[i];

        let hinh_anh;
        // C:\Users\vanti\Desktop\quan_ly_tran_dau\frontend\public\images\cat-2.png

        if (player.hinh_anh === null) {
            hinh_anh = "/frontend/public/images/cat-2.png";
        } else {
            hinh_anh = await hamChung.getImage(player.hinh_anh);
        }
        const data1viTri = await hamChung.layThongTinTheo_ID("vi_tri_cau_thu", player.ma_vi_tri);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="text-align: center;">${player.ho_ten}</td>
            <td style="text-align: center;">${player.so_ao}</td>
            <td style="text-align: center;">${data1viTri.ten_vi_tri}</td>
            <td style="text-align: center;">${player.gioi_tinh}</td>
            <td style="text-align: center;"><img src="${hinh_anh}" alt="Logo" width="50"></td>
            <td style="text-align: center;">
                <input type="checkbox" class="player-checkbox" data-player-id="${player.ma_cau_thu}">
            </td>
        `;

        playerListBody.appendChild(row);
    }

}



