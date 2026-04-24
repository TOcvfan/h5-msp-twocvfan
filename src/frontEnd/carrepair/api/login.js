import { api } from '@/config/config';

const login = async (data) => {
    let res;

    const login = await api().post(`/api/auth/login`, data).then(response => {
        res = response.data.message
        return res
    }).catch((error) => {
        throw error.response.data;
    })
    return login
}

export default login;