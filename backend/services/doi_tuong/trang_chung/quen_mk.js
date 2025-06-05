
let maSo = ""; // <== Khai báo toàn cục ở đây
let isActivationShown = false;

const changePassBtn = document.getElementById("changePassBtn");
const form = document.getElementById("form_changePassword");
document.addEventListener("DOMContentLoaded", async function () {
    console.log("tien");
    changePassBtn.addEventListener("click", handleLuuThayDoi);

});
async function handleLuuThayDoi(event) {
    event.preventDefault(); // Ngăn form gửi ngay
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const activationInput = document.getElementById("activation_code");
    const activationCode = activationInput.value.trim();
    // const  maSo = generate6DigitCode();
    // Nếu mã kích hoạt chưa hiển thị
    if (!isActivationShown) {
        // Kiểm tra username và email đã nhập chưa
        if (username === "" || email === "") {
            alert("Vui lòng nhập tên tài khoản và email.");
            return;
        }
        const ketQua = await check_tk_va_gmail(username, email);
        if (ketQua != "Hợp lệ") {
            alert(ketQua);
            return;
        }
        alert("Đã gửi mã đến " + email);
        maSo = generate6DigitCode();
        console.log(maSo);
        await hamChung.sendEmail(email, "Mã kích hoạt", maSo);



        // Hiện mã kích hoạt và thay đổi trạng thái
        activationInput.style.display = "block";
        activationInput.focus();
        isActivationShown = true;
        return;
    }


    // Nếu mã kích hoạt đã hiển thị, kiểm tra tất cả các trường
    if (username === "" || email === "" || activationCode === "") {
        alert("Vui lòng nhập đầy đủ thông tin.");
        return;
    }
    else if (activationCode != maSo) {
        console.log(activationCode);
        console.log(maSo);
        alert("Số  ko hợp lệ");

    }
    else {
        const mk = "1";
        const form = {
            tai_khoan: username,
            mat_khau: mk
        }
        await hamChung.sendEmail(email, "Mật khảu mới : ", mk);
        await hamChung.sua(form, "tai_khoan");

        alert("Đã gửi mật khẩu " + email);
    }



}



function generate6DigitCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}


async function check_tk_va_gmail(taiKhoan, gmail) {
    const dataNguoiDung = await hamChung.layDanhSach("nguoi_dung");

    const dataTaiKhoan = await hamChung.layDanhSach("tai_khoan");
    // Tìm người dùng có liên kết với tài khoản và email khớp
    const tonTai_tk = dataTaiKhoan.find(tk =>
        tk.tai_khoan === taiKhoan
    );
    if (!tonTai_tk) {
        return "Tài khoản sai!";
    }

    const data1TaiKhoan = await hamChung.layThongTinTheo_ID("tai_khoan", taiKhoan);
    const ma_taiKhoan = data1TaiKhoan.tai_khoan;


    const tonTai_tk_trong_nd_va_gmail = dataNguoiDung.find(nd =>
        nd.tai_khoan === ma_taiKhoan && nd.email.toLowerCase() === gmail.toLowerCase()
    );

    if (!tonTai_tk_trong_nd_va_gmail) {
        return "Sai gmail!";
    } else {
        return "Hợp lệ";
    }
}
