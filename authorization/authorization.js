const BASE_URL = "http://www.karlsbad.de/";
const FormData = require('form-data');
const fetch = require('node-fetch');

exports.login = function() {
    const username = process.env.karlsbadUsername;
    const password = process.env.karlsbadPassword;
    let form = new FormData();
    form.append("p_user_id", username);
    form.append("p_user_pwd", password);
    let options = {
        method: "POST",
        body: form,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
    }};

    return fetch(BASE_URL + "/system?action=user_login", options)
        .then((res) => {
            let cookie = res.headers._headers["set-cookie"][0];
            let start = cookie.indexOf("=");
            cookie = cookie.slice(start + 1, cookie.length);
            let end = cookie.indexOf(";");
            cookie = cookie.substring(0, end);
            return cookie;
        })
        .catch((error) => console.error("error", error));
}