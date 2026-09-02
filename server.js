/*Ponto de entrada da aplicacao EventHub.
 */
require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`EventHub rodando na porta ${PORT}`);
});