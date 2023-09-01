const express = require('express')
const app = express()
const mysql = require('mysql2');
const port = 3005
const moment = require('moment');
const bodyParser = require('body-parser');
const formData = require('express-form-data');
const fs = require('fs');

app.use(formData.parse());
app.use(bodyParser.urlencoded({extended: true}));

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

app.get('/clientes_email/:email', function(req, res, next) {
  var email = req.params['email'];
  var sql =  `select * from cliente where email = "${email}"`;
  console.log(sql)
  connection.query(
    sql,
    (err, results, fields) => {
      if(err) 
        console.log(err)
      console.log(results)
      if(results.length > 0)
        res.send({existe: true})
      else 
        res.send({existe: false})
    }
  );
});

app.post('/clientes', function(req, res, next) {
  var nome = req.body.nome;
  var sobrenome = req.body.sobrenome;
  var email = req.body.email;
  var salario = +req.body.salario;

  console.log(req.files)

  var sql = `insert into cliente(nome, sobrenome,` +
  `email, data_cadastro, salario) values ("${nome}", "${sobrenome}", ` +
  `"${email}", "${moment().format("YYYY-MM-DD")}", ${salario})`
  
  connection.query(
    sql, (erro, resultados, fields) => {
      if(erro)
        res.send(erro)

      var caminhoTemp = req.files.avatar.path;
      var type = req.files.avatar.type.split('/');
      var caminhoNovo = `./uploads/clientes/cliente${resultados.insertId}.${type[type.length - 1]}`;

      fs.copyFile(caminhoTemp, caminhoNovo, (err) => {
        console.log(err)
        res.send(resultados)
      });
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

app.patch('/clientes/:id_cliente', function(req, res, next) {
  var nome = req.body.nome;
  var sobrenome = req.body.sobrenome;
  var email = req.body.email;
  var salario = +req.body.salario;
  var idCliente = +req.params.id_cliente;
  var sql = `
  update cliente set nome = "${nome}", sobrenome = "${sobrenome}", ` +
  `email = "${email}", salario = ${salario} where id_cliente = ${idCliente}`
  connection.query(
    sql, (erro, resultados, fields) => {
      if(erro)
        res.send(erro)
      res.send(resultados)
    }
  )
});


app.get('/fornecedores', function (req, res, next) {
  connection.query(
      'select * from fornecedor',
      (err, results, fields) => {
          if (err)
              console.log(err)
          res.send(results)
      }
  );
});

app.get('/fornecedores/:id_fornecedor', function (req, res, next) {
  var idFornecedor = req.params['id_fornecedor'];
  connection.query(
      `select * from fornecedor where id_fornecedor = ${+idFornecedor}`,
      (err, results, fields) => {
          if (err)
              console.log(err)
          res.send(results)
      }
  );
});

app.post('/fornecedores', function (req, res, next) {
  var razao = req.body.razao;

  var cpf_cnpj = req.body.cpf_cnpj;
  var contato = req.body.contato;
  var logradouro = req.body.logradouro;
  var cidade = req.body.cidade;
  var uf = req.body.uf;
  if(razao.length <= 100 && razao != undefined 
          && cpf_cnpj.length <= 45 && cpf_cnpj != undefined 
          && contato.length <= 45 && contato != undefined 
          && uf.length <= 2 && cidade.length <= 45 
          && logradouro.length <= 100){
      
      var sql = `insert into fornecedor(razao, cpf_cnpj,` +
      `contato, logradouro, cidade, uf) values ("${razao}", "${cpf_cnpj}", ` +
      `"${contato}", "${logradouro}", "${cidade}", "${uf}")`

      connection.query(
          sql, (erro, resultados, fields) => {
              if (erro)
                  res.send(erro)

              var caminhoTemp = req.files.logomarca.path;
              var type = req.files.logomarca.type.split('/');
              var caminhoNovo = `./uploads/fornecedores/F${resultados.insertId}.${type[type.length - 1]}`;

              fs.copyFile(caminhoTemp, caminhoNovo, (err) => {
                  console.log(err)
                  res.send(resultados)
              });
          }
      )
  } else {
      res.send("Preencha os campos corretamente!");
  }
  
});

app.post('/fornecedores_del/:id_fornecedor', function (req, res, next) {
  var idFornecedor = req.params['id_fornecedor'];
  connection.query(
      `delete from fornecedor where id_fornecedor = ${+idFornecedor}`,
      (err, results, fields) => {
          if (err)
              console.log(err)
          res.send(results)
      }
  );
});

app.post('/fornecedores/:id_fornecedor', function (req, res, next) {
  var razao = req.body.razao;
  var cpf_cnpj = req.body.cpf_cnpj;
  var contato = req.body.contato;
  var logradouro = req.body.logradouro;
  var cidade = req.body.cidade;
  var uf = req.body.uf;
  var idFornecedor = req.params['id_fornecedor'];

  if(razao.length <= 100 && razao != undefined 
    && cpf_cnpj.length <= 45 && cpf_cnpj != undefined 
    && contato.length <= 45 && contato != undefined 
    && uf.length <= 2 && cidade.length <= 45 
    && logradouro.length <= 100){

      var sql = `
      update fornecedor set razao = "${razao}", cpf_cnpj = "${cpf_cnpj}", ` +
          `contato = "${contato}", logradouro = "${logradouro}", cidade = "${cidade}", uf = "${uf}" where id_fornecedor = ${idFornecedor}`
      connection.query(
          sql, (erro, resultados, fields) => {
              if (erro)
                  res.send(erro)

              var caminhoTemp = req.files.logomarca.path;
              var type = req.files.logomarca.type.split('/');
              var caminhoNovo = `./uploads/fornecedores/F${idFornecedor}.${type[type.length - 1]}`;

              fs.copyFile(caminhoTemp, caminhoNovo, (err) => {
                  console.log(err)
                  res.send(resultados)
              });
          }
      )
    } else {
      res.send("Preencha os campos corretamente!");
    }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})