const User = require('../models/user')
const validator = require('validator')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = "Player2=-098712222137 dsajdjhgasgdkdl;ads;jkds ueyyqwPlayer2";
class UserController {
    async index(req, res) {
        try {
            const users = await User.find({})
            var users_output = []
            users.forEach(user => {
                user.senha = "*".repeat(user.senha.length)
                users_output.push(user)
            });
            res.status(200).json(users_output)
        } catch (e) {
            res.status(500).json(e)
        }
    }
    async edit(req, res) {
        try {
            const query = { "email": req.params.email };
            if (req.params.email == null) {
                throw new Error("Falta o email")
            }
            let data = req.body
            data.cnpj = req.params.email;
            if (data.senha) {
                data.senha = await bcrypt.hash(req.body.senha, 10)
            }
            const update = {
                "$set": data
            };
            const user = await User.findOneAndUpdate(query, update)
            if (!user) {
                return res.status(404).json({ err: "Erro" })
            }
            const user_get = await User.findOne(query)
            res.status(200).json(user_get)
        } catch (e) {
            console.log(e);
            res.status(500).json({ err: e.toString() })
        }
    }
    async findUser(req, res) {
        try {
            const user = await User.findOne({ email: req.params.email })
            console.log(user)
            if (!user) {
                return res.status(404).json()
            }
            res.status(200).json(user)
        } catch (e) {
            res.status(500).json(e)
        }
    }
    async deleteUser(req, res) {
        try {
            const user = await User.findOne({ email: req.params.email }) 
            if (!user) {
                return res.status(404).json()
            }else{
                const usert_delete = await User.findByIdAndDelete(user._id)
            }
            res.status(200).json(user)
        } catch (e) {
            res.status(500).json(e)
        }
    }
    async create(req, res) {
        try {
            if (req.body.email == null) {
                // return res.status(404).send("Falta o email")
                throw new Error("Falta o email")
            }
            else if (req.body.nome == null) {
                // return res.status(404).send("Falta o nome")
                throw new Error("Falta o nome")
            }
            else if (req.body.senha == null) {
                // return res.status(404).send("Falta a senha")
                throw new Error("Falta a senha")
            }
            else {
                var email = req.body.email.toString();
                if (!validator.isEmail(email)) {
                    throw new Error('Email é invalido!')
                }
            }
            var user = await User.findOne({ email: email })
            if (user != null) {
                throw new Error('Usuario já está cadastrado')
            }
            req.body.senha = await bcrypt.hash(req.body.senha, 10)

            user = await new User(req.body)
            await user.save()
            res.status(201).json(user)
        } catch (e) {
            console.log(e)
            res.status(400).json({ err: e.toString() })
        }
    }

    async login(req, res) {
        try {
            var { email, senha } = req.body
            var user = await User.findOne({email: email})
            if (user != undefined) {
                var isPass = await bcrypt.compare(senha, user.senha);
                if (isPass) {
                    var token = jwt.sign({email: user.email, nome: user.nome}, secret)
                    res.status(200).json({ status: true, token: token })
                } else {
                    res.status(406).json({ status: false, err: "senha errada" })
                }
            } else {
                res.status(406).json({ status: false, err: "usuario nao existe" })
            }
        } catch (err) {
            console.log(err)
            res.status(406).json({ status: false, err: "dados invalidos" })
        }
    }

}
module.exports = new UserController();