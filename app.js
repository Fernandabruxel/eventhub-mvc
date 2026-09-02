/*Configuracao principal da aplicacao Express (EventHub - MVC).
 */
require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const eventoRoutes = require('./routes/eventoRoutes');
const inscricaoRoutes = require('./routes/inscricaoRoutes');
const { injetarUsuario } = require('./middlewares/authMiddleware');
const { naoEncontrado, tratarErro } = require('./middlewares/errorMiddleware');

const app = express();

app.use(helmet({
  contentSecurityPolicy: false
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 4
  }
}));

app.use(injetarUsuario);

app.get('/', (req, res) => res.redirect('/eventos'));
app.use('/auth', authRoutes);
app.use('/eventos', eventoRoutes);
app.use('/inscricoes', inscricaoRoutes);

app.use(naoEncontrado);
app.use(tratarErro);

module.exports = app;