const BASE_URL = "http://www.karlsbad.de/";
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const request = require('request-promise');

let _internalCookie;

exports.getCookie = function() {
    return _internalCookie;
}

exports.login = function(username, password) {
    if (!username || !password) {
        return Promise.reject('Username/password not set');
    }
    return fetch(BASE_URL)
        .then(res => res.headers._headers["set-cookie"][0])
        .then(cookie => {
            let end = cookie.indexOf(";");
            return cookie.substring(0, end);
        })
        .then((cookie) => {
           return request.post({
                url: BASE_URL + '/system?action=user_login',
                form: {'p_user_id': username, 'p_user_pwd': password},
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Cookie": cookie
                }
            });
       })
       .then(res => {
           throw {
            error: 'Statuscode: 20X',
            message: res
            };
        })
       .catch(res => {
            if (res.statusCode === 302) {
                _internalCookie = res.options.headers.Cookie;
                return _internalCookie;
            } else {
                console.error(`Error: ${res.error} ${res.message}`);
                throw 'Login was not successful';
            }
        });
}