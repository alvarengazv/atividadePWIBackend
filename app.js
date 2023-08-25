const express = require('express')
const app = express()
const mysql = require('mysql2');
const port = 3005
const moment = require('moment');

var connection = mysql.createConnection({
  host     : 'aulascefet.c8tuthxylqic.sa-east-1.rds.amazonaws.com',
  user     : 'aluno',
  password : 'alunoc3f3t',
  database : 'aulas_web'
});

app.get('/', function(req, res, next) {
  res.send("Backend Guilherme Alvarenga de Azevedo Rodando...");
});

app.get('/clientes', function(req, res, next) {
  connection.query(
    'select * from cliente',
    (err, results, fields) => {
      if(err) 
        console.log(err)
      res.send(results)
    }
  );
});

app.get('/clientes/:id_cliente', function(req, res, next) {
  var idCliente = req.params['id_cliente'];
  connection.query(
    `select * from cliente where id_cliente = ${+idCliente}`,
    (err, results, fields) => {
      if(err) 
        console.log(err)
      res.send(results)
    }
  );
});

app.post('/clientes', function(req, res, next) {
  var sql = `insert into cliente(nome, sobrenome,` +
  `email, data_cadastro, salario) values ("Guilherme", "Alvarenga", ` +
  `"gui@gmail.com", "${moment().format("YYYY-MM-DD")}", 5000)`
  connection.query(
    sql, (erro, resultados, fields) => {
      if(erro)
        res.send(erro)
      res.send(resultados)
    }
  )
});

app.post('/clientes_del/:id_cliente', function(req, res, next) {
  var idCliente = req.params['id_cliente'];
  connection.query(
    `delete from cliente where id_cliente = ${+idCliente}`,
    (err, results, fields) => {
      if(err) 
        console.log(err)
      res.send(results)
    }
  );
});

app.patch('/clientes', function(req, res, next) {
  var sql = `
  update cliente set nome = "Rafael", sobrenome = "Azevedo", ` +
  `email = "rafa@gmail.com", salario = 7000 where id_cliente = 1005`
  connection.query(
    sql, (erro, resultados, fields) => {
      if(erro)
        res.send(erro)
      res.send(resultados)
    }
  )
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})