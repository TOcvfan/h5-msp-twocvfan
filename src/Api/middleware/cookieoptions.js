import crypto from 'crypto';
const isProduction = process.env.NODE_ENV === 'production';
export const cookieOptions = {
    httpOnly: true,
    secure: isProduction ? true : false, // false i dev
    sameSite: isProduction ? 'none' : 'lax', // 'lax' virker på localhost uden https
    path: '/',
};

export const generateCsrfToken = (req, res, next) => {
    const csrfToken = crypto.randomBytes(32).toString('hex');

    res.cookie('csrfToken', csrfToken, {
        httpOnly: false, // 🔥 skal kunne læses i frontend
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
    });

    next();
};

export const verifyCsrf = (req, res, next) => {
    const csrfCookie = req.cookies?.csrfToken;
    const csrfHeader = req.headers['x-csrf-token'];

    if (!csrfCookie || !csrfHeader) {
        return res.status(403).json({ message: 'CSRF token mangler' });
    }

    if (csrfCookie !== csrfHeader) {
        return res.status(403).json({ message: 'CSRF token mismatch' });
    }

    next();
};