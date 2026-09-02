/*Model de Inscricao.
 */
const pool = require('../config/database');

const InscricaoModel = {
  /**
   * Cria uma inscricao de um usuario em um evento.
   * @async
   * @param {number} usuarioId
   * @param {number} eventoId
   * @returns {Promise<number>}
   * @throws {Error}
   */
  async criar(usuarioId, eventoId) {
    const [result] = await pool.execute(
      'INSERT INTO inscricoes (usuario_id, evento_id) VALUES (?, ?)',
      [usuarioId, eventoId]
    );
    return result.insertId;
  },

  /**
   * Verifica se ja existe inscricao do usuario no evento.
   * @async
   * @param {number} usuarioId
   * @param {number} eventoId
   * @returns {Promise<Object|null>}
   * @throws {Error}
   */
  async buscarPorUsuarioEEvento(usuarioId, eventoId) {
    const [rows] = await pool.execute(
      'SELECT * FROM inscricoes WHERE usuario_id = ? AND evento_id = ? LIMIT 1',
      [usuarioId, eventoId]
    );
    return rows[0] || null;
  },

  /**
   * Lista as inscricoes de um usuario, com dados do evento.
   * @async
   * @param {number} usuarioId
   * @returns {Promise<Array<Object>>}
   * @throws {Error}
   */
  async listarPorUsuario(usuarioId) {
    const [rows] = await pool.execute(
      `SELECT i.*, e.titulo, e.data_evento, e.horario, e.local
       FROM inscricoes i JOIN eventos e ON e.id = i.evento_id
       WHERE i.usuario_id = ? ORDER BY i.data_inscricao DESC`,
      [usuarioId]
    );
    return rows;
  },

  /**
   * Lista os inscritos de um evento (para o organizador).
   * @async
   * @param {number} eventoId
   * @returns {Promise<Array<Object>>}
   * @throws {Error}
   */
  async listarPorEvento(eventoId) {
    const [rows] = await pool.execute(
      `SELECT i.*, u.nome, u.email
       FROM inscricoes i JOIN usuarios u ON u.id = i.usuario_id
       WHERE i.evento_id = ? ORDER BY i.data_inscricao ASC`,
      [eventoId]
    );
    return rows;
  },

  /**
   * Conta quantos inscritos um evento possui.
   * @async
   * @param {number} eventoId
   * @returns {Promise<number>}
   * @throws {Error}
   */
  async contarPorEvento(eventoId) {
    const [rows] = await pool.execute(
      'SELECT COUNT(*) AS total FROM inscricoes WHERE evento_id = ?',
      [eventoId]
    );
    return rows[0].total;
  }
};

module.exports = InscricaoModel;