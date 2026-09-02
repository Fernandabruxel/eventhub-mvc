/*Controller de autenticacao (login, cadastro, logout).
 */
const bcrypt = require('bcryptjs');
const UsuarioModel = require('../models/usuarioModel');

const authController = {
  /**
   * Exibe a tela de login.
   * @param {Request} req
   * @param {Response} res
   * @returns {void}
   */
  getLogin(req, res) {
    res.render('auth/login', { titulo: 'Login' });
  },

  /**
   * Processa o login do usuario.
   * @async
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   * @throws {Error}
   */
  async postLogin(req, res, next) {
    try {
      const { email, senha } = req.body;
      const usuario = await UsuarioModel.buscarPorEmail(email);

      if (!usuario) {
        req.session.flash = { tipo: 'erro', mensagem: 'Email ou senha invalidos.' };
        return res.redirect('/auth/login');
      }

      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      if (!senhaValida) {
        req.session.flash = { tipo: 'erro', mensagem: 'Email ou senha invalidos.' };
        return res.redirect('/auth/login');
      }

      req.session.usuario = { id: usuario.id, nome: usuario.nome, email: usuario.email, tipo: usuario.tipo };
      res.redirect('/eventos');
    } catch (err) {
      next(err);
    }
  },

  /**
   * Exibe a tela de cadastro.
   * @param {Request} req
   * @param {Response} res
   * @returns {void}
   */
  getCadastro(req, res) {
    res.render('auth/cadastro', { titulo: 'Cadastro' });
  },

  /**
   * Processa o cadastro de um novo usuario.
   * @async
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   * @throws {Error}
   */
  async postCadastro(req, res, next) {
    try {
      const { nome, email, senha, tipo } = req.body;

      const existente = await UsuarioModel.buscarPorEmail(email);
      if (existente) {
        req.session.flash = { tipo: 'erro', mensagem: 'Ja existe uma conta com este email.' };
        return res.redirect('/auth/cadastro');
      }

      const senhaHash = await bcrypt.hash(senha, 10);
      await UsuarioModel.criar({ nome, email, senhaHash, tipo });

      req.session.flash = { tipo: 'sucesso', mensagem: 'Cadastro realizado! Faca login para continuar.' };
      res.redirect('/auth/login');
    } catch (err) {
      next(err);
    }
  },

  /**
   * Encerra a sessao do usuario.
   * @param {Request} req
   * @param {Response} res
   * @returns {void}
   */
  logout(req, res) {
    req.session.destroy(() => {
      res.redirect('/auth/login');
    });
  }
};

module.exports = authController;
