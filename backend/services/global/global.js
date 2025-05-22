const congAPI = 4002;
const congAPI_image = 5000;
const congAPI_taoTranDau = 5001;
const IPv4_Address =  "192.168.110.195";
// const linkCongAPI = "http://localhost:" + congAPI + "/api/";
// ex : http://192.168.1.136:4002/api
// ex : http://localhost:4002/api

// const linkCongAPI = IPv4_Address +":"+ congAPI + "/api/";
// C:\Users\vanti\Desktop\5_2\6A _ NMCN Phần Mềm_ Châu Văn Vân\DO_AN\quan_ly_tran_dau\service

const GlobalStore = {
    // Đặt giá trị vào localStorage
    setUsername(username) {
        localStorage.setItem("global_username", username);
    },

    // Lấy giá trị từ localStorage, mặc định trả về null nếu không có giá trị
    getUsername() {
        const username = localStorage.getItem("global_username");
        return username !== null ? username : null; // Nếu không có giá trị thì trả về null
    },

    getCongAPI() {
        return congAPI;
    },

    getLinkCongAPI() {
        return "http://"+IPv4_Address +":"+ congAPI + "/api/";
    },
    getLinkCongApi_image(){
        // http://
        return "http://"+IPv4_Address +":"+ congAPI_image + "/api/image";
    },
    getLinkCongApi_taoTranDau(){
        return "http://"+IPv4_Address +":"+ congAPI_taoTranDau + "/api_taoTranDau";
    },
// tôi muốn lấy api của phần tạo trận đấu ấy



};
const DoiTuyen = {
    setDoiTuyen_dangChon(doiTuyen) {
        localStorage.setItem("doiTuyen_dangChon", doiTuyen);
    },
    getDoiTuyen_dangChon() {
        const doiTuyen = localStorage.getItem("doiTuyen_dangChon");
        return doiTuyen !== null ? doiTuyen : null; // Nếu không có giá trị thì trả về null
    }
};


// Gắn vào window để có thể truy cập ở mọi nơi
window.GlobalStore = GlobalStore;
window.DoiTuyen = DoiTuyen;
// window.DanhSach = DanhSach;