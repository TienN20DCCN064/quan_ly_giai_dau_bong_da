
const dayList = document.getElementById('day-list');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const loai_GiaiDau_all = "ALL_giaiDau_today";
const spanTieuDe = document.getElementById("tieuDeLichThi");

const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
const matchListElement = document.getElementById("lichThiDauHomNay_list");
const range = 10;
let offset = -Math.floor(range / 2); // ✅ giờ mới được dùng range


let selectedDateElement = null;


const urlParams = new URLSearchParams(window.location.search);
let ngay_xem_param = urlParams.get('ngay_xem');
let ma_giai_dau_param = urlParams.get('ma_giai_dau'); // 123

function isResponsive() {
    return window.innerWidth <= 768;
}

// window.addEventListener('resize', () => {
//     if (isResponsive()) {
//         console.log("Chuyển sang chế độ responsive");

//     } else {
//         console.log("Chuyển sang chế độ desktop");
//     }
// });

document.addEventListener("DOMContentLoaded", async function () {


    if (ngay_xem_param === null && ma_giai_dau_param === null) {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        const url = `/frontend/view/nguoihammo/home.html?ngay_xem=${today}&ma_giai_dau=${loai_GiaiDau_all}`;
        window.location.href = url;
    }

    if (ngay_xem_param) {
        const today = new Date();
        const selected = new Date(ngay_xem_param);

        // Tính số ngày giữa hôm nay và ngày được chọn
        const diffTime = selected - today;
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        // Tính offset sao cho ngày được chọn nằm giữa
        offset = diffDays - Math.floor(range / 2);
        let isCurrentlyResponsive = isResponsive();

        window.addEventListener('resize', () => {
            const nowResponsive = isResponsive();

            if (nowResponsive && !isCurrentlyResponsive) {
                console.log("Chuyển sang chế độ responsive");
                offset = offset + 4;
                renderDays(); // Cập nhật hiển thị
            }

            if (!nowResponsive && isCurrentlyResponsive) {
                console.log("Chuyển sang chế độ desktop");
                // offset = offset - 4;
                renderDays(); // Cập nhật hiển thị
            }

            isCurrentlyResponsive = nowResponsive;
        });

    }
    // Khởi tạo lịch ban đầu
    renderDays();

    // lichThiDauHomNay_list();
    // Lấy tham số từ URL hiện tại

    // nếu không thì lấy bình thường 
    if (urlParams.size === 0) {
        ma_giai_dau_param = loai_GiaiDau_all;
    }
    await view_danhSach_tranDau_vs_giaiDau(ngay_xem_param, ma_giai_dau_param);


    // Xử lý nút next/prev để chuyển ngày
    prevBtn.addEventListener('click', () => {
        offset -= 1;
        renderDays();
    });

    nextBtn.addEventListener('click', () => {
        offset += 1;
        renderDays();
    });



    // Sự kiện cho các mục Bảng xếp hạng và Kết quả thi đấu
    document.getElementById("ranking").addEventListener("click", function () {
        console.log("Bạn đã chọn Bảng xếp hạng");
    });

    document.getElementById("result").addEventListener("click", function () {
        console.log("Bạn đã chọn Kết quả thi đấu");
    });

    // tô màu ngày click vào 
    const params = new URLSearchParams(window.location.search);
    const ngayXem = params.get('ngay_xem');

    if (ngayXem) {
        const dateInput = document.getElementById('ngayDienRa');
        dateInput.value = ngayXem;

        // Optional: Tô màu ô lịch đã chọn (tuỳ style, mặc định browser có highlight rồi)
        dateInput.classList.add('selected-date');
    }




});



document.getElementById('lich').addEventListener('click', function () {
    const calendarContainer = document.getElementById('calendarContainer');
    const dateInput = document.getElementById('ngayDienRa');

    // Nếu đang ẩn thì hiển thị trước
    const isHidden = calendarContainer.classList.contains('hidden');

    if (isHidden) {
        calendarContainer.classList.remove('hidden');

        // Đợi DOM cập nhật xong rồi mới gọi showPicker
        requestAnimationFrame(() => {
            if (typeof dateInput.showPicker === 'function') {
                dateInput.showPicker();
            } else {
                dateInput.focus();
            }
        });

        console.log("📅 Lịch đang hiển thị");

    } else {
        calendarContainer.classList.add('hidden');
        console.log("📅 Lịch đang ẩn");
    }
});
// click vào ngày trong lịch
document.getElementById('ngayDienRa').addEventListener('change', function (e) {
    const selectedDate = e.target.value;
    console.log("📅 Ngày được chọn trong lịch là:", selectedDate);

    const maGiai = new URLSearchParams(window.location.search).get('ma_giai_dau') || "ALL_giaiDau_today";
    window.location.href = `/frontend/view/nguoihammo/home.html?ngay_xem=${selectedDate}&ma_giai_dau=${maGiai}`;
});



async function view_danhSach_tranDau_vs_giaiDau(ngay_xem_param, ma_giai_dau_param) {
    console.log("ma_giai_dau_param : ", ma_giai_dau_param);
    console.log("ngay_xem : ", ngay_xem_param);
    spanTieuDe.textContent = `Lịch thi ngày ${ngay_xem_param}`;

    // hiện thị danh sách giải
    await view_giaiDau_theoNgay(ngay_xem_param);

    // hiện thị danh sách trận đấu


    ///////////////////    // await view_tranDau_motGiai("schedule"); ////////////////////////////////////////////////////

    // test
    // await danhSach_tranDau_thuoc_giaiDau_TheoNgay(ngay_xem_param, ma_giai_dau_param);

    console.log(ma_giai_dau_param);
    if (ma_giai_dau_param === loai_GiaiDau_all) {
        await view_tranDau_nhieuGiai("schedule");
    }
    else {
        await view_tranDau_motGiai("schedule");
    }

    // if (ma_giai_dau_param === loai_GiaiDau_all) {
    //     await view_tranDau("schedule", [ma_giai_dau_param]);
    // }
    // else {
    //     // await view_tranDau_motGiai("schedule");
    //     const maGiaiDauList = await danhSach_giaiDau_TheoNgay(ngay_xem_param);
    //     await view_tranDau("schedule", maGiaiDauList);
    // }

}



//ok
// Hàm render ngày
function renderDays() {
    dayList.innerHTML = ''; // Xóa nội dung cũ

    const today = new Date();
    for (let i = offset; i < offset + range; i++) {
        const date = new Date();
        date.setDate(today.getDate() + i);

        const fullDate = date.toISOString().split('T')[0];
        const isSelected = fullDate === ngay_xem_param; // So sánh với param ngày

        const isToday = i === 0;
        const dayName = isToday ? 'Hôm nay' : days[date.getDay()];
        const dayNumber = date.getDate();

        // Tạo phần tử cho ngày
        const dayItem = document.createElement('div');
        dayItem.className = `cursor-pointer px-2 py-1 rounded-lg hover:bg-gray-100 
            ${isToday ? 'text-orange-500 font-bold' : ''} 
            ${isSelected ? 'bg-orange-100 ring ring-orange-400' : ''}`;
        dayItem.setAttribute('data-date', fullDate);
        dayItem.innerHTML = `
            <div>${dayName}</div>
            <div class="font-bold text-gray-700 text-sm">${dayNumber}</div>
        `;

        // Nếu là ngày được chọn, gán vào biến `selectedDateElement`
        if (isSelected) {
            selectedDateElement = dayItem;
        }

        // Sự kiện click vào ngày
        dayItem.addEventListener('click', function () {
            if (selectedDateElement) {
                selectedDateElement.classList.remove('bg-orange-100', 'ring', 'ring-orange-400');
            }
            dayItem.classList.add('bg-orange-100', 'ring', 'ring-orange-400');
            selectedDateElement = dayItem;

            console.log('Ngày được chọn:', fullDate);
            const url = `/frontend/view/nguoihammo/home.html?ngay_xem=${fullDate}&ma_giai_dau=${loai_GiaiDau_all}`;
            window.location.href = url;
        });

        dayList.appendChild(dayItem);
    }
}

// trường họp có mã giải đấu trước đã
async function ham_danhSach_tranDau_thuoc_giaiDau_TheoNgay(ngay, maGiaiDau) {
    // console.log(ngay);
    // console.log(maGiaiDau);
    const data_tranDau = await hamChung.layDanhSach("tran_dau");
    const tranDau_theoNgay = data_tranDau.filter(tran => tran.ngay_dien_ra === ngay);
    //   console.log(tranDau_theoNgay);
    const tranDau_thuoc_giaiDau_theoNgay = tranDau_theoNgay.filter(tranD => tranD.ma_giai_dau === maGiaiDau);
    if (maGiaiDau === loai_GiaiDau_all) {
        return tranDau_theoNgay;
    }
    //  console.log(tranDau_thuoc_giaiDau_theoNgay);
    return tranDau_thuoc_giaiDau_theoNgay;
}

// ok
// Hàm lọc danh sách giải đấu theo ngày truyền vào
async function danhSach_giaiDau_TheoNgay(ngay) {
    const data_tranDau = await hamChung.layDanhSach("tran_dau");
    const tranDau_theoNgay = data_tranDau.filter(tran => tran.ngay_dien_ra === ngay);
    const maGiaiDauTheoNgay = tranDau_theoNgay.map(tran => tran.ma_giai_dau);
    const maGiaiDauDuyNhat = [...new Set(maGiaiDauTheoNgay)];
    return maGiaiDauDuyNhat;
}


// ok
async function view_giaiDau_theoNgay(ngay) {
    // ok
    console.log(ngay);
    const maGiaiDauDuyNhat_theoNgay = await danhSach_giaiDau_TheoNgay(ngay);
    console.log(maGiaiDauDuyNhat_theoNgay);

    maGiaiDauDuyNhat_theoNgay.forEach(async maGiaiDau => {
        const giaiDau = await hamChung.layThongTinTheo_ID("giai_dau", maGiaiDau);

        // Tạo phần tử span cho mỗi giải đấu
        const span = document.createElement("span");
        span.textContent = giaiDau.ten_giai_dau; // In ra tên giải đấu
        span.classList.add("cursor-pointer", "p-2", "block", "text-gray-800", "hover:bg-gray-200", "rounded");

        // Thêm phần tử span vào danh sách
        matchListElement.appendChild(span);

        // Thêm sự kiện click cho mỗi lựa chọn
        span.addEventListener("click", () => {

            console.log(`Đã chọn giải đấu: ${giaiDau.ten_giai_dau}`);
            // const url = `/frontend/view/nguoihammo/home.html?ma_giai_dau=${giaiDau.ma_giai_dau}`;
            const url = `/frontend/view/nguoihammo/home.html?ngay_xem=${ngay}&ma_giai_dau=${giaiDau.ma_giai_dau}`;

            console.log(url);
            window.location.href = url; // Chuyển trang
        });
    });

    // Thêm sự kiện click vào phần tử span của tiêu đề
    const lichThiDauHomNayTitle = document.querySelector("#lichThiDauHomNay_list .text-green-600");
    lichThiDauHomNayTitle.addEventListener("click", () => {
        console.log("Đã chọn Lịch thi đấu hôm nay");
        const url = `/frontend/view/nguoihammo/home.html?ngay_xem=${ngay}&ma_giai_dau=${loai_GiaiDau_all}`;
        window.location.href = url; // Chuyển trang
        console.log(url);
        // Xử lý khi người dùng click vào tiêu đề "Lịch thi đấu hôm nay"
    });


}



async function view_tranDau_motGiai(containerId) {
    const container = document.getElementById(containerId);
    // if (!container || !scheduleData || scheduleData.length === 0) return;

    container.innerHTML = ""; // Xóa nội dung cũ

    // const giai = scheduleData[0]; // Chỉ lấy giải đầu tiên
    const dataDDanhSach_tranDau_thuoc_giaiDau_TheoNgay = await ham_danhSach_tranDau_thuoc_giaiDau_TheoNgay(ngay_xem_param, ma_giai_dau_param);
    const data = dataDDanhSach_tranDau_thuoc_giaiDau_TheoNgay;
    console.log(ngay_xem_param + " " + ma_giai_dau_param);

    console.log(data);
    // Hiển thị thông tin giải đấu
    const sectionHTML = `
        <div class="bg-gray-200 text-center py-2 mb-4 text-sm text-gray-700 font-semibold">
            Lịch thi đấu
            <span class="font-bold">${data.maGiaiDau}</span> -
            <span class="text-gray-500">${data.maGiaiDau}</span>
        </div>
    `;
    container.insertAdjacentHTML("beforeend", sectionHTML);

    // Hiển thị các trận đấu trong giải
    data.forEach(async match => {
        const tenDoi1 = await get_tenDoiBong(match.ma_doi_1);
        const tenDoi2 = await get_tenDoiBong(match.ma_doi_2);

        const gio = match.gio_dien_ra.slice(0, 5); // Lấy "HH:MM" từ "HH:MM:SS"
        const [nam, thang, ngay] = match.ngay_dien_ra.split("-");
        const string_gioDienRa = `${gio} ${parseInt(ngay)}-${parseInt(thang)}`;
        //  const string_gioDienRa = string_gioDienRa(match.gio_dien_ra, match.ngay_dien_ra);
        console.log("ma tran dau : " + match.ma_tran_dau);


        const scoreString = await stringKq_tranDau(match.ma_tran_dau, match.ma_doi_1, match.ma_doi_2);
        // console.log(await soBanThangCuaDoiTrongTranDau(match.ma_tran_dau, match.ma_doi_1));
        // console.log(await soBanThangCuaDoiTrongTranDau(match.ma_tran_dau, match.ma_doi_2));
        // console.log(tenDoi1);
        const matchHTML = `
            <div class="flex items-center justify-between border-b border-gray-200 py-3">
                <div class="font-bold text-sm w-24">${string_gioDienRa}</div>
                <div class="flex items-center space-x-2 flex-1 justify-center text-sm">
                
                    <div>${match.ma_doi_1}</div>
                    <div>${tenDoi1}</div>
                    <img src="${match.logo1}" class="w-6 h-6" />
                    
                    <div class="border border-green-600 rounded-full text-green-600 font-semibold px-3 py-0.5">${scoreString}</div>
                    
                    <img src="${match.logo2}" class="w-6 h-6" />
                    <div>${match.ma_doi_2}</div>
                    <div>${tenDoi2}</div>

                    
                </div>
            </div>
        `;
        container.insertAdjacentHTML("beforeend", matchHTML);
    });
}

async function view_tranDau_motGiai(containerId) {
    const container = document.getElementById(containerId);
    // if (!container || !scheduleData || scheduleData.length === 0) return;

    container.innerHTML = ""; // Xóa nội dung cũ

    // const giai = scheduleData[0]; // Chỉ lấy giải đầu tiên
    const dataDDanhSach_tranDau_thuoc_giaiDau_TheoNgay = await ham_danhSach_tranDau_thuoc_giaiDau_TheoNgay(ngay_xem_param, ma_giai_dau_param);
    const data = dataDDanhSach_tranDau_thuoc_giaiDau_TheoNgay;
    let maGiaiDau = "";
    let tenGiaiDau = "";
    console.log(ngay_xem_param + " " + ma_giai_dau_param);

    console.log(data);
    if (data != null) {
        const dataGiaiDau = await hamChung.layThongTinTheo_ID("giai_dau", data[0].ma_giai_dau);
        console.log(dataGiaiDau);
        maGiaiDau = dataGiaiDau.ma_giai_dau;
        tenGiaiDau = dataGiaiDau.ten_giai_dau;
    }

    // Hiển thị thông tin giải đấu
    const sectionHTML = `
        <div class="bg-gray-200 text-center py-2 mb-4 text-sm text-gray-700 font-semibold">
            Lịch thi đấu
            <span class="font-bold">${maGiaiDau}</span> -
            <span class="text-gray-500">${tenGiaiDau}</span>
        </div>
    `;
    container.insertAdjacentHTML("beforeend", sectionHTML);

    // Hiển thị các trận đấu trong giải
    data.forEach(async match => {
        const tenDoi1 = await get_tenDoiBong(match.ma_doi_1);
        const tenDoi2 = await get_tenDoiBong(match.ma_doi_2);

        const gio = match.gio_dien_ra.slice(0, 5); // Lấy "HH:MM" từ "HH:MM:SS"
        const [nam, thang, ngay] = match.ngay_dien_ra.split("-");
        const string_gioDienRa = `${gio} ${parseInt(ngay)}-${parseInt(thang)}`;
        //  const string_gioDienRa = string_gioDienRa(match.gio_dien_ra, match.ngay_dien_ra);
        console.log("ma tran dau : " + match.ma_tran_dau);


        const scoreString = await stringKq_tranDau(match.ma_tran_dau, match.ma_doi_1, match.ma_doi_2);
        // console.log(await soBanThangCuaDoiTrongTranDau(match.ma_tran_dau, match.ma_doi_1));
        // console.log(await soBanThangCuaDoiTrongTranDau(match.ma_tran_dau, match.ma_doi_2));
        // console.log(tenDoi1);
        let id_hinh_anh_1 = await hamChung.layThongTinTheo_ID("doi_bong", match.ma_doi_1);
        let id_hinh_anh_2 = await hamChung.layThongTinTheo_ID("doi_bong", match.ma_doi_2);
        // let hinh_anh_1 = await hamChung.getImage(match.logo1);
        // let hinh_anh_2 = await hamChung.getImage(match.logo2);
        console.log(id_hinh_anh_1);
        console.log(id_hinh_anh_2);
        let hinh_anh_1 = await hamChung.getImage(id_hinh_anh_1.logo);
        let hinh_anh_2 = await hamChung.getImage(id_hinh_anh_2.logo);



        const matchHTML = `
            <div class="flex items-center justify-between border-b border-gray-200 py-3">
                <div class="font-bold text-sm w-24">${string_gioDienRa}</div>
                <div class="flex items-center space-x-2 flex-1 justify-center text-sm">
                
                    <div>${match.ma_doi_1}</div>
                    <div>${tenDoi1}</div>
                    <img src="${hinh_anh_1}" class="w-6 h-6" />
                    
                    <div class="border border-green-600 rounded-full text-green-600 font-semibold px-3 py-0.5">${scoreString}</div>
                    
                    <img src="${hinh_anh_2}" class="w-6 h-6" />
                    <div>${match.ma_doi_2}</div>
                    <div>${tenDoi2}</div>

                    
                </div>
            </div>
        `;
        container.insertAdjacentHTML("beforeend", matchHTML);
    });
}


async function view_tranDau_nhieuGiai(containerId) {
    const container = document.getElementById(containerId);
    const maGiaiDauDuyNhat_theoNgay = await danhSach_giaiDau_TheoNgay(ngay_xem_param);

    container.innerHTML = ""; // Xóa nội dung cũ

    for (const ma_giai_dau_param of maGiaiDauDuyNhat_theoNgay) {
        const data = await ham_danhSach_tranDau_thuoc_giaiDau_TheoNgay(ngay_xem_param, ma_giai_dau_param);

        if (!data || data.length === 0) continue;

        // Hiển thị tiêu đề giải đấu
        const dataGiaiDau = await hamChung.layThongTinTheo_ID("giai_dau", ma_giai_dau_param);
        const sectionHTML = `
            <div class="bg-gray-200 text-center py-2 mb-4 text-sm text-gray-700 font-semibold">
                Lịch thi đấu - Giải: <span class="font-bold">${dataGiaiDau.ten_giai_dau}</span>
            </div>
        `;
        container.insertAdjacentHTML("beforeend", sectionHTML);

        for (const match of data) {
            const tenDoi1 = await get_tenDoiBong(match.ma_doi_1);
            const tenDoi2 = await get_tenDoiBong(match.ma_doi_2);

            const gio = match.gio_dien_ra.slice(0, 5); // Lấy "HH:MM"
            const [nam, thang, ngay] = match.ngay_dien_ra.split("-");
            const string_gioDienRa = `${gio} ${parseInt(ngay)}-${parseInt(thang)}`;

            const scoreString = await stringKq_tranDau(match.ma_tran_dau, match.ma_doi_1, match.ma_doi_2);
            let id_hinh_anh_1 = await hamChung.layThongTinTheo_ID("doi_bong", match.ma_doi_1);
            let id_hinh_anh_2 = await hamChung.layThongTinTheo_ID("doi_bong", match.ma_doi_2);
            // let hinh_anh_1 = await hamChung.getImage(match.logo1);
            // let hinh_anh_2 = await hamChung.getImage(match.logo2);
            console.log(id_hinh_anh_1);
            console.log(id_hinh_anh_2);
            let hinh_anh_1 = await hamChung.getImage(id_hinh_anh_1.logo);
            let hinh_anh_2 = await hamChung.getImage(id_hinh_anh_2.logo);
            const matchHTML = `
                <div class="flex items-center justify-between border-b border-gray-200 py-3">
                    <div class="font-bold text-sm w-24">${string_gioDienRa}</div>
                    <div class="flex items-center space-x-2 flex-1 justify-center text-sm">
                       
                        <div>${tenDoi1}</div>
                        <img src="${hinh_anh_1}" class="w-6 h-6" />
                        <div class="border border-green-600 rounded-full text-green-600 font-semibold px-3 py-0.5">${scoreString}</div>
                        <img src="${hinh_anh_2}" class="w-6 h-6" />
                  
                        <div>${tenDoi2}</div>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML("beforeend", matchHTML);
        }
    }
}

async function stringKq_tranDau(maTranDau, maDoi1, maDoi2) {
    const data = await hamChung.layThongTinTheo_ID("ket_qua_tran_dau", maTranDau);
    let stingKq_tranDau = "---";
    if (data === null) {
        return stingKq_tranDau;
    }
    const dataDoiThang = await hamChung.layThongTinTheo_ID("doi_bong", data.ma_doi_thang)
    let soban1 = data.so_ban_doi_1;
    let soban2 = data.so_ban_doi_2;
    let sobanLonNhat = Math.max(soban1, soban2);
    let sobanBeNhat = Math.min(soban1, soban2);

    // số bàn lớn nhất
    // in  ra cái đáu đàu tiên
    console.log(data.ma_doi_thang + " " + maDoi1);
    if (data.ma_doi_thang === maDoi1) {
        stingKq_tranDau = "" + sobanLonNhat + " - " + sobanBeNhat + " - " + dataDoiThang.ten_doi_bong;
    }
    else {
        stingKq_tranDau = "" + sobanBeNhat + " - " + sobanLonNhat + " - " + dataDoiThang.ten_doi_bong;
    }
    // in ra cái thứ 2
    return stingKq_tranDau;
}
async function get_tenDoiBong(maDoiBong) {
    const data = await hamChung.layThongTinTheo_ID("doi_bong", maDoiBong);
    // console.log(data);
    return data.ten_doi_bong;
}

