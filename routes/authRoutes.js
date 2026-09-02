const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validarLogin, validarCadastro, verificarValidacao } = require('../middlewares/validationMiddleware');

router.get('/login', authController.getLogin);
router.post('/login', validarLogin, verificarValidacao, authController.postLogin);
router.get('/cadastro', authController.getCadastro);
router.post('/cadastro', validarCadastro, verificarValidacao, authController.postCadastro);
router.get('/logout', authController.logout);

module.exports = router;