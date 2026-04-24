import { cookieOptions } from '../middleware/cookieoptions.js';
import { randomUUID } from 'crypto';
const response = (reply, status, res) => res.status(status).json(reply);

const handleRegister = async (req, res, User, jwt, dotenv, knexDb, seedrandom) => {
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
            username,
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
    const b = 'username';

    knexDb(table).where(m, email).orWhere(b, username).then((user) => {
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

const handleSignin = (req, res, knexDb, bcrypt, jwt, dotenv) => {
    dotenv.config();
    let user_id
    const { user, password } = req.body;
    if (!user || !password) {
        return response({ message: 'password  user', error: true }, 400, res);
    }
    let accesstoken
    let payload = {};
    let refreshtoken
    //
    let counter;
    const table = 'user'
    const profile = 'profile'
    try {
        const result = await knexDb(table)
            .select('user_id', 'userpassword', 'counter')
            .where('email', user)
            .orWhere('username', user);

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
            process.env.SECRET_OR_KEY_ACCESS,
            { expiresIn: '15m' }
        );

        const refreshtoken = jwt.sign(
            { user_id: dbUser.user_id, counter },
            process.env.SECRET_OR_KEY_REFRESH,
            { expiresIn: '7d' }
        );

        await knexDb('user')
            .where({ user_id: dbUser.user_id })
            .increment('counter', 1);

        res.cookie('accesstoken', accesstoken, cookieOptions);
        res.cookie('refreshtoken', refreshtoken, cookieOptions);

        return response({
            auth: true,
            accesstoken,
            refreshtoken
        }, 200, res);
    } catch (err) {
        console.error(err);
        return response({ error: true, message: 'server error' }, 500, res);
    }

}

const handleGetUser = (req, res, knexDb) => {
    const id = req.params.id;
    if (!id) {
        return response({ message: 'id missing', error: true }, 400, res);
    }
    let user_id;
    const table = 'user'
    const profile = 'profile'
    let payload = {};
    let name;

    knexDb(table).leftOuterJoin(profile, `${table}.user_id`, `${profile}.user_id`)
        .select(`${profile}.name`, `${table}.email`, `${table}.username`, `${profile}.user_id`)
        .where(`${table}.user_id`, id)
        .then(user => {
            if (!user || user.length === 0) {
                return response({ message: 'User not found', error: true }, 404, res);
            }
            user_id = user[0].user_id;
            name = user[0].name;
            const username = user[0].username;
            const email = user[0].email;

            payload = { auth: true, name, email, username, id: user_id };
            response(payload, 200, res)
        }).catch(err => {
            console.log(err)
            response({ message: 'Database error', error: true }, 500, res)
        })

}


export default {
    handleRegister, handleSignin, handleGetUser
};
