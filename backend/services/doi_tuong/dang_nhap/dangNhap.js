document.addEventListener("DOMContentLoaded", function() {
  const loginForm = document.getElementById("loginForm");
  const taiKhoanInput = document.getElementById("taiKhoan");
  const matKhauInput = document.getElementById("matKhau");

  loginForm.addEventListener("submit", async function(e) {
    e.preventDefault(); // Ngăn form gửi theo kiểu cũ

    const tai_khoan = taiKhoanInput.value.trim();
    const mat_khau = matKhauInput.value.trim();

    try {

      formData = {
        tai_khoan: tai_khoan,
        mat_khau: mat_khau
      };
      console.log(formData)
      const res = await hamChiTiet.dangNhap(formData);
      // Gọi API đăng nhập (thay URL bằng endpoint thực tế)
     
      console.log(res)
      if (res.token) {
        GlobalStore.setUsername(res.user.tai_khoan);
        GlobalStore.setToken(res.token)
        console.log()
        if(res.user.vai_tro === "Quản lý đội bóng"){
          //window.location.href = "/frontend/view/quanly/doi_bong/cau_thu.html";

          console.log(res.user.tai_khoan)
          const data = await hamChiTiet.layDoiBongTheoQL(res.user.tai_khoan);
          console.log(data);
          //load danh sách đội bóng

          if (data.length === 1) {
            const maDoi = data[0].ma_doi_bong;
            DoiTuyen.setDoiTuyen_dangChon(maDoi);
            localStorage.setItem("ma_doi_bong", maDoi);            
            ///????
            window.location.href = `/frontend/view/quanly/doi_bong/cau_thu.html`;
            return;
          }


          const dialog = document.getElementById("dialog-chon-doi");
          const danhSachDoi = document.getElementById("danhSachDoi");
          danhSachDoi.innerHTML = ""; // clear

          data.forEach(doi => {
            const item = document.createElement("div");
            item.className = "dialog-item";
            item.innerText = doi.ten_doi_bong;
            
            item.onclick = () => {
              //??????
              DoiTuyen.setDoiTuyen_dangChon(doi.ma_doi_bong);
              localStorage.setItem("ma_doi_bong", doi.ma_doi_bong);
              window.location.href = `/frontend/view/quanly/doi_bong/cau_thu.html`;
            };
            danhSachDoi.appendChild(item);
          });

          dialog.style.display = "flex";
        }

        if(res.user.vai_tro === "Admin"){
          window.location.href = "/frontend/view/quanly_admin/giai_dau/giaiDau.html";
        }
      } else {
        // Nếu sai tài khoản/mật khẩu, server thường trả 401
        if (res.status === 401) {
          alert("Tài khoản hoặc mật khẩu không đúng!");
        } else {
          alert("Đăng nhập thất bại! Mã lỗi: " + res.status);
        }
      }
    } catch (err) {
      console.error("Lỗi kết nối:", err);
      alert("Không thể kết nối máy chủ!");
    }
  });
});