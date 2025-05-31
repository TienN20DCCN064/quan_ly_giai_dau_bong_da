
const hamChiTiet = {
    //==============Quan ly============================
    async layDoiBongTheoQL(idQuanLy) {
        return await layDoiBongTheoQL(idQuanLy);
    },
    async laycauThuTheoQuanLy(idQuanLy) {
        return await laycauThuTheoQuanLy(idQuanLy);
    },
    async laycauThuTheoDoiBong(doiBongID) {
        return await laycauThuTheoDoiBong(doiBongID);
    },
    async layDsTranDau(maQL, ma_doi1, ma_doi2, ma_giai_dau, ma_vong_dau, ma_san, date_from, date_to) {
        return await layDsTranDau(maQL, ma_doi1, ma_doi2, ma_giai_dau, ma_vong_dau, ma_san, date_from, date_to);
    },
    //===================================Dang nhap================
    async dangNhap(data) {
        return await dangNhap(data);
    }
};

//==========================Quản lý
// lấy danh sách cầu thủ theo đội bóng
async function laycauThuTheoDoiBong(doiBongID) {
    //doiBongID =  localStorage.getItem("ma_doi_bong");
    if (!doiBongID) {
        alert('Thiếu ID đội bóng');
        return;
    }

    try {
        const response = await fetch(GlobalStore.getLinkCongAPI() + 'cau_thu/doibong?ma_doi_bong=' + doiBongID);
        return await response.json();
    } catch (error) {
        console.error('Lỗi khi lấy danh sách đội bóng theo quản lý:', error);
        return [];
    }
}

// lấy danh sách cầu thủ theo quản lý
async function laycauThuTheoQuanLy(maQL) {

    if (!maQL) {
        alert('Thiếu ID quản lý');
        return;
    }
    
    const url = GlobalStore.getLinkCongAPI() + 'cauthu/quanly?ma_ql_doi_bong=' + maQL;
    //console.log(url);
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('Lỗi khi lấy danh sách đội bóng theo quản lý:', error);
        return [];
    }
}

// lay danh sách yêu cầu đăng ký qua quản lý
async function layDonDangKyTheoQuanLy(maQL) {

    if (!maQL) {
        alert('Thiếu ID quản lý');
        return;
    }
    
    const url = GlobalStore.getLinkCongAPI() + 'dondangky/quanly?ma_ql_doi_bong=' + maQL;
    //console.log(url)
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('Lỗi khi lấy danh sách đơn đăng ký theo quản lý:', error);
        return [];
    }
}



// lấy danh sách đội bóng theo ID quản lý
async function layDoiBongTheoQL(maQL) {

    //API mới: filter theo user name:
    if (!maQL) {
        alert('Thiếu ID quản lý');
        return;
    }
    

    const url = GlobalStore.getLinkCongAPI() + 'doi_bong/quanly?ma_ql_doi_bong=' + maQL;
    //console.log(url);
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('Lỗi khi lấy danh sách đội bóng theo quản lý:', error);
        return [];
    }
}


async function layDsTranDau(maQL, ma_doi1, ma_doi2, ma_giai_dau, ma_vong_dau, ma_san, date_from, date_to) {
    const queryParams = new URLSearchParams();

    if (maQL) queryParams.append("maQL", maQL);
    if (ma_doi1) queryParams.append("ma_doi_1", ma_doi1);
    if (ma_doi2) queryParams.append("ma_doi_2", ma_doi2);
    if (ma_giai_dau) queryParams.append("ma_giai_dau", ma_giai_dau);
    if (ma_vong_dau) queryParams.append("ma_vong_dau", ma_vong_dau);
    if (ma_san) queryParams.append("san_van_dong", ma_san);
    if (date_from) queryParams.append("tu_ngay", date_from);
    if (date_to) queryParams.append("den_ngay", date_to);
    
    const url = GlobalStore.getLinkCongAPI() + 'trandau/quanly?' + queryParams;
    console.log("URL: " + url);
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('Lỗi khi lấy danh sách đội bóng theo quản lý:', error);
        return [];
    }
}

//===============================================Dang nhap

async function dangNhap(data) {

    const url = GlobalStore.getLinkCongAPI() + 'dangnhap';
    console.log(url);
    try {
        const response = await fetch(url,{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error('Lỗi khi lấy danh sách đội bóng theo quản lý:', error);
        return [];
    } 
}

async function getThongtinUser(data) {

    const url = GlobalStore.getLinkCongAPI() + 'get_user?user_name=' + data;
    try {
        const response = await fetch(url,{
            method: "Get",
            headers: { "Content-Type": "application/json" }            
        });
        return await response.json();
    } catch (error) {
        console.error('Lỗi khi lấy thông tin user theo username:', error);
        return [];
    }
}



// Gắn vào window để có thể truy cập ở mọi nơi
window.hamChiTiet = hamChiTiet;