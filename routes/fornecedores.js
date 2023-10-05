const express = require('express');
const fs = require('fs');
const { mkdirp } = require('mkdirp')
const db = require("../config/database");

module.exports = (app) => {
    const rotas = express.Router();

    app.use("/", rotas);

    rotas.get("/fornecedor", (req, res) => {
        res.send("NOVA ROTA PARA FORNECEDORES");
    })

    app.get('/fornecedores_all', function (req, res, next) {
        db.query(
            'select * from fornecedor',
            (err, results, fields) => {
                if (err)
                    console.log(err)
                res.send(results)
            }
        );
      });
      
      app.get('/fornecedores_byId/:id_fornecedor', function (req, res, next) {
        var idFornecedor = req.params['id_fornecedor'];
        db.query(
            `select * from fornecedor where id_fornecedor = ${+idFornecedor}`,
            (err, results, fields) => {
                if (err)
                    console.log(err)
                var resultado = {};
                resultado.id_fornecedor = results[0].id_fornecedor;
                resultado.razao = results[0].razao;
                resultado.cpf_cnpj = results[0].cpf_cnpj;
                resultado.contato = results[0].contato;
                resultado.logradouro = results[0].logradouro;
                resultado.cidade = results[0].cidade;
                resultado.uf = results[0].uf;

                res.send(resultado)
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
      
            db.query(
                sql, (erro, resultados, fields) => {
                    if (erro)
                        res.send(erro)
                    
                    var path = './uploads/fornecedores';

                    if(Object.keys(req.files).length > 0){
                        mkdirp(path).then(made => {
                            var caminhoTemp = req.files.avatar.path;
                            var type = req.files.avatar.type.split('/');
                            var caminhoNovo = `${path}/F${resultados.insertId}.${type[type.length - 1]}`;
            
                            fs.copyFile(caminhoTemp, caminhoNovo, (err) => {
                                res.send(resultados)
                            });
                        }).catch(err => {
                            console.log(err)
                        });
                    } else {
                        res.send(resultados)
                    }
                }
            )
        } else {
            res.send("Preencha os campos corretamente!");
        }
        
      });
      
      app.post('/fornecedores_del/:id_fornecedor', function (req, res, next) {
        var idFornecedor = req.params['id_fornecedor'];
        db.query(
            `delete from fornecedor where id_fornecedor = ${+idFornecedor}`,
            (err, results, fields) => {
                if (err)
                    console.log(err)
                var path = `./uploads/fornecedores/F${idFornecedor}.jpeg`;
                if (fs.existsSync(path)) {
                    fs.unlink(path, (err) => {
                        console.log(err)
                    })
                }
                res.send(results)
            }
        );
      });
      
      app.patch('/fornecedores/:id_fornecedor', function (req, res, next) {
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
            db.query(
                sql, (erro, resultados, fields) => {
                    if (erro)
                        res.send(erro)
                    
                    var path = './uploads/fornecedores';

                    if(Object.keys(req.files).length > 0){
                        mkdirp(path).then(made => {
                            var caminhoTemp = req.files.avatar.path;
                            var type = req.files.avatar.type.split('/');
                            var caminhoNovo = `${path}/F${idFornecedor}.${type[type.length - 1]}`;
            
                            fs.copyFile(caminhoTemp, caminhoNovo, (err) => {
                                res.send(resultados)
                            });
                        }).catch(err => {
                            console.log(err)
                        });
                    } else {
                        res.send(resultados)
                    }
                }
            )
          } else {
            res.send("Preencha os campos corretamente!");
          }
      });
}