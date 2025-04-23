// document.addEventListener("DOMContentLoaded", function () {

//     GlobalStore.setUsername(null); // Đặt lại username về
//     const loginForm = document.querySelector("form");

//     if (loginForm) {
//         loginForm.addEventListener("submit", async function (event) {
//             event.preventDefault(); // Ngăn chặn form submit mặc định

//             // Lấy giá trị nhập vào từ người dùng
//             const username = document.getElementById("taiKhoan").value.trim();
//             const password = document.getElementById("matKhau").value.trim();

//             // Lấy danh sách người dùng từ hamChung
//             var data = await hamChung.layDanhSach("tai_khoan");

//             console.log(data);


//             // Kiểm tra xem username & password có khớp trong danh sách không
//             var user = data.find(user => user.tai_khoan === username && user.mat_khau === password);
//             // nếu có
//             if (user) {
//                // GlobalStore.setUsername(username);


//                 let url = "";
//                 GlobalStore.setUsername(user.tai_khoan);
//                 const data_taiKhoan = await hamChung.layThongTinTheo_ID("tai_khoan", user.tai_khoan);
//                 console.log("thông tin tài khoản đang đăng nhập");
//                 console.log(data_taiKhoan);
//                 const data_vaiTro = await hamChung.layThongTinTheo_ID("vai_tro", data_taiKhoan.ma_vai_tro);
//                 console.log(data_vaiTro.ten_vai_tro);
//                 // alert("Đăng nhập thành công!");
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
// });

// document.addEventListener("DOMContentLoaded", function () {
//     const passwordInput = document.getElementById("mk");
//     const showPasswordCheckbox = document.getElementById("showPassword");

//     if (showPasswordCheckbox) {
//         showPasswordCheckbox.addEventListener("change", function () {
//             passwordInput.type = this.checked ? "text" : "password";
//         });
//     }
// });
