var database = require('./database')

function selectRaw(id){
    database.raw(`SELECT l.Nome as nome_loja,cat.Nome as nome_categoria FROM cat_prod cpr INNER JOIN cat_loja cl on cl.ID =cpr.IDcatloja INNER JOIN lojas l on l.ID=cl.IDloja INNER JOIN categorias cat on cat.ID=cl.IDcategoria WHERE l.id=${id} group by nome_categoria;`).then(data=>{
        console.log(data[0])
    }).catch(err=>{
        console.log(err)
    });
}

function consultainnerjoin(id){
    database.select(database.ref('lojas.Nome').as('nome_loja'),database.ref('categorias.Nome').as('nome_categoria'))
    .table("cat_prod")
    .innerJoin("cat_loja","cat_loja.ID","cat_prod.IDcatloja")
    .innerJoin("lojas","lojas.ID","cat_loja.IDloja")
    .innerJoin("categorias","categorias.ID","cat_loja.IDcategoria")
    .whereRaw(`lojas.ID = ${id}`)
    .groupBy('categorias.Nome')
    .then(data=>{
        console.log(data)
    }).catch(err=>{
        console.log(err)
    });
}
consultainnerjoin(2);
selectRaw(2);