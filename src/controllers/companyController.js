const Company = require('../models/company')
const axios = require('axios')

class CompanyController {
    async create(req, res) {
        try {
            var dados = {}
            if (req.body.cnpj == null) {
                throw new Error("Falta o cnpj")
            }
            else {
                var cnpj = req.body.cnpj.toString().replace(/[^\d]/g, '').trim();
                console.log(cnpj)
                var dados_tmp = {}
                await axios.get(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`).then(resp => {
                    if (resp.status == 200) {
                        dados_tmp = resp.data;
                    } else {
                        throw new Error("CNPJ invalido")
                    }
                }).catch((err) => {
                    if (err.response.status === 400) {
                        console.log("cnpj invalido")
                        throw new Error("CNPJ invalido")
                    } else {
                        console.log("servidor off")
                        throw new Error("servidor off")
                    }
                });
                const contador = Object.entries(dados_tmp).length;
                if (contador === 0) {
                    throw new Error("CNPJ invalido")
                } else {
                    dados = {}
                    dados.razao_social = dados_tmp.razao_social;
                    dados.nome_fantasia = dados_tmp.nome_fantasia;
                    dados.cnpj = dados_tmp.cnpj;
                    delete dados_tmp.razao_social;
                    delete dados_tmp.nome_fantasia;
                    delete dados_tmp.cnpj;
                    dados.informacoes = dados_tmp;
                }

            }
            var company = await Company.findOne({ cnpj: cnpj })
            if (company != null) {
                throw new Error("Empresa já está cadastrada")
            } else {
                company = new Company(dados)
                console.log(company)
            }
            await company.save()
            res.status(201).json(company)
        } catch (e) {
            res.status(400).json({ err: e.toString() })
        }
    }
    async index(req, res) {
        try {
            const company = await Company.find({})
            res.status(200).json(company)
        } catch (e) {
            res.status(500).json(e)
        }
    }
    async findCompany(req, res) {
        try {
            console.log(req.params.cnpj)
            const company = await Company.findOne({ cnpj: req.params.cnpj })
            if (!company) {
                return res.status(404).send()
            }
            console.log(company)
            res.status(200).json(company)
        } catch (e) {
            res.status(500).json(e)
        }
    }
    async deleteCompany(req, res) {
        try {
            const company = await Company.find({ cnpj: req.params.cnpj })    
            if (!company) {
                return res.status(404).send()
            }else{
                const company_delete = await Company.findByIdAndDelete(company[0]._id)
            }
            res.status(200).json(company)
        } catch (e) {
            res.status(500).json(e)
        }
    }
    async editCompany(req, res) {
        try {
            const query = { "cnpj": req.params.cnpj };
            if (req.params.cnpj == null || req.params.cnpj == "") {
                throw new Error("Falta o cnpj")
            }
            let data = req.body
            data.cnpj = req.params.cnpj;
            const update = {
                "$set": data
            };
            const company = await Company.findOneAndUpdate(query, update)
            if (!company) {
                return res.status(404).json({ err: "Erro" })
            }
            const company_get = await Company.findOne(query)
            res.status(200).json(company_get)
        } catch (e) {
            console.log(e);
            res.status(500).json({ err: e.toString() })
        }
    }
}
module.exports = new CompanyController();