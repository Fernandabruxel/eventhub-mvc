/**Middlewares de autenticacao e autorizacao baseados em sessao.
 */

/**
 * Garante que o usuario esteja autenticado. Caso contrario, redireciona para login.
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 * @returns {void}
 */
function requireAuth(req, res, next) {
  if (!req.session || !req.session.usuario) {
    req.session.flash = { tipo: 'erro', mensagem: 'Voce precisa estar logado para acessar esta pagina.' };
    return res.redirect('/auth/login');
  }
  next();
}

/**
 * Garante que o usuario logado seja do tipo organizador.
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 * @returns {void}
 */
function requireOrganizador(req, res, next) {
  if (!req.session.usuario || req.session.usuario.tipo !== 'organizador') {
    req.session.flash = { tipo: 'erro', mensagem: 'Acesso restrito a organizadores.' };
    return res.redirect('/eventos');
  }
  next();
}

/**
 * Disponibiliza o usuario logado (ou null) para todas as views.
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 * @returns {void}
 */
function injetarUsuario(req, res, next) {
  res.locals.usuarioLogado = req.session.usuario || null;
  res.locals.flash = req.session.flash || null;
  delete req.session.flash;
  next();
}

module.exports = { requireAuth, requireOrganizador, injetarUsuario };

