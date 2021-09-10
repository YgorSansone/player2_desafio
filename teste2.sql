Create Table `categorias` ( 
  ID Int NOT NULL Primary Key AUTO_INCREMENT UNIQUE,
  Nome varchar(255) NOT NULL UNIQUE,
  Descricao varchar(255),
  Icone varchar(255)
) ENGINE=INNODB;

Create Table `lojas` ( 
  ID Int NOT NULL Primary Key AUTO_INCREMENT UNIQUE,
  Nome varchar(255) NOT NULL UNIQUE,
  Descricao varchar(255)
) ENGINE=INNODB;

Create Table `produtos` ( 
  ID Int NOT NULL Primary Key AUTO_INCREMENT UNIQUE,
  Nome varchar(255) NOT NULL,
  Descricao varchar(255),
  Valor varchar(255),
  IDloja Int NOT NULL,
  CONSTRAINT FK_loja Foreign Key(IDloja) REFERENCES lojas(ID)
) ENGINE=INNODB;

Create Table `cat_loja` ( 
  ID Int NOT NULL Primary Key AUTO_INCREMENT UNIQUE,
  IDloja Int NOT NULL,
  IDcategoria Int NOT NULL,
  CONSTRAINT FK_loja_cat Foreign Key(IDloja) REFERENCES lojas(ID), 
  CONSTRAINT FK_cat_loja Foreign Key(IDcategoria) REFERENCES categorias(ID)
) ENGINE=INNODB;

Create Table `cat_prod` ( 
  ID Int NOT NULL Primary Key AUTO_INCREMENT UNIQUE,
  IDcatloja Int NOT NULL,
  IDproduto Int NOT NULL,
  CONSTRAINT FK_loja_cat_prod Foreign Key(IDcatloja) REFERENCES cat_loja(ID), 
  CONSTRAINT FK_Prod Foreign Key(IDproduto) REFERENCES produtos(ID)
) ENGINE=INNODB;

DELIMITER $
Create trigger tr_check_prod_cad
BEFORE INSERT ON `cat_prod`
FOR EACH ROW
BEGIN
		IF (NEW.IDcatloja IS NOT NULL AND NEW.IDproduto IS NOT NULL) THEN
			SET @idlojap = (select IDloja from produtos where (ID= NEW.IDproduto));
            SET @idlojacat = (select IDloja from cat_loja where (ID=NEW.IDcatloja));
			IF (@idlojap <> @idlojacat)
			THEN CALL `Insert not allowed`;
			END IF;
		END IF;
END
$
DELIMITER ;

DELIMITER $
Create trigger tr_check_prod_update
BEFORE UPDATE ON `cat_prod`
FOR EACH ROW
BEGIN
		IF (NEW.IDcatloja IS NOT NULL AND NEW.IDproduto IS NOT NULL) THEN
			SET @idlojap = (select IDloja from produtos where (ID= NEW.IDproduto));
            SET @idlojacat = (select IDloja from cat_loja where (ID=NEW.IDcatloja));
			IF (@idlojap <> @idlojacat)
			THEN CALL `Insert not allowed`;
			END IF;
		END IF;
END
$
DELIMITER ;

INSERT INTO categorias (Nome, Descricao, Icone)
VALUES ("Decoração", "categoria Decoração", "https://cdn.w600.comps.canstockphoto.com.br/vitamina-sol-%C3%ADcone-d-ilustra%C3%A7%C3%A3o-fotos_csp68631685.jpg");

SELECT * FROM categorias;

INSERT INTO lojas (Nome, Descricao)
VALUES ("Ygor", "loja do Ygor");

SELECT * FROM lojas;


INSERT INTO cat_loja (IDloja, IDcategoria)
VALUES (2,4);

select * from cat_loja;

INSERT INTO produtos (Nome, Descricao,Valor,IDloja)
VALUES ("camisa", "camisa", "20,00", 1);

SELECT * FROM produtos;

SELECT * FROM cat_prod;
INSERT INTO cat_prod (IDcatloja, IDproduto)
VALUES (1,5);

-- SELECT l.Nome as nome_loja, 
--         cat.Nome as nome_categoria
-- FROM lojas l
-- INNER JOIN cat_loja cl on cl.IDloja =l.ID
-- INNER JOIN categorias cat on cat.ID =cl.ID
-- INNER JOIN cat_prod cpr on cpr.IDcatloja =cl.ID
-- INNER JOIN produtos prod on prod.ID =cpr.IDproduto
-- where l.ID = 2;


SELECT l.Nome as nome_loja,cat.Nome as nome_categoria,cat_prod.ID as id_prod
FROM cat_prod cpr 
INNER JOIN cat_loja cl on cl.ID =cpr.IDcatloja
INNER JOIN lojas l on l.ID=cl.IDloja
INNER JOIN categorias cat on cat.ID=cl.IDcategoria
WHERE l.id=1
group by nome_categoria;







