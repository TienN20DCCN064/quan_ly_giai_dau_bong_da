const hamChung = {
    // Đặt giá trị vào localStorage


    // Tự động tạo các hàm lấy danh sách từ `tables`


    async layDSNhaHang_theoLoai(loai) {
        return await layDanhSachSP_theoLoai(loai); // Đảm bảo trả về kết quả từ Promise
    },


    async layDanhSachDB_theoNhaHang(id) {
        return await layDanhSachDB_theoNhaHang(id); // Đảm bảo trả về kết quả từ Promise
    },
    async layDanhSachMenu_theoNhaHang(id) {
        return await layDanhSachMenu_theoNhaHang(id); // Đảm bảo trả về kết quả từ Promise
    },

    async layDanhSachMonAn_loai(idNhaHang, loai) {
        return await layDanhSachMonAnNhaHang_loai(idNhaHang, loai); // Đảm bảo trả về kết quả từ Promise
    },

    async layDanhSachBanAn_theoNhaHang(id_nhaHang) {
        return await layDanhSachBanAn_theoNhaHang(id_nhaHang); // Đảm bảo trả về kết quả từ Promise
    },


    async layDanhSach(table) {
        return await layDanhSach(table);
    },
    async layThongTinTheo_ID(table, id) {
        return await layThongTinTheo_ID(table, id);
    },



    async layThongTin_donDatBan_theoIDBan(id_ban,trangThai){
        return await layThongTin_donDatBan_theoIDBan(id_ban,trangThai);
    },
    taoID_theoBang(table) {
        return taoID_theoBang(table);
    },

    them(data, table_name) {
        return them(data, table_name)
    },
    sua(data, table_name) {
        return sua(data, table_name)
    },
    xoa(data, table_name) {
        return xoa(data, table_name)
    },


};

async function layDanhSach(table) {
    try {
        const response = await fetch(GlobalStore.getLinkCongAPI() + table);
        return await response.json();
    } catch (error) {
        console.error(`Lỗi khi lấy danh sách ${table}:`, error);
        return [];
    }
}


// async function layThongTinTheo_ID(table, id) {
//     const response = await fetch(GlobalStore.getLinkCongAPI() + table + "/" + id);
//     return await response.json();
// }
// Hàm lấy chi tiết theo ID
async function layThongTinTheo_ID(table, id) {
    try {
        const response = await fetch(GlobalStore.getLinkCongAPI() + table + "/" + id);
        return await response.json();
    } catch (error) {
        console.error(`Lỗi khi lấy thông tin ${table} với ID ${id}:`, error);
        return null;
    }
}


async function layDanhSachDB_theoNhaHang(id) {
    try {
        const response = await fetch(GlobalStore.getLinkCongAPI() + "dau_bep");
        const products = await response.json(); // Chuyển dữ liệu về JSON

        // Lọc danh sách sản phẩm theo mã loại
        const filteredProducts = products.filter(product => product.nha_hang_id === id);
        return filteredProducts;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        return [];
    }
}
async function layDanhSachSP_theoLoai(loai) {
    try {
        const response = await fetch(GlobalStore.getLinkCongAPI() + "nha_hang");
        const products = await response.json(); // Chuyển dữ liệu về JSON

        // Lọc danh sách sản phẩm theo mã loại
        const filteredProducts = products.filter(product => product.loai_id === loai);
        // console.log("Loai sp là : " + loai);
        // console.log(filteredProducts);
        return filteredProducts;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        return [];
    }
}
async function layDanhSachBanAn_theoNhaHang(id_nhaHang) {
    try {
        const response = await fetch(GlobalStore.getLinkCongAPI() + "ban_an");
        const products = await response.json(); // Chuyển dữ liệu về JSON

        // Lọc danh sách sản phẩm theo mã loại
        const filteredProducts = products.filter(product => product.nha_hang_id === id_nhaHang);
        // console.log("Loai sp là : " + loai);
        // console.log(filteredProducts);
        return filteredProducts;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách bàn ăn theo của nhà hàng:", error);
        return [];
    }
}

async function layDanhSachMonAnNhaHang_loai(idNhaHang, loai_do_an) {
    try {
        const response = await fetch(GlobalStore.getLinkCongAPI() + "thuc_don");
        const products = await response.json(); // Chuyển dữ liệu về JSON
        // console.log(products);
        // Lọc danh sách sản phẩm theo mã loại
        // consolog.log ("Loai sp là: " + loai);
        // console.log("loai_do_an: " + loai_do_an);
        const listThucDon_1NhaHang = products.filter(product => product.nha_hang_id === idNhaHang);
        // console.log(listThucDon_1NhaHang);
        const list1LoaiThucDon_1NhaHang = listThucDon_1NhaHang.filter(listThucDon_1NhaHang => listThucDon_1NhaHang.loai_do_an === loai_do_an);

        //   console.log(list1LoaiThucDon_1NhaHang);





        return list1LoaiThucDon_1NhaHang;
    }
    catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        return [];
    }
}



async function layDanhSachMenu_theoNhaHang(id) {
    try {
        const response = await fetch(GlobalStore.getLinkCongAPI() + "thuc_don");
        const products = await response.json(); // Chuyển dữ liệu về JSON

        // Lọc danh sách sản phẩm theo mã loại
        const filteredProducts = products.filter(product => product.nha_hang_id === id);
        // console.log("Loai sp là : " + loai);
        // console.log(filteredProducts);
        return filteredProducts;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        return [];
    }
}



// async function layThongTin_donDatBan_theoIDBan(id_ban) {
//    /// từ id bàn => id+ chi tiết đơn đặt bàn => id đơn đặt bàn
//     try {
//         const dsCT_donDatBan = await hamChung.layDanhSach("chi_tiet_don_dat_ban");
//         const dsDonDatBan = await hamChung.layDanhSach("don_dat_ban");
//         // console.log("thong tin ban được chọn : ");
//         const thongTinBanDuoChon = await dsCT_donDatBan.filter(product => product.ban_an_id === id_ban);

//         if (thongTinBanDuoChon != null) {
//             const donDatBan_theoBan = await hamChung.layThongTinTheo_ID("don_dat_ban", thongTinBanDuoChon[0].don_dat_ban_id);
//             // console.log("donDatBan_theoBan");
//             // console.log(donDatBan_theoBan);
//         }


//         // const response = await fetch(GlobalStore.getLinkCongAPI() + "chi_tiet_don_dat_ban");
//         // const products = await response.json(); // Chuyển dữ liệu về JSON

//         // // Lọc danh sách sản phẩm theo mã loại
//         // const filteredProducts = products.filter(product => product.ban_an_id === id_ban);
//         // console.log("Loai sp là : " + loai);
//         // console.log(filteredProducts);
//         return thongTinBanDuoChon;
//     } catch (error) {
//         console.error("Lỗi khi lấy danh sách sản phẩm:", error);
//         return [];
//     }
// }


async function layThongTin_donDatBan_theoIDBan(id_ban, trangThai) {
    // console.log("🔍 Tìm đơn đặt bàn cho bàn:", id_ban);
    // console.log("🔍 Bang ko :", id_ban === "B002");
    // console.log("🔍 Trạng thái cần tìm:", trangThai);
    // id_ban = "B002";
    
    try {
        // 🛑 Lấy danh sách chi tiết đơn đặt bàn
        const dsCT_donDatBan = await hamChung.layDanhSach("chi_tiet_don_dat_ban");
        const dsTheoBan = dsCT_donDatBan.filter(product => product.ban_an_id === id_ban);
        //console.log("📦 Danh sách chi tiết đơn đặt bàn:", dsTheoBan);
        const dsTheoTrangThai = dsTheoBan.filter(product => product.trang_thai === trangThai);

        if (dsTheoTrangThai.length === 0) {
            console.log("❌ Không tìm thấy đơn đặt bàn cho bàn này.");
            return null;
        }
        const mot_chiTietDonXuLy = dsTheoTrangThai[0];
        const donDatBan_canTim = await hamChung.layThongTinTheo_ID("don_dat_ban", mot_chiTietDonXuLy.don_dat_ban_id);
        
        // console.log("📦 Thông tin đơn đặt bàn tìm thấy:", donDatBan_canTim);

        return donDatBan_canTim;
    } catch (error) {
        console.error("❌ Lỗi khi lấy thông tin đơn đặt bàn:", error);
        return null;
    }
}


// // Hàm định dạng thời gian theo chuẩn Việt Nam (dd/mm/yyyy hh:mm:ss)
// function formatDateTime(dateTime) {
//     const date = new Date(dateTime);
//     const dd = String(date.getDate()).padStart(2, '0');
//     const mm = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
//     const yyyy = date.getFullYear();
//     const hh = String(date.getHours()).padStart(2, '0');
//     const mi = String(date.getMinutes()).padStart(2, '0');
//     const ss = String(date.getSeconds()).padStart(2, '0');

//     return `${dd}/${mm}/${yyyy} ${hh}:${mi}:${ss}`;
// }







// Tên bảng	ID lớn nhất	ID mới tạo
// don_dat_ban	ddb_0023	ddb_0024

async function taoID_theoBang(table) {
    try {
        const response = await fetch(GlobalStore.getLinkCongAPI() + table);
        const danhSach = await response.json();

        // Chuyển "don_dat_ban" -> "ddb_"
        const prefix = table.split("_").map(word => word.charAt(0)).join("") + "_";

        if (!Array.isArray(danhSach) || danhSach.length === 0) {
            return `${prefix}0001`; // Nếu bảng rỗng, tạo ID đầu tiên
        }

        // Tìm ID lớn nhất trong danh sách
        const lastID = danhSach
            .map(item => item.id)
            .filter(id => id.startsWith(prefix)) // Lọc đúng prefix
            .sort()
            .pop(); // Lấy ID lớn nhất

        if (!lastID) {
            return `${prefix}0001`; // Nếu không tìm thấy ID hợp lệ
        }

        // Lấy số cuối cùng, tăng lên 1
        const numberPart = parseInt(lastID.split("_")[1]) || 0;
        const newID = `${prefix}${(numberPart + 1).toString().padStart(4, "0")}`;

        return newID;
    } catch (error) {
        console.error(`Lỗi khi lấy danh sách ${table}:`, error);
        return `${table.split("_").map(w => w.charAt(0)).join("")}_0001`; // ID mặc định nếu lỗi
    }
}


function them(data, table_name) {

    const primaryKeys = {
        "ban_an": ["id"],
        "cau_hinh_giao_dien": ["id"],
        "chi_tiet_don_dat_ban": ["id"],
        "danh_gia": ["id"],
        "dau_bep": ["id"],
        "don_dat_ban": ["id"],
        "loai_nha_hang": ["id"],
        "nguoi_dung": ["id"],
        "nha_hang": ["id"],
        "thuc_don": ["id"],
        "trung_tam": ["id"],

        // "chi_tiet_don_dat_ban": ["don_dat_ban_id", "ban_an_id"],

    }[table_name];

    if (!data) {
        console.error("Dữ liệu không hợp lệ!");
        alert("Dữ liệu không hợp lệ!");
        return;
    }

    const url = `${GlobalStore.getLinkCongAPI()}${table_name}`;

    // console.log("Gửi POST request tới:", url);
    // console.log("Dữ liệu gửi đi:", data);

    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
        .then(async response => {
            const text = await response.text();
            if (!text.trim().startsWith("{") && !text.trim().startsWith("[")) {
          //      console.log("Phản hồi từ server:", text);
                return { message: text };
            }
            return JSON.parse(text);
        })
        .then(resData => {
      //      alert(resData.message || "Thêm dữ liệu thành công.");
            // table();
        })
        .catch(error => {
            console.error("Có lỗi xảy ra khi thêm:", error.message);
            alert(`Lỗi: ${error.message}`);
        });
}
function sua(data, table_name) {

    const primaryKeys = {
        "ban_an": ["id"],
        "cau_hinh_giao_dien": ["id"],
        "chi_tiet_don_dat_ban": ["id"],
        "danh_gia": ["id"],
        "dau_bep": ["id"],
        "don_dat_ban": ["id"],
        "loai_nha_hang": ["id"],
        "nguoi_dung": ["id"],
        "nha_hang": ["id"],
        "thuc_don": ["id"],
        "trung_tam": ["id"],

        // "chi_tiet_don_dat_ban": ["don_dat_ban_id", "ban_an_id"],

    }[table_name];

    if (!data) {
        console.error("Dữ liệu không hợp lệ!");
        alert("Dữ liệu không hợp lệ!");
        return;
    }
    if (!primaryKeys) {
        console.error(`Bảng ${table_name} không hợp lệ.`);
        alert("Bảng không hợp lệ!");
        return;
    }

    const keyValues = primaryKeys.map(key => data[key]);
    if (keyValues.some(value => value === undefined)) {
        console.error("Thiếu thông tin khóa chính!", data);
        alert("Thiếu thông tin khóa chính!");
        return;
    }

    const idPath = keyValues.join("/");
    const url = `${GlobalStore.getLinkCongAPI()}${table_name}/${idPath}`;

    // console.log("Gửi PUT request tới:", url);
    // console.log("Dữ liệu gửi đi:", data);

    fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
        .then(async response => {
            const text = await response.text();

            // Kiểm tra nếu phản hồi trống hoặc không phải JSON
            if (!text.trim().startsWith("{") && !text.trim().startsWith("[")) {
           //     console.log("Phản hồi từ server:", text);
                return { message: text }; // Trả về một object chứa message
            }

            return JSON.parse(text); // Nếu JSON hợp lệ, parse bình thường
        })
        .then(resData => {
            alert(resData.message || "Sửa dữ liệu thành công.");
            // table();
        })
        .catch(error => {
            console.error("Có lỗi xảy ra khi sửa:", error.message);
            alert(`Lỗi: ${error.message}`);
        });
}
function xoa(keys, table_name) {

    const primaryKeys = {
        "ban_an": ["id"],
        "cau_hinh_giao_dien": ["id"],
        "chi_tiet_don_dat_ban": ["id"],
        "danh_gia": ["id"],
        "dau_bep": ["id"],
        "don_dat_ban": ["id"],
        "loai_nha_hang": ["id"],
        "nguoi_dung": ["id"],
        "nha_hang": ["id"],
        "thuc_don": ["id"],
        "trung_tam": ["id"],

        // "chi_tiet_don_dat_ban": ["don_dat_ban_id", "ban_an_id"],

    }[table_name];

    if (!keys) {
        console.error("Thiếu thông tin khóa chính để xóa!");
        alert("Thiếu thông tin khóa chính để xóa!");
        return;
    }


    if (!primaryKeys) {
        console.error(`Bảng ${table_name} không hợp lệ.`);
        alert("Bảng không hợp lệ!");
        return;
    }

    const keyValues = primaryKeys.map(key => keys[key]);
    if (keyValues.some(value => value === undefined)) {
        console.error("Thiếu thông tin khóa chính!", keys);
        alert("Thiếu thông tin khóa chính!");
        return;
    }

    const idPath = keyValues.join("/");
    const url = `${GlobalStore.getLinkCongAPI()}${table_name}/${idPath}`;

    console.log("Gửi DELETE request tới:", url);

    fetch(url, { method: 'DELETE' })
        .then(async response => {
            const text = await response.text();
            if (!text.trim().startsWith("{") && !text.trim().startsWith("[")) {
                console.log("Phản hồi từ server:", text);
                return { message: text };
            }
            return JSON.parse(text);
        })
        .then(resData => {
            alert(resData.message || "Xóa dữ liệu thành công.");
            //table();
        })
        .catch(error => {
            console.error("Có lỗi xảy ra khi xóa:", error.message);
            alert(`Lỗi: ${error.message}`);
        });
}



// Gắn vào window để có thể truy cập ở mọi nơi
window.hamChung = hamChung;
