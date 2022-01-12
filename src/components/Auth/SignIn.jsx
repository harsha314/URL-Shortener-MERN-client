import { useState, useRef } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

import { API_URL } from '../../env';
import LoadingButton from '../../utils/LoadingButton';

import frontEndError from '../../utils/frontEndError';

const SignIn = ({ user, setUser }) => {
    const [loading, setLoading] = useState('');

    const emailRef = useRef();
    const passwordRef = useRef();

    // 🕶️ 👀 🙈

    const showPassword = (e, id) => {
        const open = '👀';
        const close = '🕶️';
        e.target.value = e.target.value === open ? close : open;
        const inp = document.getElementById(id);
        inp.type = inp.type === 'password' ? 'text' : 'password';
    };

    const signIn = async (e) => {
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        e.preventDefault();
        setLoading('sign-in');
        try {
            if (!email) throw new frontEndError('Email cant be empty', 'email');

            if (password.length < 6)
                throw new frontEndError('Password is too short', 'password');

            const res = await axios.post(`${API_URL}/auth/signin`, {
                email: email,
                password: password
            });

            const { user: details, token } = res.data;

            localStorage.setItem('authToken', token);
            localStorage.setItem('userToken', details._id);
            setLoading('');
            setUser({ ...details });
        } catch (e) {
            const { response: res } = e;

            // console.log('Sign In', e.message);
            // console.log({ ...e });
            // console.log({ ...res });

            if (!res) {
                // console.log('no response');
                if (e.message === 'Network Error')
                    setUser({ internalServerError: true });
            } else if (res.status === 401)
                new frontEndError(res.data.error, 'password', '');
            else if (res.status === 404)
                new frontEndError('Invalid Credentials', 'password', '');
            else if (res.status === 422)
                new frontEndError(
                    res.data.errors[0].msg,
                    res.data.errors[0].param
                );
            setLoading('');
        }
    };

    if (user.email) {
        return <Redirect to="/" />;
    }

    return (
        <div
            className="row justify-content-center align-items-center"
            style={{ height: '50vh' }}
        >
            <div
                className="col-10 col-md-6 col-lg-4 col-xl-3"
                // style={{ maxWidth: '90vw' }}
            >
                <h1 className="text-center mb-3">Sign In</h1>
                <form>
                    <div className="mb-1">
                        <input
                            ref={emailRef}
                            className="form-control shadow-none"
                            type="email"
                            id="email"
                            placeholder="Email"
                            aria-describedby="email-help"
                        />
                        <div
                            className="form-text text-center opacity-0"
                            id="email-help"
                        >
                            {' \0'}
                        </div>
                    </div>
                    <div className="mb-1">
                        <div
                            className="input-group"
                            aria-describedby="password-help"
                        >
                            <input
                                ref={passwordRef}
                                className="form-control shadow-none"
                                type="password"
                                id="password"
                                placeholder="Password"
                            />
                            <input
                                type="button"
                                className="input-group-text shadow-none"
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

                    <div className="mb-1 text-center">
                        <LoadingButton
                            loading={loading}
                            id="sign-in"
                            onClick={signIn}
                            value={'Sign In'}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignIn;
