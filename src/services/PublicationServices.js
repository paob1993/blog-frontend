import http from "../utils/http-common";

function getAll(page) {
    return http.get("/publications?page=" + page);
}

function get(id) {
    return http.get(`/publications/${id}`);
}

function create(data) {
    return http.post("/publications", data, {
        headers: {
            "Content-type": "application/json",
            Authorization: 'Bearer ' + localStorage.getItem("token")
        }
    });
}

function update(id, data) {
    return http.put(`/publication/${id}`, data, {
        headers: {
            "Content-type": "application/json",
            Authorization: 'Bearer ' + localStorage.getItem("token")
        }
    });
}

function deletePublication(id) {
    return http.delete(`/publications/${id}`, {
        headers: {
            "Content-type": "application/json",
            Authorization: 'Bearer ' + localStorage.getItem("token")
        }
    });
}

const PublicationServices = Object.freeze({
    getAll,
    get,
    create,
    update,
    delete: deletePublication
});

export default PublicationServices;