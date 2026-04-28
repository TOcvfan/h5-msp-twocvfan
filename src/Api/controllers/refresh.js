import 'dotenv/config';
import { cookieOptions } from '../middleware/cookieoptions.js';

export const refreshToken = async (req, res, knex, jwt) => {
    const response = (reply, status) => res.status(status).json(reply);

    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
        return response({ message: "Ikke logget ind", error: true }, 401);
    }

    try {
        // 🔐 verify refresh token
        const decoded = jwt.verify(
            refreshToken,
            process.env.SECRET_OR_KEY_REFRESH
        );

        const { id, counter } = decoded;

        // 🔍 hent bruger
        const user = await knex('bruger')
            .select('counter', 'role')
            .where({ id })
            .first();

        if (!user) {
            return response(
                { message: 'Bruger ikke fundet', error: true },
                404
            );
        }

        // 🔥 check counter (token rotation)
        if (user.counter !== counter) {
            return response(
                { message: 'Token mismatch - log ind igen', error: true },
                401
            );
        }

        const newCounter = user.counter + 1;

        // 🔄 opdater DB først (undgår race issues)
        await knex('bruger')
            .where({ id })
            .update({ counter: newCounter });

        // 🔐 nye tokens
        const newAccessToken = jwt.sign(
            { id, role: user.role },
            process.env.SECRET_OR_KEY_ACCESS,
            { expiresIn: '1h' }
        );

        const newRefreshToken = jwt.sign(
            { id, role: user.role, counter: newCounter },
            process.env.SECRET_OR_KEY_REFRESH,
            { expiresIn: '7d' }
        );

        // 🍪 sæt cookies
        res.cookie('accessToken', newAccessToken, cookieOptions);
        res.cookie('refreshToken', newRefreshToken, cookieOptions);

        return response({ success: true }, 200);
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return response(
                { message: 'Session udløbet - log ind igen', error: true },
                401
            );
        }

        console.error('REFRESH ERROR:', err);

        return response(
            { message: 'Server fejl', error: true },
            500
        );
    }
};