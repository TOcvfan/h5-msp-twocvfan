import { cookieOptions } from '../middleware/cookieoptions.js';
import { randomUUID } from 'crypto';
const response = (reply, status, res) => res.status(status).json(reply);

export const handleRegister = async (req, res, User, jwt, dotenv, knexDb) => {
    dotenv.config();
    let user_id = randomUUID();
    const profile = 'profile';
    const table = 'user';
    const { email, password, name, username } = req.body;
    let payload = {};
    //user_id = seedrandom(name + username + email);

    const newUser = async () => {
        const user = new User({
            user_id,
            email,
            password
        });
        return await user.save(null, { method: 'insert' }).then((user) => {
            const newUser = {
                user_id,
                name,
            }
            knexDb.insert(newUser).into(profile)
                .then(() => {
                    response(payload, 201, res)
                }).catch(e => response({ message: e + '1', error: true }, 400, res))
        }).catch(e => response({ message: e + '2', error: true }, 400, res))
    }

    const m = 'email';

    knexDb(table).where(m, email).then((user) => {
        if (user.length != 0) {
            return response({ message: 'already exists', error: true }, 409, res)
        } else {
            try {
                newUser()
            } catch (e) {
                if (e.errno == 1062) {
                    return response({
                        error: true,
                        message: 'duplicate entry'
                    }, 409, res)
                } else {
                    return response({
                        error: true,
                        message: 'an error accurred ' + e
                    }, 409, res)
                }
            }
        }
    }).catch((e) => response({
        error: true,
        message: 'error ' + e
    }, 409, res))
}

export const handleSignin = async (req, res, knexDb, bcrypt, jwt, dotenv) => {
    dotenv.config();
    let user_id
    const { email, password } = req.body;
    if (!email || !password) {
        return response({ message: 'password and email are required', error: true }, 400, res);
    }
    let accesstoken
    let payload = {};
    let refreshtoken
    //
    let counter;
    const table = 'user'
    const profile = 'profile'
    try {
        const result = await knexDb(table) // --> await giver fejl
            .select('user_id', 'userpassword', 'counter')
            .where('email', email);

        if (!result.length) {
            return response({ error: true, message: 'user not found' }, 404, res);
        }

        const dbUser = result[0];
        const valid = await bcrypt.compare(password, dbUser.userpassword);
        if (!valid) {
            return response({ error: true, message: 'wrong password' }, 401, res);
        }

        const counter = dbUser.counter + 1;

        const accesstoken = jwt.sign(
            { user_id: dbUser.user_id },
            process.env.ACCESS_SECRET,
            { expiresIn: 3600 }
        );

        const refreshtoken = jwt.sign(
            { user_id: dbUser.user_id, counter },
            process.env.REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        await knexDb('user')
            .where({ user_id: dbUser.user_id })
            .increment('counter', 1);

        res.cookie('accessToken', accesstoken, cookieOptions);
        res.cookie('refreshToken', refreshtoken, cookieOptions);

        return response({
            auth: true
        }, 200, res);
    } catch (err) {
        console.error(err);
        return response({ error: true, message: 'server error' }, 500, res);
    }

}

export const handleGetUser = async (req, res, knexDb) => {
    const userId = req.user.id; // 🔥 fra token

    try {
        const user = await knexDb('user')
            .leftOuterJoin('profile', 'user.user_id', 'profile.user_id')
            .select(
                'profile.name',
                'user.email',
                'user.username',
                'profile.user_id'
            )
            .where('user.user_id', userId)
            .first();

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                error: true,
            });
        }

        return res.json({
            auth: true,
            name: user.name,
            email: user.email,
            id: user.user_id,
        });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: 'Database error',
            error: true,
        });
    }
};

export const handleLogout = (req, res) => {
    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/' });
    return response({ auth: false, message: 'logged out' }, 200, res);
}