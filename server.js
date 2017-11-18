const Authorization = require("./authorization/authorization");
const routes = require("./routes");

const express = require("express");

const app = express();

routes(app)
app.listen(3000);

const username = process.env.karlsbadUsername;
const password = process.env.karlsbadPassword;

Authorization.login(username, password)
    .then((session) => console.log('Authorized'))
    .then(() => {
        console.log(Authorization.getCookie());
    })
    .catch(error => console.error(error));
