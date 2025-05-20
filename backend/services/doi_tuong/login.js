// // Lấy query hiện tại




// document.addEventListener("DOMContentLoaded", function () {
//     const url = new URL(window.location.href);
//     const params = url.searchParams;

//     const btnQuenMatKhau = document.getElementById("btn_quenMatKhau");
//     const btnQuayLai = document.getElementById("btn_quayLaiDangNhap");

//     // Kiểm tra và thêm param mặc định nếu chưa có
//     if (!params.has('trangThai')) {
//         params.set('trangThai', "dangNhap"); // Thêm mặc định
//         window.location.href = `${url.pathname}?${params.toString()}`;
//     }
//     if (btnQuenMatKhau) {
//         btnQuenMatKhau.addEventListener("click", function () {
//             params.set('trangThai', "quenMatKhau");
//             window.location.href = `${url.pathname}?${params.toString()}`;
//         });
//     }

//     if (btnQuayLai) {
//         btnQuayLai.addEventListener("click", function () {
//             params.set('trangThai', "dangNhap");
//             window.location.href = `${url.pathname}?${params.toString()}`;
//         });
//     }


//     const trangThai = params.get('trangThai');
//     const formDangNhap = document.getElementById("form_dangNhap");
//     const formQuenMK = document.getElementById("form_quenMK");

//     if (trangThai == "dangNhap") {
//         console.log("trang thai dang nhap");
//         formDangNhap.style.display = "block";
//         formQuenMK.style.display = "none";
//         viewTrangThai_dangNhap();
//     } else if (trangThai == "quenMatKhau") {
//         console.log("trang thai lay mat khau");
//         formDangNhap.style.display = "none";
//         formQuenMK.style.display = "block";
//         viewTrangThai_layMatKhau();
//     }
// });

// // Hiển thị mật khẩu trong form đăng nhập
// document.getElementById("showPassword").addEventListener("change", function () {
//     const passwordInput = document.getElementById("mk");
//     passwordInput.type = this.checked ? "text" : "password";
// });

// function viewTrangThai_dangNhap() {

//     GlobalStore.setUsername(null); // Đặt lại username về
//     const loginForm = document.getElementById("form_dangNhap");

//     if (loginForm) {
//         loginForm.addEventListener("submit", async function (event) {
//             event.preventDefault(); // Ngăn chặn form submit mặc định

//             // Lấy giá trị nhập vào từ người dùng
//             const username = document.getElementById("tk").value.trim();
//             const password = document.getElementById("mk").value.trim();

//             // Lấy danh sách người dùng từ hamChung
//             var data = await hamChung.layDanhSach("tai_khoan");

//             console.log(data);


//             // Kiểm tra xem username & password có khớp trong danh sách không
//             var user = data.find(user => user.tai_khoan === username && user.mat_khau === password);
//             // nếu có
//             if (user) {
//                 // GlobalStore.setUsername(username);


//                 let url = "";
//                 GlobalStore.setUsername(user.tai_khoan);
//                 const data_taiKhoan = await hamChung.layThongTinTheo_ID("tai_khoan", user.tai_khoan);
//                 console.log("thông tin tài khoản đang đăng nhập");
//                 console.log(data_taiKhoan);
//                 const data_vaiTro = await hamChung.layThongTinTheo_ID("vai_tro", data_taiKhoan.ma_vai_tro);
//                 console.log(data_vaiTro.ten_vai_tro);
//                 alert("Đăng nhập thành công!");
//                 if (data_vaiTro.ten_vai_tro == "Admin") {
//                     url = "/frontend/view/quanly_admin/doi_bong/cau_thu.html";
//                     window.location.href = url;
//                     return;
//                     //  alert("Đăng nhập thành công!");
//                 }
//                 // nếu tài khoản là quản lý đội bóng
//                 else if (data_vaiTro.ten_vai_tro == "Quản lý đội bóng") {
//                     // nếu đó là tài khoản qldb thì lấy ra mã người dùng từ tên tk
//                     const dataNguoiDung = await hamChung.layDanhSach("nguoi_dung");
//                     // tìm ra tài khoản có người dùng đang đăng nhập
//                     const nguoiDungHienTai = dataNguoiDung.find(
//                         (nguoiDung) => nguoiDung.tai_khoan === user.tai_khoan
//                     );
//                     console.log("thông tin người dùng đang đăng nhập");
//                     console.log(nguoiDungHienTai);
//                     // nếu tài khoản không có tôn tại thì thông báo lỗi
//                     if (nguoiDungHienTai == null) {
//                         alert("Tài khoản không có quyền quản lý đội bóng!");
//                         url = "/frontend/view/login.html";
//                         window.location.href = url;
//                         return;
//                     }
//                     // // nếu tài khoản có tôn tại thì in ra
//                     // console.log(nguoiDungHienTai);
//                     const dataDoiBong = await hamChung.layDanhSach("doi_bong");
//                     // tìm ra danh sách đội bóng mà người dùng đang quản lý
//                     const danhSachDoiBongCuaNguoiDung = dataDoiBong.filter(item => item.ma_ql_doi_bong === nguoiDungHienTai.ma_nguoi_dung);

//                     console.log(danhSachDoiBongCuaNguoiDung);
//                     if (danhSachDoiBongCuaNguoiDung.length === 0) {
//                         alert("Tài khoản không có quyền quản lý đội bóng!");
//                         url = "/view/login.html";
//                         window.location.href = url;
//                         return;
//                     }
//                     else if (danhSachDoiBongCuaNguoiDung.length === 1) {
//                         // truyên vào param luôn và lấy dưx liệu của đội tuyển đó  // ko thì truyền vào biến global và chọn đội tuyền cần là cái đó
//                         DanhSach.setDoiBongDangChon(danhSachDoiBongCuaNguoiDung[0].ma_doi_bong);
//                         url = "/view/ql_trangchu.html";
//                     }
//                     // trường hợp tài khoản đó quản lý nhiều đội tuyển
//                     else {
//                         const danhSachDoiBong = danhSachDoiBongCuaNguoiDung;

//                         const container = document.getElementById("chonDoiBongContainer");
//                         const ul = document.getElementById("danhSachDoiBong");

//                         // Xóa các mục cũ nếu có
//                         ul.innerHTML = "";

//                         // Hiện khung chọn đội bóng
//                         container.style.display = "block";

//                         danhSachDoiBong.forEach(doiBong => {
//                             const li = document.createElement("li");
//                             const btn = document.createElement("button");
//                             btn.textContent = doiBong.ten_doi_bong;
//                             btn.style.margin = "5px";
//                             btn.onclick = () => {
//                                 console.log("Bạn đã chọn đội bóng:");
//                                 console.log(doiBong); // In toàn bộ thông tin đội bóng ra console
//                                 //window.location.href = "/frontend/view/quanly_doituyen/ql_trangchu.html?maDoiBong=" + doiBong.ma_doi_bong;
//                                 DoiTuyen.setDoiTuyen_dangChon(doiBong.ma_doi_bong);

//                                 // DoiTuyen = {
//                                 //     setDoiTuyen_dangChon(doiTuyen) {
//                                 //         localStorage.setItem("doiTuyen_dangChon", doiTuyen);
//                                 //     },

//                                 window.location.href = "/frontend/view/quanly_doituyen/qldt_trangchu.html";
//                             };
//                             li.appendChild(btn);
//                             ul.appendChild(li);
//                         });
//                     }

//                     //url = "/view/quanlynhahang/trangchu.html";
//                 }


//             } else {
//                 console.log("Đăng nhập thất bại!");
//                 alert("Sai tài khoản hoặc mật khẩu!");
//             }
//         });
//     }


//     document.addEventListener("DOMContentLoaded", function () {
//         const passwordInput = document.getElementById("mk");
//         const showPasswordCheckbox = document.getElementById("showPassword");

//         if (showPasswordCheckbox) {
//             showPasswordCheckbox.addEventListener("change", function () {
//                 passwordInput.type = this.checked ? "text" : "password";
//             });
//         }
//     });

// }

// function viewTrangThai_layMatKhau() {
//     const layMKform = document.getElementById("form_quenMK");

//     if (layMKform) {
//         layMKform.addEventListener("submit", async function (event) {
//             event.preventDefault(); // Ngăn chặn form submit mặc định

//             // Lấy giá trị nhập vào từ người dùng
//             const username = document.getElementById("tk_thayDoiMK").value.trim();
//             const gmail = document.getElementById("gm_thayDoiMK").value.trim();

//             // Lấy danh sách người dùng từ hamChung
//             const data_taiKhoan = await hamChung.layDanhSach("tai_khoan");
//             const data_nguoiDung = await hamChung.layDanhSach("nguoi_dung");

//             // Kiểm tra xem username & gmail có khớp trong danh sách không
//             var user = data_taiKhoan.find(user => user.tai_khoan === username);
//             if (user) {
//                 // nếu tài khoản có tồn tại thì kiểm tra gmail
//                 var nguoiDung = data_nguoiDung.find(nguoiDung => nguoiDung.tai_khoan === user.tai_khoan);
//                 if (nguoiDung) {
//                     if (nguoiDung.email === gmail) {
//                         const data_1taiKhoan = await hamChung.layThongTinTheo_ID("tai_khoan", username);
//                         // const data_1NguoiDung = await hamChung.layThongTinTheo_ID("nguoi_dung", nguoiDung.);
//                         const mkMoi = data_1taiKhoan.mat_khau + "12345fdsfs6"; // Mật khẩu mới của người dùng
//                         const form_nguoiDung = {
//                             email_receiver: nguoiDung.email, // Email của người dùng
//                             message: mkMoi // Mật khẩu mới của người dùng
//                         };

//                         const form_doiMK = {
//                             "tai_khoan": nguoiDung.tai_khoan,
//                             "mat_khau": mkMoi
//                         }
//                         console.log(form_nguoiDung); // In ra mật khẩu mới để kiểm tra (có thể xóa sau này)
//                         console.log(form_doiMK); // In ra mật khẩu mới để kiểm tra (có thể xóa sau này)  
//                         sendEmail(form_nguoiDung); // Gọi hàm gửi email
//                         //hamChung.sua(form_doiMK);
//                         hamChung.sua(form_doiMK, "tai_khoan");
//                         alert("Mật khẩu mới của bạn được gửi vào gmail! " + gmail);
//                         return;
//                     }
//                     else if (nguoiDung.email !== gmail) {
//                         alert("Sai gmail!");
//                         return;
//                     }

//                 } else {
//                     alert("Sai tài khoản!");
//                     return;
//                 }
//             }
//             else {
//                 alert("Sai tài khoản hoặc gmail!");
//                 return;
//             }
//         });
//     }

// }


// // Hàm gửi email thông qua API của server
// function sendEmail(nguoiDung) {
//     const emailReceiver = nguoiDung.email_receiver; // Lấy email người nhận từ đối tượng nguoiDung
//     const message = `Mật khẩu mới của bạn là: ${nguoiDung.message}`; // Soạn thông điệp

//     // Gửi yêu cầu POST đến server Flask
//     fetch('http://localhost:5003/send-email', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             email_receiver: emailReceiver,
//             message: message
//         })
//     })
//         .then(response => response.json())
//         .then(data => {
//             if (data.status === 'success') {
//                 alert("Mật khẩu mới của bạn được gửi vào Gmail! " + nguoiDung.email);
//             } else {
//                 alert("Lỗi gửi email: " + data.message);
//             }
//         })
//         .catch(error => {
//             console.error('Error:', error);
//             alert("Đã xảy ra lỗi khi gửi email.");
//         });
// }