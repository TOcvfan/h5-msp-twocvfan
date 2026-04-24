const dotenv = require('dotenv');
dotenv.config();
const express = require('express');

const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto')
const dbUsername = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;
if (!dbUsername) {
    throw new Error('DB_USERNAME environment variables must be set');
}

if (!dbPassword) {
    throw new Error('DB_PASSWORD environment variables must be set');
}

const nodemailer = require('nodemailer');
const inLineCss = require('nodemailer-juice');
const seedrandom = require('./middleware/idGenerator');
const passport = require('passport');
const passportJwt = require('passport-jwt');
const { handleRegister, handleSignin, handleGetUser } = require('./controllers/user').default;
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;
const knex = require('knex');
const knexDb = knex({
    client: 'mysql2',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME
    }
});
const PORT = 3004;
const serverPath = '/bildata'

const bookshelf = require('bookshelf');
const securePassword = require('./middleware/bookshelf-secure-password');
const { headersAuth, verifyRefresh } = require('./middleware/auth');
const upload = require('./middleware/billeder');
const db = bookshelf(knexDb);
db.plugin(securePassword);
const corsOptions = {
    origin: '*',
};

app.use(cors(corsOptions));
const path = require('path');

app.use(`${serverPath}/billeder`, express.static(path.join(__dirname, 'billeder')));
app.use(express.static('public'));
app.get(serverPath + '/', (_req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const User = db.Model.extend({
    tableName: 'user',
    idAttribute: 'user_id',
    hasSecurePassword: true
});

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_OR_KEY_ACCESS
};

const strategy = new JwtStrategy(opts, (payload, next) => {
    User.forge({ user_id: payload.user_id }).fetch().then(res => {
        next(null, res);
    });
});

passport.use(strategy);
app.use(passport.initialize());
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use('/robots.txt', (_req, res, _next) => {
    res.type('text/plain')
    res.send("User-agent: *\nAllow: /");
});

app.post('/login', async (req, res) => { handleSignin(req, res, knexDb, bcrypt, jwt, dotenv) });

app.post('/newuser', async (req, res) => { handleRegister(req, res, User, jwt, dotenv, knexDb, seedrandom) });

app.get('/getuser/:id', headersAuth, async (req, res) => { handleGetUser(req, res, knexDb) });

app.listen(PORT, () => {
    console.log(`App is running on ${PORT}`)
});