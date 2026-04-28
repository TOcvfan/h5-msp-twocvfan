'use client';

import useUser from '@/hooks/useUser';
import { api } from '@/lib/api';

export default function Dashboard() {

    const { user, loading } = useUser();

    const handleLogout = async () => {
        await api.post('/logout');
        window.location.href = '/login';
        try {
            await api.post('/logout');
        } catch (err) {
            console.error('Logout fejlede:', err);
        } finally {
            window.location.href = '/login';
            /*
            Hvorfor window.location.href?
    
            fordi det vil:
    
            ->  nulstille hele app state
            ->  sikre middleware kører igen
    
            router.push() kan nogle gange bevare state
            */
        }
    };

    if (loading) return <p>Loader...</p>;

    if (!user) return <p>Ikke logget ind</p>;

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Velkommen {user.name}</p>

            <button onClick={handleLogout}>
                Log ud
            </button>
        </div>
    );
}