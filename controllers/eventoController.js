/*Controller de eventos (listagem, detalhes, CRUD do organizador).
 */
const EventoModel = require('../models/eventoModel');
const InscricaoModel = require('../models/inscricaoModel');

const eventoController = {
  /**
   * Lista todos os eventos disponiveis, com busca opcional.
   * @async
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   * @throws {Error}
   */
  async index(req, res, next) {
    try {
      const busca = req.query.busca || '';
      const eventos = await EventoModel.listarTodos(busca);
      res.render('eventos/index', { titulo: 'Eventos', eventos, busca });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Exibe os detalhes de um evento.
   * @async
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   * @throws {Error}
   */
  async detalhes(req, res, next) {
    try {
      const evento = await EventoModel.buscarPorId(req.params.id);
      if (!evento) {
        return res.status(404).render('error', { titulo: 'Evento nao encontrado', mensagem: 'Este evento nao existe.', usuarioLogado: req.session.usuario || null });
      }

      let jaInscrito = false;
      if (req.session.usuario) {
        const inscricao = await InscricaoModel.buscarPorUsuarioEEvento(req.session.usuario.id, evento.id);
        jaInscrito = !!inscricao;
      }

      res.render('eventos/detalhes', { titulo: evento.titulo, evento, jaInscrito });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Exibe o formulario de criacao de evento.
   * @param {Request} req
   * @param {Response} res
   * @returns {void}
   */
  criarForm(req, res) {
    res.render('eventos/criar', { titulo: 'Criar evento' });
  },

  /**
   * Processa a criacao de um evento pelo organizador logado.
   * @async
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   * @throws {Error}
   */
  async criar(req, res, next) {
    try {
      const { titulo, descricao, data_evento, horario, local, capacidade } = req.body;
      await EventoModel.criar({
        titulo, descricao, data_evento, horario, local, capacidade,
        usuario_id: req.session.usuario.id
      });
      req.session.flash = { tipo: 'sucesso', mensagem: 'Evento criado com sucesso!' };
      res.redirect('/eventos/meus-eventos');
    } catch (err) {
      next(err);
    }
  },

  /**
   * Exibe o formulario de edicao de um evento do organizador.
   * @async
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   * @throws {Error}
   */
  async editarForm(req, res, next) {
    try {
      const evento = await EventoModel.buscarPorId(req.params.id);
      if (!evento || evento.usuario_id !== req.session.usuario.id) {
        req.session.flash = { tipo: 'erro', mensagem: 'Voce nao tem permissao para editar este evento.' };
        return res.redirect('/eventos/meus-eventos');
      }
      res.render('eventos/editar', { titulo: 'Editar evento', evento });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Processa a edicao de um evento, validando propriedade do organizador.
   * @async
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   * @throws {Error}
   */
  async editar(req, res, next) {
    try {
      const evento = await EventoModel.buscarPorId(req.params.id);
      if (!evento || evento.usuario_id !== req.session.usuario.id) {
        req.session.flash = { tipo: 'erro', mensagem: 'Voce nao tem permissao para editar este evento.' };
        return res.redirect('/eventos/meus-eventos');
      }
      await EventoModel.atualizar(req.params.id, req.body);
      req.session.flash = { tipo: 'sucesso', mensagem: 'Evento atualizado com sucesso!' };
      res.redirect('/eventos/meus-eventos');
    } catch (err) {
      next(err);
    }
  },

  /**
   * Exclui um evento, validando propriedade do organizador.
   * @async
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   * @throws {Error}
   */
  async excluir(req, res, next) {
    try {
      const evento = await EventoModel.buscarPorId(req.params.id);
      if (!evento || evento.usuario_id !== req.session.usuario.id) {
        req.session.flash = { tipo: 'erro', mensagem: 'Voce nao tem permissao para excluir este evento.' };
        return res.redirect('/eventos/meus-eventos');
      }
      await EventoModel.excluir(req.params.id);
      req.session.flash = { tipo: 'sucesso', mensagem: 'Evento excluido com sucesso!' };
      res.redirect('/eventos/meus-eventos');
    } catch (err) {
      next(err);
    }
  },

  /**
   * Lista os eventos do organizador logado.
   * @async
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   * @throws {Error}
   */
  async meusEventos(req, res, next) {
    try {
      const eventos = await EventoModel.listarPorOrganizador(req.session.usuario.id);
      res.render('eventos/meus-eventos', { titulo: 'Meus eventos', eventos });
    } catch (err) {
      next(err);
    }
  },

  /**
   * Lista os inscritos de um evento do organizador logado.
   * @async
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   * @throws {Error}
   */
  async inscritos(req, res, next) {
    try {
      const evento = await EventoModel.buscarPorId(req.params.id);
      if (!evento || evento.usuario_id !== req.session.usuario.id) {
        req.session.flash = { tipo: 'erro', mensagem: 'Voce nao tem permissao para ver os inscritos deste evento.' };
        return res.redirect('/eventos/meus-eventos');
      }
      const inscritos = await InscricaoModel.listarPorEvento(evento.id);
      res.render('eventos/inscritos', { titulo: `Inscritos - ${evento.titulo}`, evento, inscritos });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = eventoController;