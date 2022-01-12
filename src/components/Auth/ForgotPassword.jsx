import axios from 'axios';
import { useState, useRef } from 'react';

import { Redirect } from 'react-router-dom';
import { API_URL } from '../../env';
import frontEndError from '../../utils/frontEndError';

import LoadingButton from '../../utils/LoadingButton';

const ForgotPassword = ({ user, setUser }) => {
    const [email, setEmail] = useState(undefined);
    const [loading, setLoading] = useState('');
    const [passwordChange, setPasswordChange] = useState(false);

    const validEmailRef = useRef(undefined);
    const idRef = useRef();
    const pass1 = useRef('');
    const pass2 = useRef('');
    const otpRef = useRef('');

    const onEmail = (e) => {
        setEmail(e.target.value);
    };

    const showPassword = (e, id) => {
        const open = '👀';
        const close = '🕶️';
        e.target.value = e.target.value === open ? close : open;
        const inp = document.getElementById(id);
        inp.type = inp.type === 'password' ? 'text' : 'password';
    };

    const sendOtp = async (e) => {
        e.preventDefault();
        setLoading(e.target.id);
        try {
            if (!email) throw new frontEndError('Email cant be empty', 'email');
            const res = await axios.post(`${API_URL}/auth/resendotp`, {
                email
            });
            console.log(res);
            idRef.current = res.data._id;
            validEmailRef.current = email;
            new frontEndError('OTP sent', 'email', '');
            setLoading('');
        } catch (e) {
            const { response: res } = e;
            console.log('send otp', res, e.message);
            if (!res);
            else if (res.status === 404)
                new frontEndError('No user found', 'email');
            setLoading('');
        }
    };

    const resetPassword = async (e) => {
        e.preventDefault();
        setLoading(e.target.id);
        try {
            const _id = idRef.current;
            const otp = otpRef.current.value;
            const password1 = pass1.current.value;
            const password2 = pass2.current.value;

            if (!otp) throw new frontEndError('OTP cant be empty', 'otp');
            if (!password1)
                throw new frontEndError('Password cant be empty', 'password-1');
            if (password1 !== password2)
                throw new frontEndError('Passwords dont match', 'password-2');

            const res = await axios.put(`${API_URL}/auth/resetpassword`, {
                _id,
                otp,
                password: password1
            });
            console.log('reset Pass', res);
            setPasswordChange(true);
            setLoading('');
        } catch (e) {
            console.log('reset password', e.message);
            const { response: res } = e;
            console.log(res);
            if (!res);
            else if (res.status === 401)
                new frontEndError(res.data.error, 'otp');
            setLoading('');
        }
    };

    if (user.email) {
        return <Redirect to="/" />;
    }

    if (passwordChange) {
        return <Redirect to="/signin" />;
    }

    return (
        <div
            className="row justify-content-center align-items-center mt-5"
            style={{ height: '50vh' }}
        >
            <div className="col-10 col-md-8 col-lg-4 col-xl-3">
                <h1 className="text-center mb-3">Reset Password</h1>
                <form>
                    <div className="mb-1">
                        <div
                            className="input-group"
                            aria-describedby="email-help"
                        >
                            <input
                                className="form-control"
                                type="email"
                                id="email"
                                placeholder="Email"
                                onChange={onEmail}
                            />
                            <LoadingButton
                                loading={loading}
                                className="shadow-none"
                                id="send-otp"
                                value="Send OTP"
                                cssType="secondary"
                                title="Send OTP to Enable the fields"
                                onClick={sendOtp}
                            />
                        </div>
                        <div
                            className="form-text text-center opacity-0"
                            id="email-help"
                        >
                            {' \0'}
                        </div>
                    </div>
                    <div className="mb-1">
                        <input
                            ref={otpRef}
                            className="form-control"
                            type="text"
                            id="otp"
                            disabled={
                                !validEmailRef.current ||
                                email !== validEmailRef.current
                            }
                            placeholder="OTP"
                            aria-describedby="otp-help"
                        />
                        <div
                            className="form-text text-center opacity-0"
                            id="otp-help"
                        >
                            {' \0'}
                        </div>
                    </div>
                    <div className="mb-1">
                        <div
                            className="input-group"
                            aria-describedby="password1-help"
                        >
                            <input
                                ref={pass1}
                                className="form-control"
                                type="password"
                                id="password1"
                                disabled={
                                    !validEmailRef.current ||
                                    email !== validEmailRef.current
                                }
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
                            id="password-help"
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
                                ref={pass2}
                                className="form-control"
                                type="password"
                                id="password2"
                                placeholder="Password Again"
                                disabled={
                                    !validEmailRef.current ||
                                    email !== validEmailRef.current
                                }
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
                            id="password-help"
                        >
                            {' \0'}
                        </div>
                    </div>

                    <div className="mb-1 text-center">
                        <LoadingButton
                            loading={loading}
                            id="reset"
                            value={'Reset Password'}
                            onClick={resetPassword}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
