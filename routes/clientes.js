const express = require('express');
const fs = require('fs');
const moment = require('moment');
const db = require("../config/database");
const { mkdirp } = require('mkdirp');

module.exports = (app) => {
    const rotas = express.Router();

    app.use("/", rotas);

    rotas.get("/cliente", (req, res) => {
        res.send("NOVA ROTA PARA CLIENTES");
    })

    rotas.get('/clientes_all', function (req, res, next) {
        db.query(
            'select * from cliente',
            (err, results, fields) => {
                if (err)
                    console.log(err)
                res.send(results)
            }
        );
    });

    rotas.get('/clientes_byId/:id_cliente', function (req, res, next) {
        console.log("TESTE:" + req.params['id_cliente']);
        var idCliente = req.params['id_cliente'];
        db.query(
            `select * from cliente where id_cliente = ${+idCliente}`,
            (err, results, fields) => {
                if (err)
                    console.log(err)
                console.log(results)
                var resultado = {};
                resultado.id_cliente = results[0].id_cliente;
                resultado.nome = results[0].nome;
                resultado.sobrenome = results[0].sobrenome;
                resultado.email = results[0].email;
                resultado.salario = results[0].salario;
                resultado.data_cadastro = moment(results[0].data_cadastro).format("DD/MM/YYYY");

                res.send(resultado);
            }
        );
    });

    rotas.get('/clientes_email/:email', function (req, res, next) {
        var email = req.params['email'];
        var sql = `select * from cliente where email = "${email}"`;
        console.log(sql)
        db.query(
            sql,
            (err, results, fields) => {
                if (err)
                    console.log(err)
                console.log(results)
                if (results.length > 0)
                    res.send({ existe: true })
                else
                    res.send({ existe: false })
            }
        );
    });

    rotas.post('/clientes', function (req, res, next) {
        var nome = req.body.nome;
        var sobrenome = req.body.sobrenome;
        var email = req.body.email;
        var salario = +req.body.salario;

        console.log(req)

        var sql = `insert into cliente(nome, sobrenome,` +
            ` email, data_cadastro, salario) values ("${nome}", "${sobrenome}", ` +
            `"${email}", "${moment().format("YYYY-MM-DD")}", ${salario})`

        db.query(
            sql, (erro, resultados, fields) => {
                if (erro)
                    res.send(erro)

                var path = './uploads/clientes';

                mkdirp(path).then(made => {
                    console.log(made)
                    var caminhoTemp = req.files.avatar.path;
                    var type = req.files.avatar.type.split('/');
                    var caminhoNovo = `${path}/C${resultados.insertId}.${type[type.length - 1]}`;
    
                    fs.copyFile(caminhoTemp, caminhoNovo, (err) => {
                        console.log(err)
                        res.send(resultados)
                    });
                }).catch(err => {
                    console.log(err)
                });                
            }
        )
    });

    rotas.post('/clientes_del/:id_cliente', function (req, res, next) {
        var idCliente = req.params['id_cliente'];
        db.query(
            `delete from cliente where id_cliente = ${+idCliente}`,
            (err, results, fields) => {
                if (err)
                    console.log(err)
                res.send(results)
            }
        );
    });

    rotas.patch('/clientes/:id_cliente', function (req, res, next) {
        var nome = req.body.nome;
        var sobrenome = req.body.sobrenome;
        var email = req.body.email;
        var salario = +req.body.salario;
        var idCliente = +req.params.id_cliente;
        var sql = `
            update cliente set nome = "${nome}", sobrenome = "${sobrenome}", ` +
            `email = "${email}", salario = ${salario} where id_cliente = ${idCliente}`
        db.query(
            sql, (erro, resultados, fields) => {
                if (erro)
                    res.send(erro)

                var path = './uploads/clientes';

                mkdirp(path).then(made => {
                    console.log(made)
                    var caminhoTemp = req.files.avatar.path;
                    var type = req.files.avatar.type.split('/');
                    var caminhoNovo = `${path}/C${idCliente}.${type[type.length - 1]}`;
    
                    fs.copyFile(caminhoTemp, caminhoNovo, (err) => {
                        console.log(err)
                        res.send(resultados)
                    });
                }).catch(err => {
                    console.log(err)
                });
            }
        )
    });
}