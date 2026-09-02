const express = require('express');
const router = express.Router();
const eventoController = require('../controllers/eventoController');
const inscricaoController = require('../controllers/inscricaoController');
const { requireAuth, requireOrganizador } = require('../middlewares/authMiddleware');
const { validarEvento, verificarValidacao } = require('../middlewares/validationMiddleware');

router.get('/', eventoController.index);
router.get('/meus-eventos', requireAuth, requireOrganizador, eventoController.meusEventos);
router.get('/criar', requireAuth, requireOrganizador, eventoController.criarForm);
router.post('/criar', requireAuth, requireOrganizador, validarEvento, verificarValidacao, eventoController.criar);
router.get('/:id/editar', requireAuth, requireOrganizador, eventoController.editarForm);
router.post('/:id/editar', requireAuth, requireOrganizador, validarEvento, verificarValidacao, eventoController.editar);
router.post('/:id/excluir', requireAuth, requireOrganizador, eventoController.excluir);
router.get('/:id/inscritos', requireAuth, requireOrganizador, eventoController.inscritos);
router.post('/:id/inscrever', requireAuth, inscricaoController.inscrever);
router.get('/:id', eventoController.detalhes);

module.exports = router;