const congAPI = 4002;
const IPv4_Address =  "192.168.1.46";
// const linkCongAPI = "http://localhost:" + congAPI + "/api/";
// ex : http://192.168.1.136:4002/api
// ex : http://localhost:4002/api

// const linkCongAPI = IPv4_Address +":"+ congAPI + "/api/";
const linkCongAPI = "http://"+IPv4_Address +":"+ congAPI + "/api/";

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
        return linkCongAPI;
    },
    getLinkCongApi_image(){
        return "http://"+IPv4_Address +":"+ 5000 + "/api/image";
    }


};


// Gắn vào window để có thể truy cập ở mọi nơi
window.GlobalStore = GlobalStore;
// window.DanhSach = DanhSach;