const express = require('express')
const mongo = require('./db/mongoose');
const cors = require('cors');
const app = express();
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')
// const bodyparser = require('body-parser');
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))
const router = require("./router/routes")
app.use(cors());
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use("/",router);
module.exports = app