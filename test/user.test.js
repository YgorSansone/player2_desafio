let app = require("../src/app")
let supertest = require("supertest")
const Users = require('../src/router/routes')
let request = supertest(app)
// const request = require('supertest')
let mainUser = { nome: "ygor_final", email: "ygorfinal@gmail.com", senha: "teste123@" }
beforeAll(() => {
    return request.post("/user")
        .send(mainUser)
        .then(res => {
        }).catch(err => {
            console.log(err)
        })
})
afterAll(() => {
    return request.delete(`/user${mainUser.email}`)
        .then(res => {
        }).catch(err => {
            console.log(err)
        })
})
describe("Cadastro de usuario", () => {
    test("Deve cadastrar um usuario com sucesso", async () => {
        let time = Date.now()
        let email = `${time}@gmail.com`
        let user = {
            nome: "ygor_teste",
            email,
            senha: "123456"
        }
        return request.post("/user")
            .send(user)
            .then(res => {
                expect(res.statusCode).toEqual(201);
                expect(res.body.email).toEqual(email)
            }).catch(err => {
                fail(err)
            })
    })
    test("Deve impedir cadastrar um usuario com dados vazios", async () => {
        let user = {
            nome: "",
            email: "",
            senha: ""
        }
        return request.post("/user")
            .send(user)
            .then(res => {
                expect(res.statusCode).toEqual(400);//400 - bad request
            }).catch(err => {
                fail(err)
            })
    })
    test("Deve impedir cadastrar usuario se encontrar o mesmo email", async () => {
        let time = Date.now()
        let email = `${time}@gmail.com`
        let user = {
            nome: "ygor_teste",
            email,
            senha: "123456"
        }
        return request.post("/user")
            .send(user)
            .then(res => {
                expect(res.statusCode).toEqual(201);
                expect(res.body.email).toEqual(email)
                request.post("/user")
                    .send(user)
                    .then(res => {
                        expect(res.statusCode).toEqual(400);
                        expect(res.body.err).toEqual('Error: Usuario já está cadastrado');
                    }).catch(err => {
                        fail(err)
                    })
            }).catch(err => {
                fail(err)
            })
    })
    test("Deve impedir cadastrar usuario com email invalido", async () => {
        let time = Date.now()
        let email = `${time}`
        let user = {
            nome: "ygor_teste",
            email,
            senha: "123456"
        }
        return request.post("/user")
            .send(user)
            .then(res => {
                expect(res.statusCode).toEqual(400);
                expect(res.body.err).toEqual('Error: Email é invalido!');
            }).catch(err => {
                fail(err)
            })
    })
    test("Deve impedir cadastrar usuario sem email", async () => {
        let user = {
            nome: "ygor_teste",
            senha: "123456"
        }
        return request.post("/user")
            .send(user)
            .then(res => {
                expect(res.statusCode).toEqual(400);
                expect(res.body.err).toEqual("Error: Falta o email");
            }).catch(err => {
                fail(err)
            })
    })
    test("Deve impedir cadastrar usuario sem nome", async () => {
        let time = Date.now()
        let email = `${time}`
        let user = {
            email,
            senha: "123456"
        }
        return request.post("/user")
            .send(user)
            .then(res => {
                expect(res.statusCode).toEqual(400);
                expect(res.body.err).toEqual("Error: Falta o nome");
            }).catch(err => {
                fail(err)
            })
    })
    test("Deve impedir cadastrar usuario sem senha", async () => {
        let time = Date.now()
        let email = `${time}`
        let user = {
            nome: "ygor_teste",
            email
        }
        return request.post("/user")
            .send(user)
            .then(res => {
                expect(res.statusCode).toEqual(400);
                expect(res.body.err).toEqual("Error: Falta a senha");
            }).catch(err => {
                fail(err)
            })
    })
})

describe("Logar de usuario", () => {
    test("Deve retornar um token ao logar com sucesso", async () => {
        return request.post("/login")
            .send({ email: mainUser.email, senha: mainUser.senha })
            .then(res => {
                expect(res.statusCode).toEqual(200);
                expect(res.body.token).toBeDefined()
            }).catch(err => {
                fail(err)
            })
    })
    test("Deve impedir usuario nao cadastrado se logar", async () => {
        let time = Date.now()
        let email = `${time}@gmail.com`
        let user = {
            email,
            senha: "123456"
        }
        return request.post("/login")
            .send(user)
            .then(res => {
                expect(res.statusCode).toEqual(406);
                expect(res.body.err).toEqual("usuario nao existe");
            }).catch(err => {
                fail(err)
            })
    })
    test("Deve impedir usuario logar com senha errada", async () => {
        let time = Date.now()
        let senha = `${time}teste`
        return request.post("/login")
            .send({ email: mainUser.email, senha: senha })
            .then(res => {
                expect(res.statusCode).toEqual(406);
                expect(res.body.err).toEqual("senha errada");
            }).catch(err => {
                fail(err)
            })
    })
})
describe("Auth de usuario", () => {
    test("Deve retornar a lista de usuarios", async () => {
        return request.post("/login")
            .send({ email: mainUser.email, senha: mainUser.senha })
            .then(res => {
                expect(res.statusCode).toEqual(200);
                expect(res.body.token).toBeDefined()
                request.get("/user")
                    .set('authorization', `Bearer ${res.body.token}`)
                    .then(res => {
                        expect(res.statusCode).toEqual(200);
                    }).catch(err => {
                        fail(err)
                    })
            }).catch(err => {
                fail(err)
            })
    })
    test("Deve retornar a 1 de usuario", async () => {
        return request.post("/login")
            .send({ email: mainUser.email, senha: mainUser.senha })
            .then(res => {
                expect(res.statusCode).toEqual(200);
                expect(res.body.token).toBeDefined()
                request.get(`/user/${mainUser.email}`)
                    .set('authorization', `Bearer ${res.body.token}`)
                    .then(res => {
                        expect(res.statusCode).toEqual(200);
                    }).catch(err => {
                        fail(err)
                    })
            }).catch(err => {
                fail(err)
            })
    })
    test("Deve atualizar um 1 de usuario", async () => {
        return request.post("/login")
            .send({ email: mainUser.email, senha: mainUser.senha })
            .then(res => {
                expect(res.statusCode).toEqual(200);
                expect(res.body.token).toBeDefined()
                request.put(`/user/${mainUser.email}`)
                    .set('authorization', `Bearer ${res.body.token}`)
                    .send({nome: "ygor editado"})
                    .then(res => {
                        expect(res.statusCode).toEqual(200);
                    }).catch(err => {
                        fail(err)
                    })
            }).catch(err => {
                fail(err)
            })
    })
    test("Deve impedir retornar a lista de usuarios sem estar logado", async () => {
        return request.get("/user")
        .then(res => {
            expect(res.statusCode).toEqual(403);
            expect(res.body.err).toEqual("voce nao tem permissao");
        }).catch(err => {
            fail(err)
        })
    })
    test("Deve impedir retornar a um usuarios sem estar logado", async () => {
        return request.get(`/user/${mainUser.email}`)
        .then(res => {
            expect(res.statusCode).toEqual(403);
            expect(res.body.err).toEqual("voce nao tem permissao");
        }).catch(err => {
            fail(err)
        })
    })
    test("Deve impedir atualizar um usuarios sem estar logado", async () => {
        return request.put(`/user/${mainUser.email}`)
        .send({nome: "ygor editado"})
        .then(res => {
            expect(res.statusCode).toEqual(403);
            expect(res.body.err).toEqual("voce nao tem permissao");
        }).catch(err => {
            fail(err)
        })
    })
})