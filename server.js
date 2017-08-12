const Authorization = require("./authorization/authorization");
const routes = require("./routes");

const express = require("express");

const app = express();

routes(app)
app.listen(3000);

Authorization.login().
    then((session) => console.log(session));