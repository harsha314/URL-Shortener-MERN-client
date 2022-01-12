import { Route, Redirect } from 'react-router-dom';

const ProtectedRoute = ({ user, ...props }) => {
    if (!user || !user.email) {
        return (
            <Route {...props}>
                <Redirect to="/signin" />
            </Route>
        );
    }
    return (
        <Route user={user} {...props}>
            {props.children}
        </Route>
    );
};

export default ProtectedRoute;
