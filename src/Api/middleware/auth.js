import jwt from 'jsonwebtoken';

const response = (reply, status, res) => res.status(status).json(reply);

export const headersAuth = (requiredRole = null) => {
    return (req, res, next) => {
        const token = req.cookies?.accessToken;

        if (!token) {
            return response({ message: 'Ikke logget ind', error: true }, 401, res);
        }

        try {
            const decoded = jwt.verify(
                token,
                process.env.SECRET_OR_KEY_ACCESS
            );

            req.user = decoded;

            // 🔐 Rolle check
            if (requiredRole && decoded.role !== requiredRole) {
                return response(
                    { message: 'Ingen adgang', error: true },
                    403,
                    res
                );
            }

            next();
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return response(
                    { message: 'Session udløbet', error: true },
                    401,
                    res
                );
            }

            return response(
                { message: 'Unauthorized', error: true },
                401,
                res
            );
        }
    };
};