/*Regras de validacao e sanitizacao de entrada usando express-validator.
 */
const { body, validationResult } = require('express-validator');

const validarCadastro = [
  body('nome').trim().notEmpty().withMessage('Nome e obrigatorio').escape(),
  body('email').trim().isEmail().withMessage('Email invalido').normalizeEmail(),
  body('senha').isLength({ min: 6 }).withMessage('A senha deve ter no minimo 6 caracteres'),
  body('tipo').isIn(['organizador', 'participante']).withMessage('Tipo de usuario invalido')
];

const validarLogin = [
  body('email').trim().isEmail().withMessage('Email invalido').normalizeEmail(),
  body('senha').notEmpty().withMessage('Senha obrigatoria')
];

const validarEvento = [
  body('titulo').trim().notEmpty().withMessage('Titulo e obrigatorio').escape(),
  body('descricao').trim().notEmpty().withMessage('Descricao e obrigatoria').escape(),
  body('data_evento').notEmpty().withMessage('Data e obrigatoria'),
  body('horario').notEmpty().withMessage('Horario e obrigatorio'),
  body('local').trim().notEmpty().withMessage('Local e obrigatorio').escape(),
  body('capacidade').isInt({ min: 1 }).withMessage('Capacidade deve ser um numero inteiro maior que zero')
];

/**
 * Verifica o resultado da validacao e redireciona com erro em caso de falha.
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 * @returns {void}
 */
function verificarValidacao(req, res, next) {
  const erros = validationResult(req);
  if (!erros.isEmpty()) {
    req.session.flash = { tipo: 'erro', mensagem: erros.array()[0].msg };
    return res.redirect('back');
  }
  next();
}

module.exports = { validarCadastro, validarLogin, validarEvento, verificarValidacao };
