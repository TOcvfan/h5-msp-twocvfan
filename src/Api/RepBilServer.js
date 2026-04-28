import dotenv, { config } from 'dotenv';
config();
import express from 'express';

const app = express();
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
const dbUsername = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;
if (!dbUsername) {
    throw new Error('DB_USERNAME environment variables must be set');
}

if (!dbPassword) {
    throw new Error('DB_PASSWORD environment variables must be set');
}

import nodemailer from 'nodemailer';
import inLineCss from 'nodemailer-juice';
import { Strategy, ExtractJwt as _ExtractJwt } from 'passport-jwt';
import { handleRegister, handleSignin, handleGetUser, handleLogout } from './controllers/user.js';
const JwtStrategy = Strategy;
import passport from 'passport';
const ExtractJwt = _ExtractJwt;
import knex from 'knex';
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

import bookshelf from 'bookshelf';
import securePassword from './middleware/bookshelf-secure-password.js';
import { headersAuth } from './middleware/auth.js';
import { verifyCsrf, generateCsrfToken } from './middleware/cookieoptions.js';
import upload from './middleware/billeder.js';
const db = bookshelf(knexDb);
db.plugin(securePassword);
const corsOptions = {
    origin: '*',
};

app.use(cors(corsOptions));
import path, { join } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(`${serverPath}/billeder`, express.static(join(__dirname, 'billeder')));
app.use(express.static('public'));
app.get(serverPath + '/', (_req, res) => {
    res.sendFile(join(__dirname, 'public', 'index.html'));
});

const User = db.Model.extend({
    tableName: 'user',
    idAttribute: 'user_id',
    hasSecurePassword: true
});

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.ACCESS_SECRET
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

app.post('/login', generateCsrfToken, async (req, res) => { handleSignin(req, res, knexDb, bcrypt, jwt, dotenv) });

app.post('/refresh', verifyCsrf, async (req, res) => { refreshToken(req, res, knexDb, jwt) });

app.post('/newuser', async (req, res) => { handleRegister(req, res, User, jwt, dotenv, knexDb) });

app.get('/me', headersAuth(), async (req, res) => { handleGetUser(req, res, knexDb) });

app.post('/logout', verifyCsrf, (req, res) => { handleLogout(req, res) });

app.listen(PORT, () => {
    console.log(`App is running on ${PORT}`)
});