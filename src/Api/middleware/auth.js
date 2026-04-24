import 'dotenv/config';
import jwt from 'jsonwebtoken';
const response = (reply, status, res) => res.status(status).send(reply);
export const headersAuth = (role, id) => {
    return (req, res, next) => {
        const token = req.cookies.accesstoken || req.header('Authorization').replace('Bearer ', '');
        if (!token) {
            return response({ message: 'token mangler', error: true }, 401, res);
        }

        try {
            const decodedUser = jwt.verify(token, process.env.SECRET_OR_KEY_ACCESS);
            req.user = decodedUser;
            if (id && req.params.id != decodedUser.id) {
                return response({ message: 'nix', error: true }, 401, res);
            }

            if (role) {
                if (decodedUser.role !== 'ADMIN') {
                    if (role === 'BRUGER') {
                        if (decodedUser.role === role) {
                            response({ message: 'nix', error: true }, 401, res);
                        }
                    } else if (decodedUser.role !== role) {
                        return response({ message: 'nix', error: true }, 401, res);
                    }
                }
            } //*/

            next();

        } catch (e) {
            if (e == 'TokenExpiredError: jwt expired') {
                return response({ message: 'venligst log ind igen', error: true }, 401, res);
            } else return response({ message: 'unauthorized ' + e, error: true }, 401, res);
        }
    }
}

export const verifyRefresh = (id, token, tal) => {
    try {
        const decoded = jwt.verify(token, process.env.SECRET_OR_KEY_REFRESH);
        if (decoded.id !== Number(id)) {
            return { error: true, message: 'Ugyldig token' }
        }

        if (decoded.counter != tal) {
            return { error: true, message: 'Forkert version, log ind igen' }
        }

        return { error: false }
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return { message: 'token udløbet, venligst log ind igen', error: true, errMess: err }
        } else return { message: 'unauthorized ' + e, error: true }
    }
};