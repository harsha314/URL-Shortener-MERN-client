import { useEffect, useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import axios from 'axios';

import ProtectedRoute from './utils/ProtectedRoute';

import { API_URL } from './env';

// Components

import NavBar from './components/NavBar';
import LandingPage from './components/LandingPage';
import SignUp from './components/Auth/SignUp';
import SignIn from './components/Auth/SignIn';
import ForgotPassword from './components/Auth/ForgotPassword';
import NotFound from './components/Errors/NotFound';
import UserProfile from './components/User/UserProfile';
import InternalServerError from './components/Errors/InternalServerError';
import { useLocation } from 'react-router-dom';

const App = () => {
    const [user, setUser] = useState({});
    const [userLoading, setUserLoading] = useState(false);

    const location = useLocation();

    useEffect(() => {
        const loadUser = async () => {
            try {
                const authToken = localStorage.getItem('authToken');
                const userToken = localStorage.getItem('userToken');
                if (!authToken || !userToken) {
                    // console.log('no token(s)');
                    return;
                }

                setUserLoading(true);
                const res = await axios.get(`${API_URL}/user/${userToken}`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                });
                // setTimeout(() => {
                //     setUserLoading(false);
                // }, 3000);
                setUserLoading(false);
                setUser({ ...res.data.user });
            } catch (e) {
                // const { response: res } = e;
                console.log('App ', e.message);
                // console.log({ ...e });
                // console.log({ ...res });
                // show an internal error page
                // if (!res) setUser({ internalServerError: true });
                setUserLoading(false);
            }
        };
        loadUser();
        return () => {
            setUser({});
        };
    }, []);

    if (userLoading) {
        return (
            <div>
                <NavBar user={user} setUser={setUser} location={location} />
                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ height: '90vh' }}
                >
                    <div
                        className="spinner-grow"
                        style={{ width: '5vh', height: '5vh' }}
                    ></div>
                </div>
            </div>
        );
    }

    if (user.internalServerError) {
        return <InternalServerError setUser={setUser} />;
    }

    return (
        <div>
            <NavBar user={user} setUser={setUser} location={location} />
            <Switch>
                <Route exact path="/">
                    <LandingPage user={user} setUser={setUser} />
                </Route>
                <Route exact path="/signup">
                    <SignUp user={user} setUser={setUser} />
                </Route>
                <Route exact path="/signin">
                    <SignIn user={user} setUser={setUser} />
                </Route>
                <Route exact path="/forgotpassword">
                    <ForgotPassword user={user} setUser={setUser} />
                </Route>
                <ProtectedRoute user={user} exact path="/profile">
                    <UserProfile user={user} setUser={setUser} />
                </ProtectedRoute>
                <Route path="*">
                    <NotFound />
                </Route>
            </Switch>
        </div>
    );
};

export default App;
