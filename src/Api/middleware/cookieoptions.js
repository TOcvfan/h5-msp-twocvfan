const isProduction = process.env.NODE_ENV === 'production';
export const cookieOptions = {
    httpOnly: true,
    secure: isProduction ? true : false, // false i dev
    sameSite: isProduction ? 'none' : 'lax', // 'lax' virker på localhost uden https
    path: '/',
    partitioned: isProduction ? true : false,
};