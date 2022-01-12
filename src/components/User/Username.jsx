import axios from 'axios';
import { useState, useRef } from 'react';

import frontEndError from '../../utils/frontEndError';

import { API_URL } from '../../env';

const Username = ({ user, setUser }) => {
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
                <p className="fw-bold my-auto">Name</p>
            </div>
            <div
                className={
                    'col-8 d-flex justify-content-end ' +
                    (mode === 'edit' ? 'py-2' : '')
                }
            >
                <p className="d-inline my-auto">{`${user.fname} ${user.lname}`}</p>
                <input
                    type="button"
                    value="edit"
                    className="btn btn-link m-2"
                    onClick={setEditMode}
                    disabled={mode === 'edit'}
                    title="Not Yet Working"
                />
            </div>
            {mode === 'view' ? (
                ''
            ) : (
                <EditUsername
                    user={user}
                    setUser={setUser}
                    setViewMode={setViewMode}
                />
            )}
        </div>
    );
};

const EditUsername = ({ user, setUser, setViewMode }) => {
    const fnameRef = useRef();
    const lnameRef = useRef();

    const changeUsername = async (e) => {
        e.preventDefault();
        const authToken = localStorage.getItem('authToken');
        const userToken = localStorage.getItem('userToken');
        if (!authToken || !userToken) setUser({});
        try {
            const fname = fnameRef.current.value;
            const lname = lnameRef.current.value;
            if (!fname)
                throw new frontEndError('First Name cant be empty', 'username');
            /*const res = */ await axios.put(
                `${API_URL}/user/${user._id}/changename`,
                { fname, lname },
                { headers: { Authorization: `Bearer ${authToken}` } }
            );
            setUser({ ...user, fname, lname });
            new frontEndError('Saved', 'first-name', '');
            document.getElementById('first-name').value = '';
            document.getElementById('last-name').value = '';
        } catch (e) {
            console.log(e.message);
        }
    };
    return (
        <div>
            <div className="mb-1">
                <div className="input-group">
                    <input
                        ref={fnameRef}
                        type="email"
                        className="form-control"
                        id="first-name"
                        placeholder="first name"
                    />
                    <input
                        ref={lnameRef}
                        type="text"
                        className="form-control"
                        id="last-name"
                        placeholder="last name"
                    />
                </div>
                <div
                    className="form-text text-center opacity-0"
                    id={'first-name-help'}
                >
                    {' \0'}
                </div>
            </div>

            <div className="d-flex justify-content-evenly">
                <input
                    type="button"
                    className="btn btn-primary flex-grow-0"
                    value="Save"
                    onClick={changeUsername}
                />
                <input
                    type="button"
                    className="btn btn-secondary flex-grow-0"
                    value="Cancel"
                    onClick={setViewMode}
                />
            </div>
        </div>
    );
};

export default Username;
