const express = require("express");
const app = express();
const user = require("./controller/endUser");
const admin = require("./controller/admin");


app.use(user);
app.use(admin);

app.listen(8000 ,()=>{console.log("port is running on 8000")});