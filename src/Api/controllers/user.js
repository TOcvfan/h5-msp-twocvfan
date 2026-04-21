const fs = require('node:fs');
const response = (reply, status, res) => res.status(status).send(reply);
let payload = {};

const handleRegister = async (req, res, User, jwt, dotenv, knexDb, seedrandom) => {
    dotenv.config();
    let user_id
    const profile = 'profile';
    const table = 'user';
    const { email, password, name, username } = req.body;
    user_id = seedrandom(navn + username + email);

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
                    const imagePath = `./images/${user_id}`
                    if (!fs.existsSync(imagePath)) {
                        fs.mkdirSync(imagePath, { recursive: true });
                    }
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
    let refreshtoken
    //
    let counter;
    const table = 'user'
    const profile = 'profile'

    const loadUser = () => {
        return knexDb(table).select(`counter`, 'user_id')
            .where(`email`, user)
            .orWhere(`username`, user)
            .then(user => {
                user_id = user[0].user_id;
                counter = user[0].counter + 1;

                refreshtoken = jwt.sign({ user_id, counter }, process.env.SECRET_OR_KEY_REFRESH, {
                    expiresIn: 7 * 24 * 3600
                });
                accesstoken = jwt.sign({ user_id }, process.env.SECRET_OR_KEY_ACCESS, {
                    expiresIn: 1,
                });
                payload = { auth: true, refreshtoken, accesstoken };
            }).catch(err => {
                console.log(err)
                response({ message: err, error: true }, 400, res)
            }).then(() => {
                knexDb(table)
                    .where({ user_id })
                    .increment('counter', 1).then(() =>
                        response(payload, 200, res))
            })
            .catch(err => {
                //console.log(err)
                response({ message: 'kunne ikke hente user ' + err, error: true }, 400, res)
            })
    }

    const sammenlignPassword = (pass) => {
        bcrypt.compareSync(password, pass) === true ?
            loadUser() : response({ name: 'password', message: 'Forkert kode', error: true }, 409, res)
    }

    knexDb.select('userpassword').from(table)
        .where('email', '=', user)
        .orWhere('username', user)
        .then(data => {
            data[0] === undefined ? response({ name: 'user', message: user, error: true }, 409, res) : sammenlignPassword(data[0].userpassword)
        })
        .catch(err => response({ message: err, error: true }, 400, res));
}

const handleGetUser = (req, res, knexDb) => {
    const table = 'user'
    const profile = 'profile'
    let name;

    knexDb(table).leftOuterJoin(profile, `${table}.user_id`, `${profile}.user_id`)
        .select(`${profile}.name`, `${table}.email`, `${table}.username`, `${profile}.user_id`)
        .where(`${table}.email`, user)
        .orWhere(`${table}.username`, user)
        .then(user => {
            user_id = user[0].user_id;
            name = user[0].name;
            const user = user[0].username;
            const email = user[0].email;

            payload = { auth: true, name, email, user, id: user_id };
            response(payload, 200, res)
        }).catch(err => {
            console.log(err)
            response({ message: err, error: true }, 400, res)
        })

}


module.exports = {
    handleRegister, handleSignin, handleGetUser
};
