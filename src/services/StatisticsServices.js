import http from "../utils/http-common";

function getVisitsPerPublication() {
    return http.get('/statistics/visits-per-publications');
}

function getPublicationsVisitsByUser() {
    return http.get('/statistics/publications-visits-by-users');
}

function getPublicationsReactions() {
    return http.get('/statistics/publications-reactions');
}

const StatisticsServices = Object.freeze({
    getVisitsPerPublication,
    getPublicationsVisitsByUser,
    getPublicationsReactions
});

export default StatisticsServices;