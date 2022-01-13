// import axios from 'axios';
// import { useState, useRef } from 'react';

// import LoadingButton from '../../utils/LoadingButton';

// import { API_URL } from '../../env';
// import frontEndError from '../../utils/frontEndError';

const Email = ({ user, setUser }) => {
    // const [mode, setMode] = useState('view');

    // const setEditMode = (e) => {
    //     setMode('edit');
    // };

    // const setViewMode = (e) => {
    //     setMode('view');
    // };

    return (
        <div className="row">
            <div className="col-sm-4 my-auto">
                <p className="fw-bold my-auto">Email</p>
            </div>
            <div
                className={
                    'col-sm-8 d-flex justify-content-end '
                    // (mode === 'edit' ? 'py-2' : '')
                }
            >
                <p className="m-auto">{user.email}</p>
                {/* <input
                    type="button"
                    value="edit"
                    className="btn btn-link m-2"
                    onClick={setEditMode}
                    disabled={mode === 'edit'}
                /> */}
            </div>
            {/* {mode === 'view' ? (
                ''
            ) : (
                <EditEmail
                    user={user}
                    setUser={setUser}
                    setViewMode={setViewMode}
                />
            )} */}
        </div>
    );
};

// const EditEmail = ({ user, setUser, setViewMode }) => {
//     const [email, setEmail] = useState();
//     const [loading, setLoading] = useState('');

//     const validEmail = useRef();
//     const otpRef = useRef();

//     const onEmail = (e) => setEmail(e.target.value);

//     const sendOtp = async (e) => {
//         e.preventDefault();
//         setLoading(e.target.id);
//         try {
//             console.log(user);
//             const { _id } = user;
//             const res = await axios.post(`${API_URL}/auth/resendotp`, {
//                 _id,
//                 email
//             });
//             // console.log(res);
//             new frontEndError('OTP sent', 'email', '');
//             validEmail.current = email;
//             e.target.disabled = true;
//             // e.target.value = '01:00';
//             // let count = 59;
//             // const timerId = setInterval(() => {
//             //     if (count == 0) clearInterval(timerId);
//             //     if (e.target) e.target.textContent = `00:${count}`;
//             //     else clearInterval(timerId);
//             //     --count;
//             // }, 1000);
//             // setTimeout(() => {
//             //     if (e.target) {
//             //         e.target.value = 'Send OTP';
//             //     }
//             // }, 60000);
//             setLoading('');
//         } catch (e) {
//             console.log(e.message);
//             setLoading('');
//         }
//     };
//     const changeEmail = async (e) => {
//         e.preventDefault();
//         setLoading(e.target.id);
//         const authToken = localStorage.getItem('authToken');
//         if (!authToken) setUser({});
//         try {
//             const otp = otpRef.current.value;
//             const newEmail = validEmail.current;

//             if (otp === '') throw new frontEndError('OTP cant be empty', 'otp');

//             const res = await axios.put(
//                 `${API_URL}/user/${user._id}/changeemail`,
//                 { newEmail, otp },
//                 { headers: { Authorization: `Bearer ${authToken}` } }
//             );
//             // console.log(res);
//             setLoading('');
//             setUser({ ...user, email });
//         } catch (e) {
//             // console.log(e.response);
//             setLoading('');
//         }
//     };
//     return (
//         <div>
//             <div className="mb-1">
//                 <div className="input-group">
//                     <input
//                         type="email"
//                         className="form-control"
//                         id="email"
//                         placeholder="Email"
//                         onChange={onEmail}
//                         disabled={validEmail.current}
//                     />
//                     <LoadingButton
//                         loading={loading}
//                         className="input-group-text"
//                         value="Send OTP"
//                         id="send-otp"
//                         onClick={sendOtp}
//                     />
//                 </div>
//                 <div className="form-text text-center" id={'email-help'}>
//                     {' \0'}
//                 </div>
//             </div>
//             <div className="mb-2">
//                 <div className="input-group">
//                     <input
//                         ref={otpRef}
//                         type="text"
//                         className="form-control"
//                         id="otp"
//                         placeholder="OTP"
//                         disabled={
//                             !validEmail.current || validEmail.current !== email
//                         }
//                     />
//                 </div>
//                 <div className="form-text text-center" id={'OTP-help'}>
//                     {' \0'}
//                 </div>
//             </div>

//             <div className="d-flex justify-content-evenly">
//                 <LoadingButton
//                     loading={loading}
//                     className={'flex-grow-0'}
//                     id="change-email"
//                     value="Save"
//                     onClick={changeEmail}
//                     disabled={
//                         loading || !validEmail || validEmail.current !== email
//                     }
//                 />

//                 <input
//                     type="button"
//                     className="btn btn-secondary flex-grow-0"
//                     value="Cancel"
//                     onClick={setViewMode}
//                 />
//             </div>
//         </div>
//     );
// };

export default Email;
