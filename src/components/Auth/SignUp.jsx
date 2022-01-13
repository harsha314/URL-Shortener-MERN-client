import { useState, useRef } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

import { API_URL } from '../../env';

import frontEndError from '../../utils/frontEndError';
import LoadingButton from '../../utils/LoadingButton';

const SignUp = ({ user, setUser }) => {
    const [loading, setLoading] = useState(false);

    const fnameRef = useRef();
    const lnameRef = useRef();
    const emailRef = useRef();
    const pass1Ref = useRef();
    const pass2Ref = useRef();

    const showPassword = (e, id) => {
        const open = '👀';
        const close = '🕶️';
        e.target.value = e.target.value === open ? close : open;
        const inp = document.getElementById(id);
        inp.type = inp.type === 'password' ? 'text' : 'password';
    };

    const signUp = async (e) => {
        const fname = fnameRef.current.value;
        const lname = lnameRef.current.value;
        const email = emailRef.current.value;
        const password1 = pass1Ref.current.value;
        const password2 = pass2Ref.current.value;
        e.preventDefault();
        setLoading(true);
        try {
            if (fname.length < 3)
                throw new frontEndError('First Name is too short', 'name');

            if (!email) throw new frontEndError('email cant be empty', 'email');

            if (password1 !== password2)
                throw new frontEndError("Passwords don't match", 'password2');

            if (password1.length < 6)
                throw new frontEndError('Password is too short', 'password1');

            // console.log(fname, lname, email, password1, password2);

            const res = await axios.post(`${API_URL}/auth/signup`, {
                fname,
                lname,
                email,
                password: password1
            });

            const { user: details, token } = res.data;

            setLoading('');
            localStorage.setItem('authToken', token);
            localStorage.setItem('userToken', details._id);
            setUser({ ...details });
        } catch (e) {
            console.log('Sign Up', e.message);
            const { response: res } = e;
            if (!res) {
                if (e.message === 'Network Error')
                    setUser({ internalServerError: true });
            } else if (res.status === 405)
                new frontEndError(res.data.error, res.data.cause);
            else if (res.status === 422)
                new frontEndError('Invalid Email', 'email');
            setLoading('');
        }
    };

    if (user.email) {
        return <Redirect to="/" />;
    }

    return (
        <div className="row justify-content-center align-items-center mt-5">
            <div className="col-10 col-md-6 col-lg-4 col-xl-3">
                <h1 className="mb-3 text-center">Sign Up</h1>
                <form>
                    <div className="mb-2">
                        <div className="input-group">
                            <input
                                ref={fnameRef}
                                type="text"
                                className="form-control shadow-none"
                                id="name"
                                placeholder="First Name"
                            />
                            <input
                                ref={lnameRef}
                                type="text"
                                className="form-control shadow-none"
                                placeholder="Last Name"
                            />
                        </div>
                        <div
                            className="form-text text-center opacity-0"
                            id="name-help"
                        >
                            {' h\0'}
                        </div>
                    </div>
                    <div className="mb-1">
                        <input
                            ref={emailRef}
                            className="form-control shadow-none"
                            type="email"
                            id="email"
                            placeholder="Email"
                        />
                        <div
                            className="form-text text-center opacity-0"
                            id="email-help"
                        >
                            {' \0'}
                        </div>
                    </div>
                    <div className="mb-1">
                        <div className="input-group">
                            <input
                                ref={pass1Ref}
                                className="form-control shadow-none"
                                type="password"
                                id="password1"
                                placeholder="Password"
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
                        <div
                            className="input-group"
                            aria-describedby="password2-help"
                        >
                            <input
                                ref={pass2Ref}
                                className="form-control shadow-none"
                                type="password"
                                id="password2"
                                placeholder="Password Again"
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
                            id="password2-help"
                        >
                            {' \0'}
                        </div>
                    </div>

                    <div className="mb-3 text-center">
                        <LoadingButton
                            loading={loading}
                            onClick={signUp}
                            type="button"
                            id="sign up"
                        >
                            Sign Up
                        </LoadingButton>
                    </div>
                    <div className="mb-3 text-secondary text-center">
                        For dummy email , use{' '}
                        <a
                            href="https://ethereal.email"
                            target="_blank"
                            rel="noreferrer"
                        >
                            ethereal.email
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
