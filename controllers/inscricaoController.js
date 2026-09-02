/*Controller de inscricoes de participantes em eventos.
 */
const EventoModel = require('../models/eventoModel');
const InscricaoModel = require('../models/inscricaoModel');

const inscricaoController = {
  /**
   * Realiza a inscricao do usuario logado em um evento, validando
   * autenticacao, existencia do evento, vagas disponiveis e duplicidade.
   * @async
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   * @throws {Error}
   */
  async inscrever(req, res, next) {
    try {
      const eventoId = req.params.id;
      const usuarioId = req.session.usuario.id;

      const evento = await EventoModel.buscarPorId(eventoId);
      if (!evento) {
        req.session.flash = { tipo: 'erro', mensagem: 'Evento nao encontrado.' };
        return res.redirect('/eventos');
      }

      const totalInscritos = await InscricaoModel.contarPorEvento(eventoId);
      if (totalInscritos >= evento.capacidade) {
        req.session.flash = { tipo: 'erro', mensagem: 'Este evento ja atingiu a capacidade maxima.' };
        return res.redirect(`/eventos/${eventoId}`);
      }

      const jaInscrito = await InscricaoModel.buscarPorUsuarioEEvento(usuarioId, eventoId);
      if (jaInscrito) {
        req.session.flash = { tipo: 'erro', mensagem: 'Voce ja esta inscrito neste evento.' };
        return res.redirect(`/eventos/${eventoId}`);
      }

      await InscricaoModel.criar(usuarioId, eventoId);
      req.session.flash = { tipo: 'sucesso', mensagem: 'Inscricao realizada com sucesso!' };
      res.redirect('/inscricoes/minhas-inscricoes');
    } catch (err) {
      next(err);
    }
  },

  /**
   * Lista as inscricoes do usuario logado.
   * @async
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   * @throws {Error}
   */
  async minhasInscricoes(req, res, next) {
    try {
      const inscricoes = await InscricaoModel.listarPorUsuario(req.session.usuario.id);
      res.render('inscricoes/minhas-inscricoes', { titulo: 'Minhas inscricoes', inscricoes });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = inscricaoController;