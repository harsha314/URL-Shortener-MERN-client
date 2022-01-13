const InternalServerError = ({ setUser }) => {
    const backToHome = (e) => {
        setUser({});
    };
    return (
        <div
            className="d-flex align-items-center justify-content-center flex-column"
            style={{ height: '100vh' }}
        >
            <h1>500 {'🤕'} Internal Server Error</h1>
            <div>
                <button onClick={backToHome} className="btn btn-warning m-3">
                    Back to Home
                </button>
            </div>
        </div>
    );
};

export default InternalServerError;
