import axios from "axios";

export default axios.create({
    baseURL: "https://paob-blog.herokuapp.com/api",
    headers: {
        "Content-type": "application/json"
    }
});