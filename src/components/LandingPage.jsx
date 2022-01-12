import Urls from './User/Urls';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

import { API_URL } from '../env';
import LoadingButton from '../utils/LoadingButton';
import frontEndError from '../utils/frontEndError';

const LandingPage = ({ user, setUser }) => {
    const [urls, setUrls] = useState([]);
    const [urlsLoading, setUrlsLoading] = useState(false);

    useEffect(() => {
        const loadUrls = async () => {
            try {
                if (!user.email) {
                    setUrls([]);
                    return;
                }
                const authToken = localStorage.getItem('authToken');
                if (!authToken) {
                    console.log('no token(s)');
                    return;
                }
                setUrlsLoading(true);

                // console.log('Landing Page', user._id);
                const res = await axios.get(`${API_URL}/user/${user._id}`, {
                    headers: { Authorization: `Bearer ${authToken}` }
                });
                setUrlsLoading(false);
                setUrls(res.data.ownedUrls);
            } catch (e) {
                console.log('LandingPage', e.message);
                setUrls([]);
                setUrlsLoading(false);
            }
        };
        loadUrls();
        return () => {
            setUrls([]);
        };
    }, [user]);

    if (urlsLoading) {
        return (
            <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: '90vh' }}
            >
                <div className="spinner-grow"></div>
            </div>
        );
    }

    if (!user.email) {
        return (
            <div className="text-center my-3">
                <h1 className="mb-3"> Sign-In to view your shortened URLs. </h1>
                <p className="fs-6">
                    Recommended Browser : Chromium & Chrome Based Browsers
                </p>
            </div>
        );
    }

    if (!user.otpVerified) {
        return <VerifyUser user={user} setUser={setUser} />;
    }

    return (
        <div className="">
            <Urls urls={urls} setUrls={setUrls} type={'old-card'} />
        </div>
    );
};

const VerifyUser = ({ user, setUser }) => {
    const [loading, setLoading] = useState('');
    const otpRef = useRef();

    const verify = async (e) => {
        setLoading(e.target.id);
        try {
            await axios.post(
                `${API_URL}/user/${localStorage.userToken}/verify`,
                { otp: otpRef.current.value }
            );
            setLoading('');
            setUser({ ...user, otpVerified: true });
        } catch (e) {
            console.log(e.message);
            const { response: res } = e;
            new frontEndError(res.data.error, 'new-otp');
            setLoading('');
        }
    };

    return (
        <div
            className="row justify-content-center"
            style={{ maxWidth: '100%' }}
        >
            <div
                className="card m-2"
                style={{ width: '24rem', minWidth: '24rem' }}
            >
                <div className="card-body">
                    <div className="mb-1">
                        <div
                            className="input-group"
                            aria-describedby="new-otp-help"
                        >
                            <input
                                ref={otpRef}
                                type="text"
                                className="form-control"
                                id="new-otp"
                                placeholder="OTP"
                            />
                        </div>
                        <div
                            className="form-text text-center opacity-0"
                            id="new-otp-help"
                        >
                            {' \0'}
                        </div>
                    </div>
                    <div className="d-flex justify-content-evenly">
                        <div className="flex-grow-0">
                            <LoadingButton
                                loading={loading}
                                id="new-createUrl"
                                value="Verify OTP"
                                onClick={verify}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
