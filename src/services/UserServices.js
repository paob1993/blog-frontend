import http from "../utils/http-common";

function login(data) {
    return http.post("/auth/login", data);
}

function register(data) {
    return http.post("/auth/signup", data);
}

function logout() {
    return http.get("/auth/logout", {
        headers: {
            "Content-type": "application/json",
            Authorization: 'Bearer ' + localStorage.getItem("token")
        }
    });
}

const UserServices = Object.freeze({
    login,
    register,
    logout
});

export default UserServices;