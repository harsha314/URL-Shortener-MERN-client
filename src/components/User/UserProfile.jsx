import { useState } from 'react';
import Email from './Email';
import Password from './Password';
import Username from './Username';
import LoadingButton from '../../utils/LoadingButton';
import axios from 'axios';
import { API_URL } from '../../env';

const UserProfile = ({ user, setUser }) => {
    const [loading, setLoading] = useState('');

    const deleteAccount = async (e) => {
        e.preventDefault();
        setLoading('delete');
        const userToken = localStorage.userToken;
        const authToken = localStorage.authToken;
        if (!userToken || !authToken) setUser({});
        try {
            await axios.delete(`${API_URL}/user/${userToken}`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });

            localStorage.removeItem('authToken');
            localStorage.removeItem('userToken');
            setLoading('');
            setUser({});
        } catch (e) {
            console.log(e.message);
            setLoading('');
        }
    };

    return (
        <div className="p-5 row justify-content-center">
            <div className="card p-3" style={{ maxWidth: '27rem' }}>
                <Username user={user} setUser={setUser} />
                <Email user={user} setUser={setUser} />
                <Password user={user} setUser={setUser} />
                <div className="col text-center py-3">
                    <LoadingButton
                        loading={loading}
                        id="delete"
                        value="delete"
                        cssType="danger"
                        onClick={deleteAccount}
                    />
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
