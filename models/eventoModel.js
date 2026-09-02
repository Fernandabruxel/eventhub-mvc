
/**
 * Model de Evento.
 */
const pool = require('../config/database');

const EventoModel = {
  /**
   * Cria um novo evento.
   * @async
   * @param {Object} dados
   * @returns {Promise<number>}
   * @throws {Error}
   */
  async criar({ titulo, descricao, data_evento, horario, local, capacidade, usuario_id }) {
    const [result] = await pool.execute(
      `INSERT INTO eventos (titulo, descricao, data_evento, horario, local, capacidade, usuario_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [titulo, descricao, data_evento, horario, local, capacidade, usuario_id]
    );
    return result.insertId;
  },

  /**
   * Lista todos os eventos, com filtro opcional de busca por titulo/local.
   * @async
   * @param {string} [busca]
   * @returns {Promise<Array<Object>>}
   * @throws {Error}
   */
  async listarTodos(busca) {
    if (busca) {
      const termo = `%${busca}%`;
      const [rows] = await pool.execute(
        `SELECT e.*, u.nome AS organizador_nome,
                (SELECT COUNT(*) FROM inscricoes i WHERE i.evento_id = e.id) AS total_inscritos
         FROM eventos e
         JOIN usuarios u ON u.id = e.usuario_id
         WHERE e.titulo LIKE ? OR e.local LIKE ?
         ORDER BY e.data_evento ASC`,
        [termo, termo]
      );
      return rows;
    }
    const [rows] = await pool.execute(
      `SELECT e.*, u.nome AS organizador_nome,
              (SELECT COUNT(*) FROM inscricoes i WHERE i.evento_id = e.id) AS total_inscritos
       FROM eventos e
       JOIN usuarios u ON u.id = e.usuario_id
       ORDER BY e.data_evento ASC`
    );
    return rows;
  },

  /**
   * Busca um evento pelo id, com dados do organizador e total de inscritos.
   * @async
   * @param {number} id
   * @returns {Promise<Object|null>}
   * @throws {Error}
   */
  async buscarPorId(id) {
    const [rows] = await pool.execute(
      `SELECT e.*, u.nome AS organizador_nome,
              (SELECT COUNT(*) FROM inscricoes i WHERE i.evento_id = e.id) AS total_inscritos
       FROM eventos e
       JOIN usuarios u ON u.id = e.usuario_id
       WHERE e.id = ? LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  },

  /**
   * Lista eventos criados por um organizador especifico.
   * @async
   * @param {number} usuarioId
   * @returns {Promise<Array<Object>>}
   * @throws {Error}
   */
  async listarPorOrganizador(usuarioId) {
    const [rows] = await pool.execute(
      `SELECT e.*, (SELECT COUNT(*) FROM inscricoes i WHERE i.evento_id = e.id) AS total_inscritos
       FROM eventos e WHERE e.usuario_id = ? ORDER BY e.data_evento ASC`,
      [usuarioId]
    );
    return rows;
  },

  /**
   * Atualiza um evento existente.
   * @async
   * @param {number} id
   * @param {Object} dados
   * @returns {Promise<void>}
   * @throws {Error}
   */
  async atualizar(id, { titulo, descricao, data_evento, horario, local, capacidade }) {
    await pool.execute(
      `UPDATE eventos SET titulo = ?, descricao = ?, data_evento = ?, horario = ?, local = ?, capacidade = ?, updated_at = NOW()
       WHERE id = ?`,
      [titulo, descricao, data_evento, horario, local, capacidade, id]
    );
  },

  /**
   * Exclui um evento pelo id.
   * @async
   * @param {number} id
   * @returns {Promise<void>}
   * @throws {Error}
   */
  async excluir(id) {
    await pool.execute('DELETE FROM eventos WHERE id = ?', [id]);
  }
};

module.exports = EventoModel;
