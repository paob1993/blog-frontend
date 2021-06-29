import http from "../utils/http-common";

function addVisit(data) {
    return http.post("/interactions/add-visit", data, {
        headers: {
            "Content-type": "application/json",
            Authorization: 'Bearer ' + localStorage.getItem("token")
        }
    });
}

function updateLike(data) {
    return http.post("/interactions/update-like", data, {
        headers: {
            "Content-type": "application/json",
            Authorization: 'Bearer ' + localStorage.getItem("token")
        }
    });
}


const InterationServices = Object.freeze({
    addVisit,
    updateLike
});

export default InterationServices;