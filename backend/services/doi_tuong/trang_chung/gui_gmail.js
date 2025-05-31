const email_gui = document.getElementById('email_gui');
// const email_nhan = document.getElementById('email_nhan');
const subject = document.getElementById('subject');
const message = document.getElementById('message');
const form = document.getElementById('form_sendEmail');


document.addEventListener("DOMContentLoaded", async function () {
    console.log(GlobalStore.getUsername());
    const taiKhoan = GlobalStore.getUsername();
    const doiTuyen_dangChon = DoiTuyen.getDoiTuyen_dangChon();
    console.log(doiTuyen_dangChon);
    const dataNguoiDung = await hamChung.layDanhSach("nguoi_dung");
    const nguoiDung_admin = dataNguoiDung.find(nguoiDung => nguoiDung.tai_khoan === "admin");
    if (!taiKhoan) {
        const url = "/frontend/view/login.html";
        window.location.href = url;
    }

    const data1NguoiDung = dataNguoiDung.find(nguoiDung => nguoiDung.tai_khoan === taiKhoan);
    if (data1NguoiDung != undefined) {
        email_gui.value = data1NguoiDung.email;
    }
    else {
        email_gui.value = "Bạn chưa có thông tin gmail";
    }



    form.addEventListener('submit', async function (event) {
        event.preventDefault(); // Ngăn reload form
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        if (data1NguoiDung === undefined) {
            alert("Cần thêm email cho tài khoản của bạn!");
            return;
        }
        let doiBongChon = "---";
        if(doiTuyen_dangChon != undefined){
            const data1DoiBong = await hamChung.layThongTinTheo_ID("doi_bong",doiTuyen_dangChon);
            doiBongChon = data1DoiBong.ten_doi_bong + " - " + data1DoiBong.quoc_gia;
        }
        const messageHTML = `
                                <p><strong>Email người gửi:</strong> ${data1NguoiDung.email}</p>
                                <p><strong>Đội bóng quản lý:</strong> ${doiBongChon}</p>
                                <p><strong>Nội dung:</strong><br>${message.value.replace(/\n/g, '<br>')}</p>
                            `;



        console.log(document.getElementById('email_gui').value);
        const form_sendGmail = {
            email_receiver: nguoiDung_admin.email,
            subject: subject.value,
            message: messageHTML
        }
        console.log(form_sendGmail);
        await hamChung.sendEmail(form_sendGmail.email_receiver, form_sendGmail.subject, form_sendGmail.message);


    });
});