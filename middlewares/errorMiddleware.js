/* Middlewares de tratamento de rotas nao encontradas e erros gerais.
 */

/**
 * Trata rotas nao encontradas (404).
 * @param {Request} req
 * @param {Response} res
 * @returns {void}
 */
function naoEncontrado(req, res) {
  res.status(404).render('error', {
    titulo: 'Pagina nao encontrada',
    mensagem: 'A pagina que voce procura nao existe.',
    usuarioLogado: req.session ? req.session.usuario : null
  });
}

/**
 * Middleware global de tratamento de erros. Nao expoe stack trace em producao.
 * @param {Error} err
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 * @returns {void}
 */
function tratarErro(err, req, res, next) {
  console.error(err);
  const mensagem = process.env.NODE_ENV === 'production'
    ? 'Ocorreu um erro interno. Tente novamente mais tarde.'
    : err.message;

  res.status(err.status || 500).render('error', {
    titulo: 'Erro',
    mensagem,
    usuarioLogado: req.session ? req.session.usuario : null
  });
}

module.exports = { naoEncontrado, tratarErro };