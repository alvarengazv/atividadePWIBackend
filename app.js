const express = require('express')
const app = express()
const port = 3005;
const bodyParser = require('body-parser');
const formData = require('express-form-data');

app.use(formData.parse());
app.use(bodyParser.urlencoded({extended: true}));

// MONTANDO MINHAS ROTAS
require("./routes/clientes")(app)
require("./routes/fornecedores")(app)

app.get('/', function(req, res, next) {
  res.send("Backend Guilherme Alvarenga de Azevedo Rodando...");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})