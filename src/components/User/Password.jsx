import { useState } from 'react';
import axios from 'axios';

import { API_URL } from '../../env';
import frontEndError from '../../utils/frontEndError';

import LoadingButton from '../../utils/LoadingButton';

const Password = ({ user, setUser }) => {
    const [mode, setMode] = useState('view');

    const setEditMode = (e) => {
        setMode('edit');
    };

    const setViewMode = (e) => {
        setMode('view');
    };

    return (
        <div className="row align-items-stretch">
            <div className="col-4 my-auto">
                <p className="fw-bold my-auto">Password</p>
            </div>
            <div
                className={
                    'col-8 d-flex justify-content-end ' +
                    (mode === 'edit' ? 'py-2' : '')
                }
            >
                <input
                    type="button"
                    value="edit"
                    className="btn btn-link m-2"
                    onClick={setEditMode}
                    disabled={mode === 'edit'}
                />
            </div>
            {mode === 'view' ? (
                ''
            ) : (
                <EditPassword
                    user={user}
                    setUser={setUser}
                    setViewMode={setViewMode}
                />
            )}
        </div>
    );
};

const EditPassword = ({ user, setUser, setViewMode }) => {
    const [password, setPassword] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [loading, setLoading] = useState('');

    const onPassword = (e) => {
        e.preventDefault();
        setPassword(e.target.value);
    };

    const onPassword1 = (e) => {
        e.preventDefault();
        setPassword1(e.target.value);
        document.getElementById('password-help').textContent =
            e.target.value === password2 ? ' \0' : 'passwords dont match';
    };

    const onPassword2 = (e) => {
        e.preventDefault();
        setPassword2(e.target.value);
        document.getElementById('password-help').textContent =
            e.target.value === password1 ? ' \0' : 'passwords dont match';
    };

    const showPassword = (e, id) => {
        const open = '👀';
        const close = '🕶️';
        e.target.value = e.target.value === open ? close : open;
        const inp = document.getElementById(id);
        inp.type = inp.type === 'password' ? 'text' : 'password';
    };

    const changePassword = async (e) => {
        e.preventDefault();
        setLoading(e.target.id);
        const authToken = localStorage.authToken;
        const userToken = localStorage.userToken;
        setLoading(e.target.id);

        if (!authToken || !userToken) setUser({});
        try {
            if (!password)
                throw new frontEndError('Password cant be empty', 'password');

            if (!password1)
                throw new frontEndError('Password cant be empty', 'password1');

            if (password1 !== password2)
                throw new frontEndError('Passwords dont match', 'password1');

            const oldPassword = password;
            const newPassword = password1;

            const res = await axios.put(
                `${API_URL}/user/${userToken}/changepassword`,
                { oldPassword, newPassword },
                { headers: { Authorization: `Bearer ${authToken}` } }
            );
            const { token } = res.data;
            setPassword('');
            setPassword1('');
            setPassword2('');
            document.getElementById('password').value = '';
            document.getElementById('password1').value = '';
            document.getElementById('password2').value = '';
            localStorage.setItem('authToken', token);
            new frontEndError('Password Changed', 'password2', '');
            setLoading('');
            setUser({ ...user, token });
        } catch (e) {
            console.log('Change Password', e.message);
            console.log(e.response);
            setLoading('');
        }
    };
    return (
        <div>
            <div className="mb-1">
                <div className="input-group" aria-describedby="password-help">
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="Current Password"
                        onChange={onPassword}
                    />
                    <input
                        type="button"
                        className="input-group-text"
                        value={'🕶️'}
                        onClick={(e) => showPassword(e, 'password')}
                    />
                </div>
                <div
                    className="form-text text-center opacity-0"
                    id="password-help"
                >
                    {' \0'}
                </div>
            </div>
            <div className="mb-2">
                <div className="input-group">
                    <input
                        type="password"
                        className="form-control"
                        id="password1"
                        placeholder="New Password"
                        onChange={onPassword1}
                    />
                    <input
                        type="button"
                        className="input-group-text"
                        value={'🕶️'}
                        onClick={(e) => showPassword(e, 'password1')}
                    />
                </div>
                <div
                    className="form-text text-center opacity-0"
                    id="password1-help"
                >
                    {' \0'}
                </div>
            </div>
            <div className="mb-1">
                <div className="input-group">
                    <input
                        type="password"
                        className="form-control"
                        id="password2"
                        placeholder="New Password again"
                        onChange={onPassword2}
                    />
                    <input
                        type="button"
                        className="input-group-text"
                        value={'🕶️'}
                        onClick={(e) => showPassword(e, 'password2')}
                    />
                </div>
                <div
                    className="form-text text-center opacity-0"
                    id={'password2-help'}
                >
                    {' \0'}
                </div>
            </div>
            <div className="d-flex justify-content-evenly">
                <div className="flex-grow-0">
                    <LoadingButton
                        loading={loading}
                        className={'flex-grow-0'}
                        id="change-password"
                        value="Save"
                        onClick={changePassword}
                        disabled={loading || password1 !== password2}
                    />
                </div>

                <div className="flex-grow-0">
                    <input
                        type="button"
                        className="btn btn-secondary"
                        value="Cancel"
                        onClick={setViewMode}
                        disabled={loading}
                    />
                </div>
            </div>
        </div>
    );
};

export default Password;
