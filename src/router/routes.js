var express = require("express")
var app = express();
var router = express.Router();
var companyController = require("../controllers/companyController");
var userController = require("../controllers/userController")
const adminAuth = require("../middleware/UserAuth")
router.get('/', (req,res)=>{
    res.json({});
});
router.post('/user', userController.create);
router.get('/user',adminAuth, userController.index);
router.get('/user/:email',adminAuth, userController.findUser);
router.put('/user/:email',adminAuth, userController.edit);
router.delete('/user/:email',adminAuth, userController.deleteUser);
router.post('/login', userController.login);

router.post('/company', companyController.create);
router.get('/company',adminAuth, companyController.index);
router.get('/company/:cnpj',adminAuth, companyController.findCompany);
router.put('/company/:cnpj',adminAuth, companyController.editCompany);
router.delete('/company/:cnpj',adminAuth, companyController.deleteCompany);


module.exports = router;