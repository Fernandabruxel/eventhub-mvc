const express = require('express');
const router = express.Router();
const inscricaoController = require('../controllers/inscricaoController');
const { requireAuth } = require('../middlewares/authMiddleware');

router.get('/minhas-inscricoes', requireAuth, inscricaoController.minhasInscricoes);

module.exports = router;