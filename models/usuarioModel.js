/*Model de Usuario (organizador ou participante).
 */
const pool = require('../config/database');

const UsuarioModel = {
  /**
   * Cria um novo usuario.
   * @async
   * @param {{nome:string, email:string, senhaHash:string, tipo:string}} dados
   * @returns {Promise<number>} id do usuario criado
   * @throws {Error}
   */
  async criar({ nome, email, senhaHash, tipo }) {
    const [result] = await pool.execute(
      'INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)',
      [nome, email, senhaHash, tipo]
    );
    return result.insertId;
  },

  /**
   * Busca usuario pelo email.
   * @async
   * @param {string} email
   * @returns {Promise<Object|null>}
   * @throws {Error}
   */
  async buscarPorEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM usuarios WHERE email = ? LIMIT 1',
      [email]
    );
    return rows[0] || null;
  },

  /**
   * Busca usuario pelo id.
   * @async
   * @param {number} id
   * @returns {Promise<Object|null>}
   * @throws {Error}
   */
  async buscarPorId(id) {
    const [rows] = await pool.execute(
      'SELECT id, nome, email, tipo, created_at FROM usuarios WHERE id = ? LIMIT 1',
      [id]
    );
    return rows[0] || null;
  }
};

module.exports = UsuarioModel;
