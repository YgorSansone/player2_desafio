let app = require("../src/app")
let supertest = require("supertest")
let request = supertest(app)
// const request = require('supertest')
let mainUser = { nome: "ygor_final", email: "ygorfinal@gmail.com", senha: "teste123@" }
let mainCompany = { cnpj: "34.015.322/0001-26" }
let token = ""
beforeAll(() => {
    return request.post("/user")
        .send(mainUser)
        .then(res => {
            request.post("/login")
                .send({ email: mainUser.email, senha: mainUser.senha })
                .then(res => {
                    token = res.body.token
                    request.post("/company")
                        .set('authorization', `Bearer ${token}`)
                        .send({ cnpj: mainCompany.cnpj })
                        .then(res => {
                        }).catch(err => {
                            console.log(err)
                        })
                }).catch(err => {
                    console.log(err)
                })
        }).catch(err => {
            console.log(err)
        })
})
afterAll(() => {
    return request.delete(`/company${mainCompany.cnpj}`)
        .set('authorization', `Bearer ${token}`)
        .then(res => {
        }).catch(err => {
            console.log(err)
        })
})
describe("Cadastro de empresa", () => {
    test("Deve cadastrar uma empresa com sucesso", async () => {
        let company = {
            cnpj: "19131243000197",
        }
        return request.post("/company")
            .set('authorization', `Bearer ${token}`)
            .send(company)
            .then(res => {
                expect(res.statusCode).toEqual(201);
            }).catch(err => {
                fail(err)
            })
    })
    test("Deve impedir cadastrar uma empresa com dados vazios", async () => {
        let company = {
            cnpj: "",
        }
        return request.post("/company")
            .set('authorization', `Bearer ${token}`)
            .send(company)
            .then(res => {
                expect(res.statusCode).toEqual(400);//400 - bad request
            }).catch(err => {
                fail(err)
            })
    })
    test("Deve impedir cadastrar empresa se encontrar o mesmo cnpj", async () => {
        let company = {
            cnpj: "19131243000197",
        }
        return request.post("/company")
            .set('authorization', `Bearer ${token}`)
            .send(company)
            .then(res => {
                expect(res.statusCode).toEqual(400);
                expect(res.body.err).toEqual('Error: Empresa já está cadastrada');
            }).catch(err => {
                fail(err)
            })
    })
    test("Deve impedir cadastrar empresa com cnpj invalido", async () => {
        let company = {
            cnpj: "19131243000197A3",
        }
        return request.post("/company")
            .set('authorization', `Bearer ${token}`)
            .send(company)
            .then(res => {
                expect(res.statusCode).toEqual(400);
                expect(res.body.err).toEqual('Error: CNPJ invalido');
            }).catch(err => {
                fail(err)
            })
    })
})

describe("Listar empresa", () => {
    test("Deve retornar a lista de empresas com sucesso", async () => {
        return request.get(`/company`)
            .set('authorization', `Bearer ${token}`)
            .then(res => {
                expect(res.statusCode).toEqual(200);
            }).catch(err => {
                fail(err)
            })
    })
    test("Deve retornar uma empresa com sucesso", async () => {
        let company = {
            cnpj: "19131243000197",
        }
        return request.get(`/company/${company.cnpj}`)
            .set('authorization', `Bearer ${token}`)
            .then(res => {
                expect(res.statusCode).toEqual(200);
            }).catch(err => {
                fail(err)
            })
    })
    test("Deve impedir listar empresas sem estar logado", async () => {
        return request.get(`/company`)
            .then(res => {
                expect(res.statusCode).toEqual(403);
            }).catch(err => {
                fail(err)
            })
    })
    test("Deve impedir mostrar empresa sem estar logado", async () => {
        return request.get(`/company/${mainCompany.cnpj}`)
            .then(res => {
                expect(res.statusCode).toEqual(404);
            }).catch(err => {
                fail(err)
            })
    })
    test("Deve impedir mostrar se nao encontrar a empresa", async () => {
        let company = {
            cnpj: "19131243000197A31",
        }
        return request.get(`/company/${company.cnpj}`)
            .set('authorization', `Bearer ${token}`)
            .then(res => {
                expect(res.statusCode).toEqual(500);
            }).catch(err => {
                fail(err)
            })
    })
})

describe("Editar empresa", () => {
    test("Deve editar uma empresa com sucesso", async () => {
        let company = {
            cnpj: "19131243000197",
            razao_social: "Atualizou a razao",
            nome_fantasia: "Atualizou o nome fantasia",
        }
        return request.put(`/company/${company.cnpj}`)
            .set('authorization', `Bearer ${token}`)
            .send(company)
            .then(res => {
                expect(res.statusCode).toEqual(200);
                expect(res.body.razao_social).toEqual(company.razao_social);
                expect(res.body.nome_fantasia).toEqual(company.nome_fantasia);
            }).catch(err => {
                fail(err)
            })
    })
    test("Deve impedir editar sem estar logado", async () => {
        let company = {
            cnpj: "19131243000197",
            razao_social: "Atualizou a razao",
            nome_fantasia: "Atualizou o nome fantasia",
        }
        return request.put(`/company/${company.cnpj}`)
            .send(company)
            .then(res => {
                expect(res.statusCode).toEqual(403);
            }).catch(err => {
                fail(err)
            })
    })
    test("Deve impedir editar se nao encontrar uma empresa", async () => {
        let company = {
            cnpj: "1913124300019721A",
            razao_social: "Atualizou a razao 2",
            nome_fantasia: "Atualizou o nome fantasia 2",
        }
        return request.put(`/company/${company.cnpj}`)
            .set('authorization', `Bearer ${token}`)
            .send(company)
            .then(res => {
                expect(res.statusCode).toEqual(500);
            }).catch(err => {
                fail(err)
            })
    })
    test("Deve impedir editar se nao passar um cnpj", async () => {
        let company = {
            razao_social: "Atualizou a razao 2",
            nome_fantasia: "Atualizou o nome fantasia 2",
        }
        return request.put(`/company`)
            .set('authorization', `Bearer ${token}`)
            .send(company)
            .then(res => {
                expect(res.statusCode).toEqual(404);
            }).catch(err => {
                fail(err)
            })
    })
})

describe("Deletar empresa", () => {
    test("Deve deletar uma empresa com sucesso", async () => {
        let company = {
            cnpj: "19131243000197",
        }
        return request.delete(`/company/${company.cnpj}`)
            .set('authorization', `Bearer ${token}`)
            .then(res => {
                expect(res.statusCode).toEqual(200);
            }).catch(err => {
                fail(err)
            })
    })
    test("Deve impedir deletar sem estar logado", async () => {
        return request.delete(`/company/${mainCompany.cnpj}`)
            .then(res => {
                expect(res.statusCode).toEqual(404);
            }).catch(err => {
                fail(err)
            })
    })
    test("Deve impedir deletar se nao encontrar a empresa", async () => {
        let company = {
            cnpj: "19131243000197A31",
        }
        return request.delete(`/company/${company.cnpj}`)
            .set('authorization', `Bearer ${token}`)
            .then(res => {
                expect(res.statusCode).toEqual(500);
            }).catch(err => {
                fail(err)
            })
    })
})

