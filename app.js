const express = require('express')
const app = express()
const mysql = require('mysql2');
const port = 3005

var connection = mysql.createConnection({
  host     : 'aulascefet.c8tuthxylqic.sa-east-1.rds.amazonaws.com',
  user     : 'aluno',
  password : 'alunoc3f3t',
  database : 'aulas_web'
});

app.get('/', function(req, res, next) {
  res.send("Backend Guilherme Alvarenga de Azevedo Rodando...");
});

app.get('/cliente', function(req, res, next) {
  connection.query(
    'select * from cliente',
    (err, results, fields) => {
      if(err) console.log(err)
      res.send(results)
    }
  );
});

app.get('/cliente/:id_cliente?', function(req, res, next) {
  var idCliente = req.params['id_cliente'];
  connection.query(
    `select * from cliente WHERE id_cliente = ${+idCliente}`,
    (err, results, fields) => {
      if(err) console.log(err)
      res.send(results)
    }
  );
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})