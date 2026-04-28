import axios from 'axios';

const isProd = process.env.NODE_ENV === 'production';

const baseURL = isProd
    ? 'http://din-backend-url/bilserver'
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3004';

async function callBackend({ cookie, path, method, body }) {
    return axios({
        url: `${baseURL}/${path}`,
        method,
        data: body,
        headers: {
            Cookie: cookie,
            'Content-Type': 'application/json',
        },
        withCredentials: true,
        validateStatus: () => true,
    });
}

export async function handler(req, { params }) {
    const path = params.path.join('/');
    const body = req.method !== 'GET' ? await req.json() : undefined;

    let cookie = req.headers.get('cookie');

    try {
        let res = await callBackend({
            cookie,
            path,
            method: req.method,
            body,
        });

        // 🔥 Hvis token er udløbet
        if (res.status === 401) {
            const refreshRes = await callBackend({
                cookie,
                path: 'auth/refresh',
                method: 'POST',
            });

            if (refreshRes.status === 200) {
                // 🔥 opdater cookie fra refresh response
                const newCookie = refreshRes.headers['set-cookie'];
                if (newCookie) {
                    cookie = newCookie;
                }

                // 🔥 retry med NY cookie
                res = await callBackend({
                    cookie,
                    path,
                    method: req.method,
                    body,
                });
            } else {
                return new Response(
                    JSON.stringify({ message: 'Unauthorized' }),
                    { status: 401 }
                );
            }
        }

        const response = new Response(JSON.stringify(res.data), {
            status: res.status,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // 🔥 send cookies til browser
        const setCookie =
            res.headers['set-cookie'] ||
            (res.status === 401 ? null : undefined);

        if (setCookie) {
            response.headers.set('set-cookie', setCookie);
        }

        return response;
    } catch (error) {
        console.error('BFF ERROR:', error);

        return new Response(
            JSON.stringify({ message: 'Server error' }),
            { status: 500 }
        );
    }
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };