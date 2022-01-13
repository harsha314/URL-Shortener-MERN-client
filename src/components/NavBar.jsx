import { Link } from 'react-router-dom';
import { useEffect } from 'react';

const UnAuthenticatedNav = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
            <Link to="/" className="navbar-brand btn mb-0 h1 mx-3">
                URL-Shortener
            </Link>
            <button
                className="navbar-toggler mx-3"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>
            <div
                className="collapse navbar-collapse"
                id="navbarSupportedContent"
            >
                <ul className="navbar-nav mt-2 mt-lg-0 ms-auto mb-2 mb-lg-0">
                    <li className="nav-item mx-3">
                        <Link
                            to="/"
                            id="home-link"
                            className={`nav-link active text-center shadow-none`}
                        >
                            Home
                        </Link>
                    </li>
                    <li className="nav-item mx-3">
                        <Link
                            to="/signup"
                            id="signup-link"
                            className={`nav-link active text-center shadow-none`}
                        >
                            Sign-up
                        </Link>
                    </li>
                    <li className="nav-item mx-3">
                        <Link
                            to="/signin"
                            id="signin-link"
                            className={`nav-link active text-center shadow-none`}
                        >
                            Sign-in
                        </Link>
                    </li>
                    <li className="nav-item mx-3">
                        <Link
                            id="forgotpassword-link"
                            to="/forgotpassword"
                            className={`nav-link active text-center shadow-none`}
                        >
                            Forgot Password
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

const AuthenticatedNav = ({ setUser }) => {
    const signOut = (e) => {
        e.preventDefault();
        setUser({});
        localStorage.removeItem('authToken');
        localStorage.removeItem('userToken');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
            <Link to="/" className="navbar-brand btn mb-0 h1">
                URL-Shortener
            </Link>
            <button
                className="navbar-toggler mx-3"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>
            <div
                className="collapse navbar-collapse"
                id="navbarSupportedContent"
            >
                <ul className="navbar-nav mt-2 mt-lg-0 ms-auto mb-2 mb-lg-0">
                    <li className="nav-item mx-3">
                        <Link
                            to="/"
                            id="home-link"
                            className="nav-link active text-center shadow-none"
                        >
                            Home
                        </Link>
                    </li>
                    <li className="nav-item mx-3 ">
                        <Link
                            to="/profile"
                            id="profile-link"
                            className="nav-link active text-center shadow-none"
                        >
                            User Profile
                        </Link>
                    </li>
                    <li className="nav-item mx-3 ">
                        <Link
                            id="signin-link"
                            to="/signin"
                            className="nav-link active text-center"
                            onClick={signOut}
                        >
                            sign out
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

const NavBar = ({ user, setUser, location }) => {
    useEffect(() => {
        // console.log(location.pathname);
        let pathname = location.pathname.slice(1) || 'home';
        let highLighted = document.getElementById(`${pathname}-link`);
        if (highLighted && highLighted.classList) {
            highLighted.classList.add('btn-secondary');
            highLighted.classList.add('rounded');
        }
        return () => {
            // console.log(location.pathname);
            let pathname = location.pathname.slice(1) || 'home';
            let highLighted = document.getElementById(`${pathname}-link`);
            if (highLighted && highLighted.classList) {
                if (highLighted.classList.contains('btn-secondary'))
                    highLighted.classList.remove('btn-secondary');
                if (highLighted.classList.contains('rounded'))
                    highLighted.classList.remove('rounded');
            }
        };
    }, [location]);

    if (user.email) {
        return <AuthenticatedNav setUser={setUser} />;
    }

    return <UnAuthenticatedNav />;
};

export default NavBar;
