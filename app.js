const express = require('express')
const app = express()
const port = 3005;
const bodyParser = require('body-parser');
const formData = require('express-form-data');
const cors = require('cors');

corsOptions = {
  origin: "http://127.0.0.1:5501",
  optionsSuccessStatus: 200
}

app.use(formData.parse());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors(corsOptions));
app.use(express.static('uploads'));

// MONTANDO MINHAS ROTAS
require("./routes/clientes")(app)
require("./routes/fornecedores")(app)

app.get('/', function(req, res, next) {
  res.send("Backend Guilherme Alvarenga de Azevedo Rodando...");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})